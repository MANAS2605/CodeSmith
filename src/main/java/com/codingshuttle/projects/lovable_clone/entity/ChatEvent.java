package com.codingshuttle.projects.lovable_clone.entity;


import com.codingshuttle.projects.lovable_clone.enums.ChatEventType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level= AccessLevel.PRIVATE)//now no need to add private in front of each field
@Getter
@Setter
@Entity
@Table(name="chat_events")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatEvent {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    ChatMessage chatMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ChatEventType type;

    @Column(nullable = false)
    Integer sequenceOrder;

    @Column(columnDefinition = "text")
    String content;

    String filePath;//NULL unless FILE_EDIT

    @Column(columnDefinition = "text")
    String metadata;

}
