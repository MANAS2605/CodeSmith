package com.codingshuttle.projects.lovable_clone.entity;

import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level= AccessLevel.PRIVATE)//now no need to add private in front of each field
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class  ProjectMemberId {
    Long projectId;
    Long userId;
}
