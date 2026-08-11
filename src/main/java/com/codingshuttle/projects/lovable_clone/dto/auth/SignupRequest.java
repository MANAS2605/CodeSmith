package com.codingshuttle.projects.lovable_clone.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SignupRequest(//record makes fields final and private
                            @Email @NotNull String username,
                            @NotBlank @Size(min=4,max=30) String name,
                            @NotBlank @Size(min=4) String password
) {
        
}
