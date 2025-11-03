#!/bin/bash

echo "🚀 Deploying Front-End Course PWA to GitHub Pages..."

# Always run from the script's own directory
cd "$(dirname "$0")"

# Fetch latest tags from remote
git fetch --tags

# Get latest version tag (default to v1.0.0)
latest_tag=$(git describe --tags --abbrev=0 2>/dev/null)
if [ -z "$latest_tag" ]; then
  latest_tag="v1.0.0"
fi

# Extract numeric parts and bump patch version (vX.Y.Z → vX.Y.(Z+1))
IFS='.' read -ra parts <<< "${latest_tag#v}"
major=${parts[0]}
minor=${parts[1]}
patch=${parts[2]}
new_patch=$((patch + 1))
new_tag="v$major.$minor.$new_patch"

# Update version.json automatically
echo "{ \"version\": \"$new_tag\" }" > version.json

# Stage and commit all changes
git add .
echo "📝 Enter your commit message:"
read commit_message
git commit -m "$commit_message"

# Push to main branch
git push origin main

# Create and push the new tag
git tag "$new_tag"
git push origin "$new_tag"

# Done
echo "✅ Deployment complete!"
echo "🏷️  Version: $new_tag"
echo "🌐 Live at: https://<your-username>.github.io/<your-repo-name>/"
