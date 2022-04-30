set -e # this script will exit if any command returns a non-null value

DIRS="$(find * -type d -maxdepth 0)"

TWO_LAST_DIRS=($(find * -type d -maxdepth 0 | tail -2))
PREV_POSTS="${TWO_LAST_DIRS[0]}/posts.json"
CURR_POSTS="${TWO_LAST_DIRS[1]}/posts.json"

echo "Generating diff between ${PREV_POSTS} and ${CURR_POSTS} ..."

diff "${PREV_POSTS}" "${CURR_POSTS}" && echo "ℹ️  No difference was found between the two last backups"

echo "✅ Done."
echo "ℹ️  Next steps: run ./zip-and-upload.sh && ./clean-up.sh"
