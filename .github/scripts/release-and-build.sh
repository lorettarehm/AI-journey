#!/usr/bin/env bash
set -euo pipefail

echo "🛠 Starting multi-arch web-app build for commit $GITHUB_SHA"

# 1) Ensure all tags are fetched
git fetch --tags

# 2) Determine comparison point if triggered manually
if [[ -z "${GITHUB_EVENT_BEFORE:-}" ]]; then
  GITHUB_EVENT_BEFORE=$(git rev-parse HEAD^)
fi

REPO_URI="ghcr.io/${GITHUB_REPO_OWNER}/${IMAGE_NAME}"

# 3) Find last semver tag of the form: NAME@vX.Y.Z
LAST_TAG=$(git tag --list "${IMAGE_NAME}@v*.*.*" | sort -V | tail -n1)
if [[ -n "$LAST_TAG" ]]; then
  V="${LAST_TAG#*@v}"  # strip “NAME@v”
  IFS=. read -r MAJOR MINOR PATCH <<<"$V"
else
  MAJOR=0; MINOR=0; PATCH=0
fi

# 4) Determine bump type from commit title
COMMIT_TITLE=$(git log -1 --pretty=format:'%s')
if   echo "$COMMIT_TITLE" | grep -qiE "^(BREAKING CHANGE|MAJOR|!)"; then
  MAJOR=$(( MAJOR + 1 )); MINOR=0; PATCH=0
elif echo "$COMMIT_TITLE" | grep -qiE "^(feat|feature|minor)"; then
  MINOR=$(( MINOR + 1 )); PATCH=0
else
  PATCH=$(( PATCH + 1 ))
fi

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
NEW_TAG="${IMAGE_NAME}@v${NEW_VERSION}"

echo "  ↪︎ bumping $LAST_TAG → $NEW_VERSION"

# 5) Build and push a multi-arch image
echo "🚢 Building and pushing ${REPO_URI}:${NEW_VERSION} for linux/amd64,arm64..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "${REPO_URI}:${NEW_VERSION}" \
  --push .

# 6) Annotate + push the Git tag
git tag -a "$NEW_TAG" -m "Release $NEW_TAG"
echo "$NEW_VERSION" > latest_version.txt
git push origin --tags

echo "✅ Done: pushed ${REPO_URI}:${NEW_VERSION} and tag $NEW_TAG"
