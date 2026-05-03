# 设置编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Clear-Host
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "        LockeApp 启动器 (交互演示版)       " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "[1] 本地环境 (启动后端窗口 + 访问 localhost)" -ForegroundColor White
Write-Host "[2] 远程环境 (直接访问在线演示地址)" -ForegroundColor White
Write-Host "[3] 退出" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan

$choice = Read-Host "请选择运行模式"

switch ($choice) {
    "1" {
        Write-Host ">>> 正在开启后端控制台..." -ForegroundColor Yellow
        # 使用 Normal 模式开启新窗口，这样你可以看到 Spring Boot 的日志
        Start-Process ".\LockeApp.exe" -WindowStyle Normal
        
        Write-Host ">>> 等待后端日志加载 (8秒)..." -ForegroundColor Gray
        Start-Sleep -Seconds 8
        
        Write-Host ">>> 正在打开网页..." -ForegroundColor Green
        Start-Process "http://localhost:8080/index.html"
    }
    "2" {
        Write-Host ">>> 正在跳转至远程演示网址..." -ForegroundColor Green
        Start-Process "http://boot.ash-xiong.de5.net/"
    }
    "3" {
        exit
    }
    Default {
        Write-Host "无效输入。" -ForegroundColor Red
        exit
    }
}

Write-Host "`n脚本任务完成！" -ForegroundColor Cyan
Start-Sleep -Seconds 2