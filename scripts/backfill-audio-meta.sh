#!/bin/bash
# Backfill audioSize and duration for all posts with audio URLs
# Usage: ./scripts/backfill-audio-meta.sh [--dry-run]

set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "DRY RUN - no files will be modified"
fi

POSTS_DIR="./posts"
UPDATED=0
SKIPPED=0
ERRORS=0

# Check for ffprobe
if command -v ffprobe &> /dev/null; then
    HAS_FFPROBE=true
    echo "ffprobe found - will fetch durations"
else
    HAS_FFPROBE=false
    echo "ffprobe not found - durations will be skipped"
    echo "Install ffmpeg to enable duration detection"
fi

echo ""
echo "Scanning posts..."
echo ""

for post in "$POSTS_DIR"/*/index.md; do
    # Extract audio URL from frontmatter
    audio_line=$(grep "^audio:" "$post" 2>/dev/null || true)
    if [[ -z "$audio_line" ]]; then
        continue
    fi

    # Extract URL (handle both 'url' and "url" formats)
    audio_url=$(echo "$audio_line" | sed -E "s/audio:[[:space:]]*['\"]?([^'\"]+)['\"]?/\1/")

    if [[ -z "$audio_url" || "$audio_url" == "audio:" ]]; then
        continue
    fi

    # Check if already has audioSize
    if grep -q "^audioSize:" "$post" 2>/dev/null; then
        echo "SKIP: $post (already has audioSize)"
        ((SKIPPED++))
        continue
    fi

    echo "Processing: $post"
    echo "  URL: $audio_url"

    # Get file size via HEAD request
    size_response=$(curl -sI "$audio_url" 2>/dev/null || true)
    file_size=$(echo "$size_response" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')

    if [[ -z "$file_size" ]]; then
        echo "  ERROR: Could not get file size"
        ((ERRORS++))
        continue
    fi

    echo "  Size: $file_size bytes"

    # Get duration if
    obe available
    duration=""
    if [[ "$HAS_FFPROBE" == true ]]; then
        # ffprobe can read from URL directly
        duration_secs=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$audio_url" 2>/dev/null || true)

        if [[ -n "$duration_secs" ]]; then
            # Convert to HH:MM:SS or MM:SS
            duration_int=${duration_secs%.*}
            hours=$((duration_int / 3600))
            minutes=$(( (duration_int % 3600) / 60 ))
            seconds=$((duration_int % 60))

            if [[ $hours -gt 0 ]]; then
                duration=$(printf "%d:%02d:%02d" $hours $minutes $seconds)
            else
                duration=$(printf "%d:%02d" $minutes $seconds)
            fi
            echo "  Duration: $duration"
        else
            echo "  Duration: could not determine"
        fi
    fi

    if [[ "$DRY_RUN" == true ]]; then
        echo "  Would add: audioSize: $file_size"
        [[ -n "$duration" ]] && echo "  Would add: duration: '$duration'"
    else
        # Insert after audio: line
        if [[ -n "$duration" ]]; then
            # Use awk to insert both fields after audio: line
            awk -v size="$file_size" -v dur="$duration" '
                /^audio:/ { print; print "audioSize: " size; print "duration: \047" dur "\047"; next }
                { print }
            ' "$post" > "$post.tmp" && mv "$post.tmp" "$post"
        else
            # Just add audioSize
            awk -v size="$file_size" '
                /^audio:/ { print; print "audioSize: " size; next }
                { print }
            ' "$post" > "$post.tmp" && mv "$post.tmp" "$post"
        fi
        echo "  Updated!"
    fi

    ((UPDATED++))
    echo ""
done

echo "========================================="
echo "Done!"
echo "  Updated: $UPDATED"
echo "  Skipped: $SKIPPED"
echo "  Errors:  $ERRORS"
