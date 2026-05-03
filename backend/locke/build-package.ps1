# build-package.ps1
param($targetDir, $finalName)

$distDir = Join-Path $targetDir "dist"
$runtimeDir = Join-Path $targetDir "custom-runtime"
$outputApp = "dist"
$jarName = "$finalName.jar"

Write-Host "--- Cleaning old build ---" -ForegroundColor Yellow
if (Test-Path $outputApp) { Remove-Item -Recurse -Force $outputApp }
if (Test-Path $runtimeDir) { Remove-Item -Recurse -Force $runtimeDir }

Write-Host "--- Generating JLink Runtime ---" -ForegroundColor Cyan
jlink --module-path "$env:JAVA_HOME\jmods" `
      --add-modules java.base,java.desktop,java.instrument,java.naming,java.prefs,java.rmi,java.scripting,java.sql,java.xml,java.management,java.security.sasl,java.security.jgss,java.transaction.xa,jdk.httpserver,jdk.unsupported,jdk.crypto.ec `
      --output $runtimeDir --strip-debug --no-man-pages --no-header-files

Write-Host "--- Running JPackage ---" -ForegroundColor Cyan
jpackage --type app-image `
         --dest $outputApp `
         --name "LockeApp" `
         --input $distDir `
         --main-jar $jarName `
         --main-class org.springframework.boot.loader.launch.JarLauncher `
         --runtime-image $runtimeDir `
         --win-console

Write-Host "--- Success! Check 'dist-app' folder ---" -ForegroundColor Green