@echo off
echo Initializing Git repository for Courtcase Next.js...

git init
git add .
git commit -m "Initial commit for Courtcase Next.js app"

echo.
echo Setting up remote origin: https://github.com/Keiobi/Prod.git
git remote add origin https://github.com/Keiobi/Prod.git

echo.
echo Creating main branch...
git branch -M main

echo.
echo Ready to push to GitHub. Run the following command when ready:
echo git push -u origin main

echo.
echo Git repository initialized successfully!
