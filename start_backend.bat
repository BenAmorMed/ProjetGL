@echo off
echo ====================================
echo Building Backend Application...
echo ====================================
cd backend

echo Cleaning and packaging...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ====================================
echo Starting Backend Server...
echo ====================================
echo Access the application at: http://localhost:8080
echo Access Swagger UI at: http://localhost:8080/swagger-ui.html
echo Press Ctrl+C to stop the server
echo ====================================
echo.

java -jar target\exam-surveillance-0.0.1-SNAPSHOT.jar
pause
