package com.codingshuttle.projects.lovable_clone.entity;

import com.codingshuttle.projects.lovable_clone.enums.ProjectRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@FieldDefaults(level= AccessLevel.PRIVATE)//now no need to add private in front of each field
@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "project_members")
public class  ProjectMember {

    @EmbeddedId//for composite ids
    ProjectMemberId Id;

    @ManyToOne//mamy to many m sirf 2 field rehti baaki hat jaati isliye yeh use kiya isme created at .modified at bhi rahegi
    @MapsId("projectId")//setting reference to projectMemberId's projectId
    Project project;

    @ManyToOne
    @MapsId("userId")//setting reference to projectMemberId's userId
    User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProjectRole projectRole;

    Instant invitedAt;
    Instant acceptedAt;

}
