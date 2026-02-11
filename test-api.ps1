# Test the API
$api = "http://localhost:5000"

Write-Host "Testing API health..."
Invoke-WebRequest -Uri "$api/" -Method Get | Select-Object StatusCode, Content

# Note: To test /expense endpoint, you need to:
# 1. Login first to get access token
# 2. Use that token in Authorization header: "Bearer {token}"
# 3. Call GET /expense?page=1&limit=10
