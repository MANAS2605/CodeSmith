package com.codingshuttle.projects.lovable_clone.dto.auth;

public record AuthResponse(
        String token,
        UserProfileResponse user) {//immuatable class(fields immutable)
}

//dummy code:new AuthResponse("",new UserProfileResponse());
