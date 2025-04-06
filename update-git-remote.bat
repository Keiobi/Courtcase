@echo off
echo Updating Git remote URL for Courtcase Next.js...

echo.
echo Current remote URL:
git remote -v

echo.
echo Removing existing origin remote...
git remote remove origin

echo.
echo Adding new origin remote: https://github.com/Keiobi/Courtcase.git
git remote add origin https://github.com/Keiobi/Courtcase.git

echo.
echo New remote URL:
git remote -v

echo.
echo Ready to push to GitHub. Run the following command when ready:
echo git push -u origin main

echo.
echo Git remote updated successfully!
