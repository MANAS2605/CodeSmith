package com.codingshuttle.projects.lovable_clone.dto.chat;

import com.codingshuttle.projects.lovable_clone.enums.ChatEventType;
import jakarta.persistence.*;

public record ChatEventResponse(
        Long id,
        ChatEventType type,
        Integer sequenceOrder,
        String content,
        String filePath,//NULL unless FILE_EDIT
        String metadata
) {
}
