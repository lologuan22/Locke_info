# build-frontend.ps1
$frontendPath = "../../frontend" 
$staticPath = "./src/main/resources/static"

# 1. 路径检查
if (-not (Test-Path $frontendPath)) {
    Write-Host "错误: 找不到前端目录 $frontendPath" -ForegroundColor Red
    exit 1  # 告诉 Maven 任务失败
}

Write-Host "开始构建前端项目..." -ForegroundColor Cyan

# 2. 执行构建 (使用 $? 检查上一个命令是否成功)
Push-Location $frontendPath

Write-Host "正在执行 npm install..."
npm install
if (-not $?) { 
    Write-Host "npm install 失败！" -ForegroundColor Red
    Pop-Location
    exit 1 
}

Write-Host "正在执行 npm run build..."
npm run build
if (-not $?) { 
    Write-Host "npm run build 失败！" -ForegroundColor Red
    Pop-Location
    exit 1 
}

Pop-Location

# 3. 产物校验
$distPath = Join-Path $frontendPath "dist"
if (-not (Test-Path $distPath)) {
    Write-Host "错误: 未生成 dist 文件夹，构建中断。" -ForegroundColor Red
    exit 1
}

# 4. 复制逻辑
Write-Host "正在同步产物到 SpringBoot..." -ForegroundColor Green
if (Test-Path $staticPath) { Remove-Item -Path "$staticPath\*" -Recurse -Force }
else { New-Item -ItemType Directory -Path $staticPath }

Copy-Item -Path "$distPath\*" -Destination $staticPath -Recurse -Force

Write-Host "前端构建并同步成功！" -ForegroundColor Blue
exit 0 # 正常退出