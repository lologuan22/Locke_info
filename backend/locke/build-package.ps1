param($targetDir, $finalName)

$ErrorActionPreference = "Stop"

# 1. 定义清晰的绝对路径
$distDir = Join-Path $targetDir "dist"             # 输入源 (只有 jar 和 data)
$runtimeDir = Join-Path $targetDir "custom-runtime" # 运行时
$outputDir = Join-Path $targetDir "installer"     # 专门的输出目录，不要叫 dist
$jarName = "$finalName.jar"

Write-Host "--- Pre-check: Closing existing app ---" -ForegroundColor Gray
Stop-Process -Name "LockeApp" -ErrorAction SilentlyContinue

Write-Host "--- Cleaning old build ---" -ForegroundColor Yellow
# 清理旧的输出和运行时目录
if (Test-Path $outputDir) { Remove-Item -Recurse -Force $outputDir }
if (Test-Path $runtimeDir) { Remove-Item -Recurse -Force $runtimeDir }

Write-Host "--- Generating JLink Runtime ---" -ForegroundColor Cyan
jlink --module-path "$env:JAVA_HOME\jmods" `
      --add-modules java.base,java.desktop,java.instrument,java.naming,java.prefs,java.rmi,java.scripting,java.sql,java.xml,java.management,java.security.sasl,java.security.jgss,java.transaction.xa,jdk.httpserver,jdk.unsupported,jdk.crypto.ec `
      --output $runtimeDir --strip-debug --no-man-pages --no-header-files

Write-Host "--- Running JPackage ---" -ForegroundColor Cyan
try {
    jpackage --type app-image `
             --dest $outputDir `
             --name "LockeApp" `
             --input $distDir `
             --main-jar $jarName `
             --icon "$PSScriptRoot\logo.ico" `
             --main-class org.springframework.boot.loader.launch.JarLauncher `
             --runtime-image $runtimeDir `
             --win-console
             
    if (-not $?) { throw "JPackage 运行失败" }
} catch {
    Write-Host "JPackage 打包出错: $_" -ForegroundColor Red
    exit 1
}

# 2. 定位生成的根目录 (jpackage 会在 --dest 目录下创建 --name 文件夹)
$installRootDir = Join-Path $outputDir "LockeApp"

Write-Host "--- Deploying scripts to: $installRootDir ---" -ForegroundColor Cyan

# 3. 从项目根目录复制脚本
# 注意：$PSScriptRoot 是这个 ps1 所在的 backend/locke 目录
try {
    Copy-Item "$PSScriptRoot\Start-App.ps1" -Destination $installRootDir -Force
    Copy-Item "$PSScriptRoot\双击运行我.bat" -Destination $outputDir -Force
    Write-Host "部署成功！脚本已放置在 .exe 同级目录。" -ForegroundColor Green
} catch {
    Write-Host "警告: 无法复制启动脚本，请确认文件是否存在于 $PSScriptRoot" -ForegroundColor Yellow
}

Write-Host "--- Build Finished! Location: $installRootDir ---" -ForegroundColor Green
exit 0