param($targetDir, $finalName)

$ErrorActionPreference = "Stop"

# --- 1. 环境验证与路径初始化 ---
if (-not $env:JAVA_HOME) {
    Write-Host "错误: 未检测到 JAVA_HOME 环境变量，请先配置 JDK 路径。" -ForegroundColor Red
    exit 1
}

# 手动指定工具绝对路径，防止 "Term not recognized" 错误
$javaBin = Join-Path $env:JAVA_HOME "bin"
$jlink = Join-Path $javaBin "jlink.exe"
$jpackage = Join-Path $javaBin "jpackage.exe"

# 验证工具是否存在
foreach ($tool in @($jlink, $jpackage)) {
    if (-not (Test-Path $tool)) {
        Write-Host "错误: 找不到工具 $tool ，请确保 JDK 版本为 17+ 且路径正确。" -ForegroundColor Red
        exit 1
    }
}

# 临时将 Java Bin 加入当前进程的 Path，双重保险
$env:Path = "$javaBin;" + $env:Path

# 定义目录结构
$distDir = Join-Path $targetDir "dist"
$runtimeDir = Join-Path $targetDir "custom-runtime"
$outputDir = Join-Path $targetDir "installer"
$jarPath = Join-Path $distDir "$finalName.jar"

# --- 2. 清理旧构建 ---
Write-Host "--- Pre-check: Closing existing app ---" -ForegroundColor Gray
Stop-Process -Name "LockeApp" -ErrorAction SilentlyContinue

Write-Host "--- Cleaning old build ---" -ForegroundColor Yellow
if (Test-Path $outputDir) { Remove-Item -Recurse -Force $outputDir }
if (Test-Path $runtimeDir) { Remove-Item -Recurse -Force $runtimeDir }

# --- 3. 生成 JLink 运行时 ---
Write-Host "--- Generating JLink Runtime ---" -ForegroundColor Cyan
Write-Host "Using JLink: $jlink" -ForegroundColor Gray

& $jlink --module-path "$env:JAVA_HOME\jmods" `
      --add-modules java.base,java.desktop,java.instrument,java.naming,java.prefs,java.rmi,java.scripting,java.sql,java.xml,java.management,java.security.sasl,java.security.jgss,java.transaction.xa,jdk.httpserver,jdk.unsupported,jdk.crypto.ec `
      --output $runtimeDir `
      --strip-debug `
      --no-man-pages `
      --no-header-files

# --- 4. 运行 JPackage 打包 ---
Write-Host "--- Running JPackage ---" -ForegroundColor Cyan
Write-Host "Using JPackage: $jpackage" -ForegroundColor Gray

try {
    & $jpackage --type app-image `
             --dest $outputDir `
             --name "LockeApp" `
             --input $distDir `
             --main-jar "$finalName.jar" `
             --icon "$PSScriptRoot\logo.ico" `
             --main-class org.springframework.boot.loader.launch.JarLauncher `
             --runtime-image $runtimeDir `
             --win-console

    if (-not $?) { throw "JPackage 运行失败" }
} catch {
    Write-Host "JPackage 打包出错: $_" -ForegroundColor Red
    exit 1
}

# --- 5. 部署脚本与清理 ---
$installRootDir = Join-Path $outputDir "LockeApp"

Write-Host "--- Deploying scripts to: $installRootDir ---" -ForegroundColor Cyan

try {
    # 复制启动脚本
    if (Test-Path "$PSScriptRoot\Start-App.ps1") {
        Copy-Item "$PSScriptRoot\Start-App.ps1" -Destination $installRootDir -Force
    }
    if (Test-Path "$PSScriptRoot\双击运行我.bat") {
        Copy-Item "$PSScriptRoot\双击运行我.bat" -Destination $outputDir -Force
    }
    Write-Host "部署成功！" -ForegroundColor Green
} catch {
    Write-Host "警告: 无法复制启动脚本，请检查文件是否存在。" -ForegroundColor Yellow
}

Write-Host "--- Build Finished! Location: $installRootDir ---" -ForegroundColor Green
exit 0