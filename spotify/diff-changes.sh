# set -e # this script will exit if any command returns a non-null value

OUTPUT_FILE="diff.log"

PREV_FILE="spotify.txt.bak"
LAST_FILE="spotify.txt"

echo "Generating diff of last two backups => ${OUTPUT_FILE} ..."
diff "${PREV_FILE}" "${LAST_FILE}" > "${OUTPUT_FILE}"

CHANGES="$(cat ${OUTPUT_FILE} | wc -l | tr -d ' ')"
ADDITIONS="$(grep '^> ' ${OUTPUT_FILE} | wc -l | tr -d ' ')"
REMOVALS="$(grep '^< ' ${OUTPUT_FILE} | wc -l | tr -d ' ')"
echo "🗒 found ${CHANGES} changes since last backup (+${ADDITIONS} -${REMOVALS})"

echo "✅ Done."
echo "ℹ️ Next steps: run zip-and-upload.sh && ./clean-up.sh"
