# build-package.ps1
param($targetDir, $finalName)

# 设置错误动作：一旦出错立即停止脚本，而不是跳过
$ErrorActionPreference = "Stop"

$distDir = Join-Path $targetDir "dist"
$runtimeDir = Join-Path $targetDir "custom-runtime"
$outputApp = "dist"  # 注意：如果这是 output 目录，确保它不被运行中的程序占用
$jarName = "$finalName.jar"

Write-Host "--- Pre-check: Closing existing app ---" -ForegroundColor Gray
# 尝试关闭正在运行的程序，防止文件锁死导致清理失败
Stop-Process -Name "LockeApp" -ErrorAction SilentlyContinue

Write-Host "--- Cleaning old build ---" -ForegroundColor Yellow
try {
    if (Test-Path $outputApp) { 
        Remove-Item -Recurse -Force $outputApp 
    }
    if (Test-Path $runtimeDir) { 
        Remove-Item -Recurse -Force $runtimeDir 
    }
} catch {
    Write-Host "致命错误: 无法清理旧的构建目录，文件可能被占用！" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1  # 显式返回 1 终止 Maven
}

Write-Host "--- Generating JLink Runtime ---" -ForegroundColor Cyan
try {
    jlink --module-path "$env:JAVA_HOME\jmods" `
          --add-modules java.base,java.desktop,java.instrument,java.naming,java.prefs,java.rmi,java.scripting,java.sql,java.xml,java.management,java.security.sasl,java.security.jgss,java.transaction.xa,jdk.httpserver,jdk.unsupported,jdk.crypto.ec `
          --output $runtimeDir --strip-debug --no-man-pages --no-header-files
} catch {
    Write-Host "JLink 生成失败！" -ForegroundColor Red
    exit 1
}

Write-Host "--- Running JPackage ---" -ForegroundColor Cyan
try {
    # 运行 jpackage，如果命令本身失败，try 会捕获
    jpackage --type app-image `
             --dest $outputApp `
             --name "LockeApp" `
             --input $distDir `
             --main-jar $jarName `
             --main-class org.springframework.boot.loader.launch.JarLauncher `
             --runtime-image $runtimeDir `
             --win-console
             
    # 二次检查是否生成成功
    if (-not $?) { throw "JPackage 命令执行返回了错误" }
} catch {
    Write-Host "JPackage 打包失败！" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host "--- Success! Check 'dist-app' folder ---" -ForegroundColor Green
exit 0 # 显式返回 0 表示成功