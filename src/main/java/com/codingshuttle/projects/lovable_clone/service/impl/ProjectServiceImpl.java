package com.codingshuttle.projects.lovable_clone.service.impl;

import com.codingshuttle.projects.lovable_clone.dto.project.ProjectRequest;
import com.codingshuttle.projects.lovable_clone.dto.project.ProjectResponse;
import com.codingshuttle.projects.lovable_clone.dto.project.ProjectSummaryResponse;
import com.codingshuttle.projects.lovable_clone.entity.Project;
import com.codingshuttle.projects.lovable_clone.entity.ProjectMember;
import com.codingshuttle.projects.lovable_clone.entity.ProjectMemberId;
import com.codingshuttle.projects.lovable_clone.entity.User;
import com.codingshuttle.projects.lovable_clone.enums.ProjectRole;
import com.codingshuttle.projects.lovable_clone.error.BadRequestException;
import com.codingshuttle.projects.lovable_clone.error.ResourceNotFoundException;
import com.codingshuttle.projects.lovable_clone.mapper.ProjectMapper;
import com.codingshuttle.projects.lovable_clone.repository.ProjectMemberRepository;
import com.codingshuttle.projects.lovable_clone.repository.ProjectRepository;
import com.codingshuttle.projects.lovable_clone.repository.UserRepository;
import com.codingshuttle.projects.lovable_clone.security.AuthUtil;
import com.codingshuttle.projects.lovable_clone.service.ProjectService;
import com.codingshuttle.projects.lovable_clone.service.ProjectTemplateService;
import com.codingshuttle.projects.lovable_clone.service.SubscriptionService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;


@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService {

    AuthUtil authUtil;

    ProjectRepository projectRepository;
    UserRepository userRepository;
    ProjectMapper projectMapper;
    ProjectMemberRepository projectMemberRepository;
    SubscriptionService subscriptionService;

    ProjectTemplateService projectTemplateService;


    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        if(!subscriptionService.canCreateNewProject()){
            throw new BadRequestException("You can't create new project with current Plan,Upgrade Plan Now!!");
        }
        Long userId = authUtil.getCurrentUserId();
//        User owner=userRepository.findById(userId).orElseThrow(
//                ()->new ResourceNotFoundException("User",userId.toString())
//        );//DB Call made+entire user object fetched
        User owner=userRepository.getReferenceById(userId);//No DB Call made,only userId fetched
        Project project= Project.builder()
                .name(request.name())
                .isPublic(false)
                .build();
        project=projectRepository.save(project);

        ProjectMemberId projectMemberId=new ProjectMemberId(project.getId(), owner.getId());
        ProjectMember projectMember=ProjectMember.builder()
                .Id(projectMemberId)
                .projectRole(ProjectRole.OWNER)
                .user(owner)
                .acceptedAt(Instant.now())
                .invitedAt(Instant.now())
                .project(project)
                .build();
        projectMemberRepository.save(projectMember);

        projectTemplateService.initializeProjectFromTemplate(project.getId());


        return projectMapper.toProjectResponse(project);

    }


    @Override

    public List<ProjectSummaryResponse> getUserProjects() {
        //        return projectRepository.findAllAccessibleByUser(userId)//method 1
//                .stream()
//                .map(projectMapper::toProjectSummaryResponse)
//                .collect(Collectors.toList());
        //method 2
        Long userId = authUtil.getCurrentUserId();
        var projectsWithRoles=projectRepository.findAllAccessibleByUser(userId);
        return projectsWithRoles.stream()
                .map(p->projectMapper.toProjectSummaryResponse(p.getProject(),p.getRole()))
                .toList();
    }



    @Override
    @PreAuthorize("@security.canViewProject(#projectId)")//Component("security")//SpEL
    public ProjectSummaryResponse getUserProjectById(Long projectId) {
        Long userId = authUtil.getCurrentUserId();
        var projectWithRole= projectRepository.findAccessibleProjectByIdWithRole(projectId, userId).orElseThrow(
                ()->new BadRequestException("Project Not Found!")
        );
        return projectMapper.toProjectSummaryResponse(projectWithRole.getProject(),projectWithRole.getRole());

    }


    @Override
    @PreAuthorize("@security.canEditProject(#projectId)")
    public ProjectResponse updateProject(Long projectId, ProjectRequest request) {

        Long userId = authUtil.getCurrentUserId();
        Project project=getAccessibleProjectById(projectId,userId);

        project.setName(request.name());
        project=projectRepository.save(project);//optional -transactional context will take care of it
        return projectMapper.toProjectResponse(project);

    }

    @Override
    @PreAuthorize("@security.canDeleteProject(#projectId)")
    public void softDelete(Long projectId) {

        Long userId = authUtil.getCurrentUserId();
        Project project=getAccessibleProjectById(projectId,userId);
        project.setDeletedAt(Instant.now());
        projectRepository.save(project);
    }


    //Internal Working

    public Project getAccessibleProjectById(Long projectId, Long userId){
        return projectRepository.findAccessibleProjectById(projectId,userId).orElseThrow(
                ()->new ResourceNotFoundException("Project",projectId.toString())
        );
    }


}
