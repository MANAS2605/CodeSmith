package com.codingshuttle.projects.lovable_clone.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@FieldDefaults(level= AccessLevel.PRIVATE)//now no need to add private in front of each field
@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "projects",
    indexes = {
            @Index(name = "idx_projects_updated_at_desc",columnList = "updated_at DESC,deleted_at"),
            @Index(name = "idx_projects_deleted_at_updated_at_desc",columnList = "deleted_at,updated_at DESC"),
            @Index(name = "idx_projects_deleted_at",columnList = "deleted_at")
    }
)
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String name;
    

    Boolean isPublic=false;
    @CreationTimestamp
    Instant createdAt;//used to define time
    @UpdateTimestamp
    Instant updatedAt;
    Instant deletedAt;//soft delete

}
