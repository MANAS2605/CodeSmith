package com.codingshuttle.projects.lovable_clone.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Set;

import static com.codingshuttle.projects.lovable_clone.enums.ProjectPermission.*;
@RequiredArgsConstructor
@Getter
public enum ProjectRole {
    EDITOR(EDIT,VIEW,DELETE,VIEW_MEMBERS),
    VIEWER(VIEW,VIEW_MEMBERS),
    OWNER(EDIT,VIEW,DELETE,MANAGE_MEMBERS,VIEW_MEMBERS);

    ProjectRole(ProjectPermission... permissions) {
        this.permissions = Set.of(permissions) ;
    }

    private final Set<ProjectPermission> permissions;
}
