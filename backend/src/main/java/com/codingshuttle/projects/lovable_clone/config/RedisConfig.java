package com.codingshuttle.projects.lovable_clone.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedisConfig {
    @Bean
    public RedisConfig redisConfig() {
        return new RedisConfig();
    }

}
