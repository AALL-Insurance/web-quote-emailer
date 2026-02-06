# Fail on first error
$ErrorActionPreference = "Stop"

# Project root (directory where this script lives)
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "Starting Node.js application with pnpm..." -ForegroundColor Cyan

# Ensure pnpm is available
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Error "pnpm is not installed or not in PATH."
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install
}

# Set environment variables (optional)
$env:NODE_ENV = "production"

# Building the app
Write-Host "Building app..." -ForegroundColor Green
pnpm build

# Start the app
Write-Host "Launching app..." -ForegroundColor Green
if ($args.Count -eq 0) {
    Write-Host "No arguments provided." -ForegroundColor Yellow
    exit 1
}

pnpm start $args