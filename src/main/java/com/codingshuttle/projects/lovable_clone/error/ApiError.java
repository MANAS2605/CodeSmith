package com.codingshuttle.projects.lovable_clone.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.List;

public record ApiError(
        HttpStatus status,
        String message,
        Instant timeStamp,
        @JsonInclude(JsonInclude.Include.NON_NULL) List<ApiFieldError> errors
) {
    public ApiError(HttpStatus httpStatus,String message){
        this(httpStatus,message,Instant.now(),null);
    }
    public ApiError(
            HttpStatus httpStatus,
            String message,
            List<ApiFieldError> errors
    ){
        this(HttpStatus.BAD_REQUEST,message,Instant.now(),errors);
    }
}

record ApiFieldError(String field,String message){}
