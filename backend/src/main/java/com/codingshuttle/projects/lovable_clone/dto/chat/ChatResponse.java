package com.codingshuttle.projects.lovable_clone.dto.chat;

import com.codingshuttle.projects.lovable_clone.entity.ChatEvent;
import com.codingshuttle.projects.lovable_clone.entity.ChatSession;
import com.codingshuttle.projects.lovable_clone.enums.MessageRole;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.List;

public record ChatResponse(
        Long id,
        MessageRole role, // USER, ASSISTANT
        List<ChatEventResponse> events,
        String content, // NULL unless USER role
        Integer tokensUsed,
        Instant createdAt
) {
}
