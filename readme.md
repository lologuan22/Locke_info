# 🎮 游戏精灵背包图鉴系统

一个基于Spring Boot + MySQL + HTML/CSS/JavaScript的精灵图鉴与背包管理系统，支持用户登录、精灵收集、培养进度跟踪和数据可视化展示。

## 📋 目录
- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)


## 📖 项目简介
本项目是一个完整的游戏精灵图鉴与背包管理系统，实现了以下核心功能：
- 用户注册登录与权限管理
- 宠物图鉴大全浏览与搜索
- 个人精灵背包管理
- 精灵培养进度跟踪
- 属性雷达图与进度条可视化
- 智能培养建议生成

## ✨ 功能特性
### 核心功能
- ✅ 用户注册、登录、退出
- ✅ 宠物图鉴浏览（分页、搜索、筛选）
- ✅ 精灵背包管理（添加、查看、放生）
- ✅ 统一详情页（动态适配图鉴/背包模式）
- ✅ 属性雷达图可视化
- ✅ 培养进度条展示与编辑
- ✅ 智能培养建议生成

### 亮点功能
- 🎯 统一详情页设计，支持动态数据加载
- 📊 交互式雷达图，支持基础/养成数值切换
- 📈 进度条悬停提示，显示详细数值信息
- 💡 基于进度的智能培养建议
- 📱 响应式设计，适配移动端与桌面端

## 🛠️ 技术栈
### 前端技术
- HTML5 + CSS3 + JavaScript (ES6+)
- Chart.js (数据可视化)
- 原生Fetch API (前后端通信)
- 响应式Web设计

### 后端技术
- Spring Boot 2.x
- Spring Security + JWT (用户认证)
- Spring Data JPA (数据库操作)
- MySQL 8.0+ (数据库)

### 开发工具
- Git + GitHub (版本控制)
- Maven (依赖管理)
- MySQL Workbench (数据库管理)
- Postman (API测试)

## 📁 项目结构（暂拟）
project/
├── backend/          
│   ├── src/
│   ├── pom.xml
│   └── application.yml
├── frontend/          
│   ├── css/           
│   ├── js/           
│   │   ├── api.js    
│   │   ├── calculator.js 
│   │   └── charts.js  
│   ├── index.html     
│   └── assets/
├── database/         
│   ├── schema.sql     
│   ├── data.sql       
│   ├── queries.sql   
│   └── er_diagram.png 
├── docs/              
│   ├── API文档.md
│   ├── 数据库设计文档.md
│   └── 部署指南.md
└── README.md