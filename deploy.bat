@echo off
echo Building and deploying Courtcase Next.js to Firebase...

echo.
echo Building Next.js application...
npm run build

echo.
echo Deploying to Firebase...
firebase deploy

echo.
echo Deployment complete!
