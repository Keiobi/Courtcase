@echo off
echo Syncing local repository with GitHub...

echo.
echo Fetching from remote repository...
git fetch origin

echo.
echo Attempting to merge remote changes...
git pull --no-rebase origin main

echo.
echo If there were merge conflicts, please resolve them and commit the changes.
echo Then run 'git push -u origin main' to push your changes to GitHub.

echo.
echo If there were no conflicts, pushing to GitHub...
git push -u origin main

echo.
echo Sync process completed. Check the output above for any errors or conflicts.
