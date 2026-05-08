@echo off
chcp 65001 >nul
title 启动 LockeApp
color 0F

:: 切换到脚本所在目录（最稳定写法）
cd /d "%~dp0"

:: 检查 PowerShell 脚本是否存在
if not exist ".\LockeApp\Start-App.ps1" (
    echo 错误：未找到 LockeApp\Start-App.ps1 脚本文件
    pause
    exit /b 1
)

:: 安全执行 PowerShell 脚本（解决权限/编码/乱码所有问题）
powershell -NoProfile -ExecutionPolicy Bypass -Command "& {.\LockeApp\Start-App.ps1}"

:: 捕获执行结果
if %errorlevel% equ 0 (
    echo 脚本运行成功！
) else (
    echo 脚本运行失败，请检查 PowerShell 代码错误
    pause
)

exit /b