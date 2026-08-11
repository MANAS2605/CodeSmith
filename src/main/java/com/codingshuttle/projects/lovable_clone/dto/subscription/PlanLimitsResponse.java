package com.codingshuttle.projects.lovable_clone.dto.subscription;

import com.codingshuttle.projects.lovable_clone.entity.Plan;

public record PlanLimitsResponse(
        String planName,
        Integer maxTokensPerDay,
        Integer maxProjects,
        Boolean unlimitedAi
) {
}
