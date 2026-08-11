package com.codingshuttle.projects.lovable_clone.service;

import com.codingshuttle.projects.lovable_clone.dto.subscription.PlanResponse;
import com.codingshuttle.projects.lovable_clone.entity.Plan;

import java.util.List;

public interface PlanService {
    List<Plan> getAllPlans();

    List<PlanResponse> getAllActivePlans();
}
