package com.codingshuttle.projects.lovable_clone.dto.auth;

import jakarta.validation.constraints.*;

public record LoginRequest (
       @Email @NotNull String username,
       @Size(min=4,max=20) String password
){
}
