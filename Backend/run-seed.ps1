# Strapi menu seed script for PowerShell
# Creates an API token if needed and runs the seed

$StrapiUrl = "http://localhost:1337"
$TokenName = "menu-seed-token"

Write-Host "Step 1: Logging into Strapi admin..." -ForegroundColor Cyan

# Try to register first (fresh install), then login
# Login
$loginBody = @{
    email = "mehrdadv67@gmail.com"
    password = "M78120562v@"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "$StrapiUrl/api/admin/login" -Method Post -Body ($loginBody | ConvertTo-Json) -ContentType "application/json"
    $adminJwt = $loginResponse.data.token
    Write-Host "  Logged in successfully." -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Could not log in. Please check your Strapi admin credentials." -ForegroundColor Red
    Write-Host "  Then run: `$env:STRAPI_API_TOKEN='your-token'; node seed-menu.js" -ForegroundColor Yellow
    exit 1
}

# Check if token already exists
Write-Host "Step 2: Checking for existing API tokens..." -ForegroundColor Cyan
$headers = @{
    Authorization = "Bearer $adminJwt"
}

try {
    $tokensResponse = Invoke-RestMethod -Uri "$StrapiUrl/api/admin/api-tokens" -Method Get -Headers $headers
    $existingToken = $tokensResponse.data | Where-Object { $_.name -eq $TokenName }
    if ($existingToken) {
        Write-Host "  Token '$TokenName' already exists." -ForegroundColor Green
        $env:STRAPI_API_TOKEN = $existingToken.accessKey
    } else {
        throw "No existing token found"
    }
} catch {
    Write-Host "  Creating new API token '$TokenName' with full access..." -ForegroundColor Cyan
    $tokenBody = @{
        name = $TokenName
        description = "Token for menu seed script"
        type = "full-access"
        lifespan = $null
    }
    
    try {
        $tokenResponse = Invoke-RestMethod -Uri "$StrapiUrl/api/admin/api-tokens" -Method Post -Body ($tokenBody | ConvertTo-Json) -ContentType "application/json" -Headers $headers
        $env:STRAPI_API_TOKEN = $tokenResponse.data.accessKey
        Write-Host "  Token created: $($env:STRAPI_API_TOKEN)" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR creating token: $_" -ForegroundColor Red
        exit 1
    }
}

# Run the seed script
Write-Host "Step 3: Running seed-menu.js..." -ForegroundColor Cyan
$env:STRAPI_URL = $StrapiUrl
$scriptPath = Join-Path $PSScriptRoot "seed-menu.js"
node $scriptPath

Write-Host "`nDone! Menu items should now be in Strapi's Content Manager." -ForegroundColor Green