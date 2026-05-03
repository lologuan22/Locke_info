@echo off
:: 切换到脚本所在目录，防止路径错误
cd /d "%~dp0"

:: 调用 PowerShell 脚本
:: -ExecutionPolicy Bypass: 绕过系统执行策略限制（无需去设置里改权限）
:: -File: 指定运行的文件
powershell -NoProfile -ExecutionPolicy Bypass -File ".\LockeApp\Start-App.ps1"

exit