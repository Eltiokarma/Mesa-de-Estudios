param(
    [string]$Libro = '1EN0I_nCIO_ELsQ2nY_CKaKYCTbGDCRpl',
    [ValidateRange(1,20)][int]$Limite = 5
)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$pythonCandidates = @((Join-Path $taskRoot '.venv/Scripts/python.exe'))
$pythonCandidates += @($env:CUZCANO_PYTHON)
$pythonCandidates += @('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1105-1297-0_26.1105.1297.0_x64__3k8sg7r9htsxt/dependencies/python/python.exe')
$pythonCandidates += @(Get-ChildItem 'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.*/dependencies/python/python.exe' -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -ExpandProperty FullName)
$taskPython = $pythonCandidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -First 1
if (-not $taskPython) { throw 'No se encontró Python. Instala Python 3.12 y las dependencias indicadas en fuentes/cuzcano/LEEME.md.' }
& $taskPython -X utf8 (Join-Path $PSScriptRoot 'mejorar_ocr_local.py') --libro $Libro --limite $Limite --abrir
if ($LASTEXITCODE -ne 0) { throw "El procesamiento terminó con código $LASTEXITCODE. Los originales se conservan." }
