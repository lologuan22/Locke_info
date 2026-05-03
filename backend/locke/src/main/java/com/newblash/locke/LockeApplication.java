package com.newblash.locke;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.newblash.locke.mapper")
public class LockeApplication {
	static {
		// 强制在类初始化前指定日志实现，绕过 MyBatis 的自动扫描逻辑
		org.apache.ibatis.logging.LogFactory.useSlf4jLogging();
	}

	public static void main(String[] args) {
		SpringApplication.run(LockeApplication.class, args);
	}

}
