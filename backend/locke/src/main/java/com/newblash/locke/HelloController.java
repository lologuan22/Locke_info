package com.newblash.locke;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public String sayHello() {
        return new String("Hello World!");
    }
    
}
