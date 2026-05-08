# Set Encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Clear-Host
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "        LockeApp Launcher (Demo)          " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "[1] Local  (Backend + localhost)" -ForegroundColor White
Write-Host "[2] Remote (Online Demo)" -ForegroundColor White
Write-Host "[3] Exit" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan

$choice = Read-Host "Select mode"

switch ($choice) {
    "1" {
        Write-Host ">>> Starting backend..." -ForegroundColor Yellow
        Start-Process ".\LockeApp.exe" -WindowStyle Normal

        Write-Host ">>> Waiting 8 seconds for backend..." -ForegroundColor Gray
        Start-Sleep -Seconds 8

        Write-Host ">>> Opening browser..." -ForegroundColor Green
        Start-Process "http://localhost:8080/index.html"
    }
    "2" {
        Write-Host ">>> Redirecting to remote demo..." -ForegroundColor Green
        Start-Process "http://boot.ash-xiong.de5.net/"
    }
    "3" {
        exit
    }
    Default {
        Write-Host "Invalid input!" -ForegroundColor Red
        exit
    }
}

Write-Host "`nTask completed!" -ForegroundColor Cyan
Start-Sleep -Seconds 2