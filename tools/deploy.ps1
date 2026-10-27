<#
.SYNOPSIS
    Local deployment of books.polascin.net to WebSupport over the SSH alias websupport.

.DESCRIPTION
    Local replacement for .github/workflows/deploy.yml. It performs the same work
    without GitHub:

      1. PHP syntax check on every tracked .php file.
      2. JavaScript syntax check on every tracked .js/.cjs/.mjs file.
      3. Node test suite (npm test).
      4. Tailwind freshness check: rebuild into a temporary file and compare it with
         the committed assets/css/tailwind.css.
      5. Deployable file list from git, filtered by .deployignore (the same source of
         truth as the rsync exclude list in the workflow).
      6. SHA-256 comparison against the remote web root, so only new and changed files
         are uploaded. rsync is not available on Windows and WSL is not used, so the
         delta is computed over SSH and transferred as a tar stream.
      7. Verification: every uploaded file is hashed again on the server.
      8. Smoke test of the public URLs.

    The script is a plan by default. Nothing is written to the server without -Apply.

.PARAMETER Apply
    Upload the changed files. Without this switch the script only reports the plan.

.PARAMETER SkipValidation
    Skip PHP, JavaScript, test and Tailwind checks.

.PARAMETER SkipSmoke
    Skip the post-deploy smoke test.

.EXAMPLE
    powershell -File .\tools\deploy.ps1

.EXAMPLE
    powershell -File .\tools\deploy.ps1 -Apply

.NOTES
    Windows PowerShell 5.1 and PowerShell 7. No rsync, no lftp, no WSL.
#>
[CmdletBinding()]
param(
    [string]   $RemotePath = '/data/8/6/868f981d-e598-4e71-b7f5-246f2e180cef/polascin.net/sub/books',
    [string]   $SshHost = 'websupport',
    [string]   $BaseUrl = 'https://books.polascin.net',
    [string[]] $SmokePaths = @('/', '/privacy.php', '/terms.php'),
    [switch]   $Apply,
    [switch]   $SkipValidation,
    [switch]   $SkipSmoke
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function Invoke-Native {
    param([string]$Exe, [string[]]$Arguments, [string]$WorkingDirectory = $root)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    Push-Location -LiteralPath $WorkingDirectory
    try {
        $out = & $Exe @Arguments 2>&1
        $code = $LASTEXITCODE
    }
    finally {
        Pop-Location
        $ErrorActionPreference = $prev
    }
    if ($code -ne 0) {
        throw ("{0} failed with exit code {1}`n{2}" -f $Exe, $code, ($out -join "`n"))
    }
    return $out
}

function Get-IgnorePatterns {
    $file = Join-Path $root '.deployignore'
    if (-not (Test-Path -LiteralPath $file)) { return @() }
    $patterns = @()
    foreach ($line in [System.IO.File]::ReadAllLines($file)) {
        $t = $line.Trim()
        if ($t.Length -eq 0 -or $t.StartsWith('#')) { continue }
        $patterns += $t
    }
    return $patterns
}

function Test-Ignored {
    param([string]$RelativePath, [string[]]$Patterns)
    $segments = $RelativePath -split '/'
    foreach ($p in $Patterns) {
        if ($p.Contains('/')) {
            if ($RelativePath -like $p) { return $true }
        }
        else {
            foreach ($s in $segments) { if ($s -like $p) { return $true } }
        }
    }
    return $false
}

function Get-TrackedFiles {
    param([string]$Pattern)
    $raw = Invoke-Native -Exe 'git' -Arguments @('-C', $root, 'ls-files', '-z', $Pattern)
    $joined = ($raw -join '')
    return @($joined -split "`0" | Where-Object { $_.Length -gt 0 })
}

function Get-DeployFiles {
    $paths = Get-TrackedFiles -Pattern '*'
    $patterns = Get-IgnorePatterns
    $kept = @()
    foreach ($p in $paths) {
        if (Test-Ignored -RelativePath $p -Patterns $patterns) { continue }
        if (-not (Test-Path -LiteralPath (Join-Path $root $p))) {
            Write-Warning "Tracked file missing from the working tree, skipped: $p"
            continue
        }
        $kept += $p
    }
    return $kept
}

function Get-LocalHashes {
    param([string[]]$Files)
    $map = @{}
    foreach ($f in $Files) {
        $map[$f] = (Get-FileHash -LiteralPath (Join-Path $root $f) -Algorithm SHA256).Hash.ToLowerInvariant()
    }
    return $map
}

function Get-RemoteHashes {
    $remote = "cd '$RemotePath' && find . -type f -print0 | xargs -0 -r sha256sum"
    $out = Invoke-Native -Exe 'ssh' -Arguments @('-o', 'BatchMode=yes', $SshHost, $remote)
    $map = @{}
    foreach ($line in $out) {
        if ($line -match '^([0-9a-f]{64})\s+\*?\./(.+)$') {
            $map[$Matches[2]] = $Matches[1]
        }
    }
    return $map
}

function Invoke-Validation {
    Write-Host 'Validation'

    $phpFiles = Get-TrackedFiles -Pattern '*.php'
    foreach ($f in $phpFiles) {
        $null = Invoke-Native -Exe 'php' -Arguments @('-l', (Join-Path $root $f))
    }
    Write-Host ("  php -l: {0} files OK" -f $phpFiles.Count)

    $jsFiles = @()
    foreach ($pattern in @('*.js', '*.cjs', '*.mjs')) { $jsFiles += Get-TrackedFiles -Pattern $pattern }
    $jsFiles = $jsFiles | Where-Object { $_ -notlike 'node_modules/*' }
    foreach ($f in $jsFiles) {
        $null = Invoke-Native -Exe 'node' -Arguments @('--check', (Join-Path $root $f))
    }
    Write-Host ("  node --check: {0} files OK" -f $jsFiles.Count)

    if (-not (Test-Path -LiteralPath (Join-Path $root 'node_modules'))) {
        throw 'node_modules is missing: run npm install before deploying (the test and Tailwind checks need it).'
    }
    $null = Invoke-Native -Exe 'npm.cmd' -Arguments @('test', '--silent')
    Write-Host '  npm test: OK'

    $committed = Join-Path $root 'assets\css\tailwind.css'
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('tailwind-' + [guid]::NewGuid().ToString('N') + '.css')
    try {
        $null = Invoke-Native -Exe 'node' -Arguments @('node_modules/tailwindcss/lib/cli.js', '-i', 'tools/tailwind.src.css', '-o', $tmp, '--minify')
        $a = (Get-FileHash -LiteralPath $committed -Algorithm SHA256).Hash
        $b = (Get-FileHash -LiteralPath $tmp -Algorithm SHA256).Hash
        if ($a -ne $b) {
            throw 'Committed assets/css/tailwind.css is stale: rebuild it with npm run build:css and commit the result.'
        }
        Write-Host '  Tailwind bundle: current'
    }
    finally {
        if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force }
    }
}

function Invoke-Smoke {
    Write-Host 'Smoke test'
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $failed = @()
    foreach ($p in $SmokePaths) {
        $url = $BaseUrl.TrimEnd('/') + $p
        try {
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -UserAgent $userAgent -MaximumRedirection 5 -TimeoutSec 30
            $code = [int]$r.StatusCode
        }
        catch {
            $resp = $_.Exception.Response
            if ($null -ne $resp) { $code = [int]$resp.StatusCode } else { $code = 0 }
        }
        Write-Host ("  {0,-24} {1}" -f $p, $code)
        if ($code -ne 200) { $failed += $p }
    }
    if ($failed.Count -gt 0) { throw ("Smoke test failed: " + ($failed -join ', ')) }
}

if (-not (Test-Path -LiteralPath (Join-Path $root '.git'))) {
    throw "Not a git working tree: $root"
}

if (-not $SkipValidation) { Invoke-Validation }

Write-Host 'Payload'
$files = Get-DeployFiles
Write-Host ("  {0} deployable files" -f $files.Count)
$local = Get-LocalHashes -Files $files
Write-Host ("  remote {0}" -f $RemotePath)
$remote = Get-RemoteHashes

$changed = @()
$same = 0
foreach ($f in $files) {
    if ($remote.ContainsKey($f) -and $remote[$f] -eq $local[$f]) { $same++ } else { $changed += $f }
}
$remoteOnly = @()
foreach ($k in $remote.Keys) {
    if (-not $local.ContainsKey($k)) { $remoteOnly += $k }
}

Write-Host ("  unchanged {0}, to upload {1}, remote-only {2}" -f $same, $changed.Count, $remoteOnly.Count)
foreach ($f in $changed) { Write-Host ("    upload {0}" -f $f) }
if ($remoteOnly.Count -gt 0) {
    Write-Host '    remote-only files are left in place (the workflow uses rsync without --delete):'
    foreach ($f in $remoteOnly) { Write-Host ("      keep {0}" -f $f) }
}

if (-not $Apply) {
    Write-Host ''
    Write-Host 'Plan only. Re-run with -Apply to deploy.'
    exit 0
}

if ($changed.Count -gt 0) {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $tarLocal = Join-Path ([System.IO.Path]::GetTempPath()) ("books-$stamp.tar")
    $tarRemote = "/tmp/books-$stamp.tar"
    try {
        $null = Invoke-Native -Exe 'tar' -Arguments (@('-cf', $tarLocal, '-C', $root) + $changed)
        $size = (Get-Item -LiteralPath $tarLocal).Length
        Write-Host ("Uploading {0} files ({1:N0} bytes)" -f $changed.Count, $size)
        $null = Invoke-Native -Exe 'scp' -Arguments @('-q', $tarLocal, ("{0}:{1}" -f $SshHost, $tarRemote))
        $remoteCmd = "cd '$RemotePath' && tar -xf '$tarRemote' && rm -f '$tarRemote'"
        $null = Invoke-Native -Exe 'ssh' -Arguments @('-o', 'BatchMode=yes', $SshHost, $remoteCmd)

        $after = Get-RemoteHashes
        $bad = @()
        foreach ($f in $changed) {
            if (-not $after.ContainsKey($f) -or $after[$f] -ne $local[$f]) { $bad += $f }
        }
        if ($bad.Count -gt 0) { throw ("Verification failed for: " + ($bad -join ', ')) }
        Write-Host 'Verification: all uploaded files match their local SHA-256.'
    }
    finally {
        if (Test-Path -LiteralPath $tarLocal) { Remove-Item -LiteralPath $tarLocal -Force }
    }
}
else {
    Write-Host 'Nothing to upload.'
}

if (-not $SkipSmoke) { Invoke-Smoke }
Write-Host 'Done.'
