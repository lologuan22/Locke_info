package com.newblash.locke;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.newblash.locke.mapper")
public class LockeApplication {

	public static void main(String[] args) {
		SpringApplication.run(LockeApplication.class, args);
	}

}
