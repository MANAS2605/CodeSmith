package com.codingshuttle.projects.lovable_clone.mapper;

import com.codingshuttle.projects.lovable_clone.dto.member.MemberResponse;
import com.codingshuttle.projects.lovable_clone.entity.Project;
import com.codingshuttle.projects.lovable_clone.entity.ProjectMember;
import com.codingshuttle.projects.lovable_clone.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMemberMapper {

    @Mapping(source="id",target="userId")
    @Mapping(target="role",constant = "OWNER")
    MemberResponse toMemberResponseFromOwner(User user);

    @Mapping(source="user.id",target="userId")
    @Mapping(source="user.username",target="username")
    @Mapping(source="user.name",target="name")
    @Mapping(source="projectRole",target="role")
    MemberResponse toMemberResponseFromMember(ProjectMember projectMember);
}
