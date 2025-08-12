Write-Output "Starting Grok'ed-Interpreter installation..."
Start-Sleep -Seconds 1

$ErrorActionPreference = "Stop"

# Paths
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $repoRoot
$uiPath = Join-Path $projectRoot "ui"
$venvPath = Join-Path $projectRoot ".venv"
$desktop = [Environment]::GetFolderPath('Desktop')

# 1) Install Node.js 18 LTS silently if missing or incompatible
function Get-NodeVersion {
  try { return (node -v) } catch { return $null }
}

function Install-Node18 {
  Write-Output "Installing Node.js 18 LTS..."
  $nodeUrl = "https://nodejs.org/dist/v18.19.1/node-v18.19.1-x64.msi"
  $nodeMsi = "$env:TEMP\node-v18.19.1-x64.msi"
  Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi
  Start-Process msiexec.exe -Wait -ArgumentList "/i `"$nodeMsi`" /qn /norestart"
  Remove-Item $nodeMsi -Force
}

$nodeVer = Get-NodeVersion
if (-not $nodeVer -or -not ($nodeVer -match "^v18\.")) {
  Install-Node18
}

# Reload PATH for current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
Write-Output "Node version: $(node -v)"

# 2) Python venv and package install
if (-not (Test-Path $venvPath)) {
  Write-Output "Creating Python virtual environment..."
  py -3 -m venv $venvPath
}

$activate = Join-Path $venvPath "Scripts\activate.ps1"
. $activate
python -m pip install -U pip

Write-Output "Installing grok-interpreter with UI/server extras..."
Set-Location $projectRoot
pip install -U ".[server,ui]" -r "$projectRoot\requirements.txt"

# 3) Install UI dependencies with compatible overrides
Write-Output "Installing UI dependencies..."
Set-Location $uiPath
if (Test-Path "$uiPath\node_modules") { Remove-Item -Recurse -Force "$uiPath\node_modules" }
npm install --legacy-peer-deps
# Ensure ajv compatibility
npm install -D ajv@^8 ajv-keywords@^5 --no-audit

# 4) Create start scripts
Set-Location $projectRoot
$startBackend = @"
@echo off
call "%venvPath%\Scripts\activate.bat"
python -m backend.server
"@
$startBackendPath = Join-Path $projectRoot "start-backend.bat"
$startBackend | Out-File -FilePath $startBackendPath -Encoding ascii -Force

$startUI = @"
@echo off
cd /d "%uiPath%"
npm start
"@
$startUIPath = Join-Path $projectRoot "start-ui.bat"
$startUI | Out-File -FilePath $startUIPath -Encoding ascii -Force

$startAll = @"
@echo off
start "Grok Backend" cmd /c ""%startBackendPath%""
start "Grok UI" cmd /c ""%startUIPath%""
"@
$startAllPath = Join-Path $projectRoot "start-grok-interpreter.bat"
$startAll | Out-File -FilePath $startAllPath -Encoding ascii -Force

# 5) Desktop shortcut
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut((Join-Path $desktop "Grok Interpreter.lnk"))
$shortcut.TargetPath = $startAllPath
$shortcut.WorkingDirectory = $projectRoot
$shortcut.IconLocation = "%SystemRoot%\\system32\\shell32.dll, 220"
$shortcut.Save()

Write-Output "Installation complete. Use the 'Grok Interpreter' desktop shortcut to launch."