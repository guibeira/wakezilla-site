# Forwarder: wakezilla.dev/install.ps1 -> repo install.ps1
# Keeps the short install URL stable while the real script lives in the repo.
param(
    [string]$Version,
    [string]$InstallDir,
    [string]$Target,
    [string]$Repo,
    [switch]$NoPath
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$installer = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/guibeira/wakezilla/main/install.ps1"
$installerBlock = [ScriptBlock]::Create($installer)

& $installerBlock @PSBoundParameters
