#!/bin/bash
# Swap the placeholder domain for your real one, across every file.
#   ./set-domain.sh https://your-domain.com
[ -z "$1" ] && { echo "Usage: ./set-domain.sh https://your-domain.com"; exit 1; }
NEW="${1%/}"
grep -rl "https://zenning-site.vercel.app" . --include="*.html" --include="*.xml" --include="*.txt" \
  | xargs sed -i.bak "s|https://zenning-site.vercel.app|$NEW|g"
find . -name "*.bak" -delete
echo "Domain set to $NEW"
