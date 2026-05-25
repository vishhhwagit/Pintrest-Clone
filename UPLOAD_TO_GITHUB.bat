@echo off
title Upload Pinverse to GitHub
echo.
echo  ============================================
echo   PINVERSE - GitHub Website Upload Helper
echo  ============================================
echo.
echo  A ZIP file is ready on your Desktop/Downloads:
echo.
echo    Pinverse-GitHub-Upload.zip
echo.
echo  Location: %USERPROFILE%\Downloads\Pinverse-GitHub-Upload.zip
echo.
echo  STEPS (website only - no Git needed):
echo.
echo  1. Go to https://github.com/new
echo  2. Repository name: pinverse
echo  3. Do NOT add README - click Create repository
echo  4. Click "uploading an existing file"
echo  5. Drag Pinverse-GitHub-Upload.zip OR extract and drag files
echo  6. Commit message: Initial commit
echo  7. Click "Commit changes"
echo.
echo  Opening Downloads folder and GitHub in browser...
echo.
start "" "%USERPROFILE%\Downloads"
start "" "https://github.com/new"
pause
