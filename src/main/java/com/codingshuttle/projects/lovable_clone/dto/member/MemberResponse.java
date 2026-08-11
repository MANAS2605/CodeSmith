package com.codingshuttle.projects.lovable_clone.dto.member;

import com.codingshuttle.projects.lovable_clone.enums.ProjectRole;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;

import java.time.Instant;


public record MemberResponse(
        Long userId,
        String username,
        String name,
        String avatarUrl,
        ProjectRole projectRole,
        Instant invitedAt

) {
}
