package com.codingshuttle.projects.lovable_clone.service.impl;

import com.codingshuttle.projects.lovable_clone.dto.chat.StreamResponse;
import com.codingshuttle.projects.lovable_clone.entity.*;
import com.codingshuttle.projects.lovable_clone.enums.ChatEventType;
import com.codingshuttle.projects.lovable_clone.enums.MessageRole;
import com.codingshuttle.projects.lovable_clone.error.ResourceNotFoundException;
import com.codingshuttle.projects.lovable_clone.llm.LlmResponseParser;
import com.codingshuttle.projects.lovable_clone.llm.PromptUtils;
import com.codingshuttle.projects.lovable_clone.llm.advisors.FileTreeContextAdvisor;
import com.codingshuttle.projects.lovable_clone.llm.tools.CodeGenerationTools;
import com.codingshuttle.projects.lovable_clone.repository.*;
import com.codingshuttle.projects.lovable_clone.security.AuthUtil;
import com.codingshuttle.projects.lovable_clone.service.AiGenerationService;
import com.codingshuttle.projects.lovable_clone.service.ProjectFileService;
import com.codingshuttle.projects.lovable_clone.service.UsageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.metadata.Usage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiGenerationServiceImpl implements AiGenerationService {

    private final ChatClient chatClient;
    private final AuthUtil authUtil;
    private final ProjectFileService projectFileService;
    private final FileTreeContextAdvisor fileTreeContextAdvisor;
    private final ProjectRepository projectRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final LlmResponseParser llmResponseParser;
    private final ChatEventRepository chatEventRepository;
    private final UsageService usageService;


    private static final Pattern FILE_TAG_PATTERN = Pattern.compile("<file path=\"([^\"]+)\">(.*?)</file>", Pattern.DOTALL);

    @Override
    @PreAuthorize("@security.canEditProject(#projectId)")
    public Flux<StreamResponse> streamResponse(String userMessage, Long projectId) {

//        usageService.checkDailyTokensUsage();

        Long userId = authUtil.getCurrentUserId();
        ChatSession chatSession = createChatSessionIfNotExists(projectId, userId);

        Map<String, Object> advisorParams = Map.of(
                "userId", userId,
                "projectId", projectId
        );

        StringBuilder fullResponseBuffer = new StringBuilder();
        CodeGenerationTools codeGenerationTools = new CodeGenerationTools(projectFileService, projectId);

        AtomicReference<Long> startTime = new AtomicReference<>(System.currentTimeMillis());
        AtomicReference<Long> endTime = new AtomicReference<>(0L);
        AtomicReference<Usage> usageRef = new AtomicReference<>();

        return chatClient.prompt()
                .system(PromptUtils.CODE_GENERATION_SYSTEM_PROMPT)
                .user(userMessage)
                .tools(codeGenerationTools)
                .advisors(advisorSpec -> {
                    advisorSpec.params(advisorParams);
                    advisorSpec.advisors(fileTreeContextAdvisor);
                })
                .stream()
                .chatResponse()
                // 1) usage: runs for EVERY chunk, including the usage-only last one
                .doOnNext(response -> {
                    Usage u = response.getMetadata() != null ? response.getMetadata().getUsage() : null;
                    if (u != null && u.getTotalTokens() != null && u.getTotalTokens() > 0) {
                        usageRef.set(u);
                    }
                })
                // 2) drop chunks with no text (this is what stops the NPE)
                .filter(response -> response.getResult() != null
                        && response.getResult().getOutput() != null
                        && response.getResult().getOutput().getText() != null)
                // 3) text handling: safe now
                .doOnNext(response -> {
                    String content = response.getResult().getOutput().getText();
                    if (!content.isEmpty() && endTime.get() == 0) {
                        endTime.set(System.currentTimeMillis());
                    }
                    fullResponseBuffer.append(content);
                })
                .doOnComplete(() -> Schedulers.boundedElastic().schedule(() -> {
                    try {
                        long duration = (endTime.get() - startTime.get()) / 1000;
                        finalizeChats(userMessage, chatSession, fullResponseBuffer.toString(),
                                duration, usageRef.get());
                    } catch (Exception e) {
                        log.error("finalizeChats failed for projectId: {}", projectId, e);
                    }
                }))
                .doOnError(error -> log.error("Error during streaming for projectId: {}", projectId, error))
                .map(response -> new StreamResponse(response.getResult().getOutput().getText()));
    }

    private void finalizeChats(String userMessage, ChatSession chatSession,String fullText, Long duration,Usage usage) {

        Long projectId = chatSession.getProject().getId();
        if(usage!=null){
            int totalTokens=usage.getTotalTokens();
            usageService.recordTokensUsage(chatSession.getUser().getId(),totalTokens);
        }

        // Save the User message
        chatMessageRepository.save(
                ChatMessage.builder()
                        .chatSession(chatSession)
                        .role(MessageRole.USER)
                        .content(userMessage)
                        .tokensUsed(usage.getPromptTokens())
                        .build()
        );

        ChatMessage assistantChatMessage= ChatMessage.builder()
                .role(MessageRole.ASSISTANT)
                .content("Assistant Message here...")
                .chatSession(chatSession)
                .tokensUsed(usage.getCompletionTokens())
                .build();

        assistantChatMessage=chatMessageRepository.save(assistantChatMessage);

        List<ChatEvent> chatEventList= llmResponseParser.parseChatEvents(fullText,assistantChatMessage);
        chatEventList.addFirst(ChatEvent.builder()
                .type(ChatEventType.THOUGHT)
                .chatMessage(assistantChatMessage)
                .content("Thought for "+duration+"s")
                .sequenceOrder(0)
                .build()
        );

        chatEventList.stream()
                .filter(e-> e.getType()== ChatEventType.FILE_EDIT)
                .forEach(e-> projectFileService.saveFile(projectId,e.getFilePath(),e.getContent()));

        chatEventRepository.saveAll(chatEventList);

    }


    private ChatSession createChatSessionIfNotExists(Long projectId, Long userId) {
        ChatSessionId chatSessionId=new ChatSessionId(projectId,userId);
        ChatSession chatSession=chatSessionRepository.findById(chatSessionId).orElse(null);

        if(chatSession==null){
            Project project=projectRepository.findById(projectId).orElseThrow(
                    ()->new ResourceNotFoundException("Project",projectId.toString())
            );
            User user=userRepository.findById(userId).orElseThrow(
                    ()->new ResourceNotFoundException("User",userId.toString())
            );
            chatSession= ChatSession.builder()
                    .id(chatSessionId)
                    .user(user)
                    .project(project)
                    .build();
            chatSession=chatSessionRepository.save(chatSession);//check it once
        }
        return chatSession;

    }
}
