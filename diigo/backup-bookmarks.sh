set -e # this script will exit if any command returns a non-null value

# pre-requisite: $ brew install jq

source .env # must define DIIGO_USERNAME and DIIGO_URL_ENCODED_PASSWORD

BACKUP_PATH="$PWD"
TIMESTAMP="latest" # TODO
OUTPUT_FILE="$BACKUP_PATH/diigo-$TIMESTAMP.json"

echo "Backing up Diigo bookmarks to $OUTPUT_FILE ..."

# Status: pagination is not working as expected... maybe because of jq?

curl "https://$DIIGO_USERNAME:$DIIGO_URL_ENCODED_PASSWORD@secure.diigo.com/api/v2/bookmarks?user=$DIIGO_USERNAME&filter=all&sort=0&count=10&start=0" | jq . >0.json

curl "https://$DIIGO_USERNAME:$DIIGO_URL_ENCODED_PASSWORD@secure.diigo.com/api/v2/bookmarks?user=$DIIGO_USERNAME&filter=all&sort=0&count=10&start=1" | jq . >1.json

curl "https://$DIIGO_USERNAME:$DIIGO_URL_ENCODED_PASSWORD@secure.diigo.com/api/v2/bookmarks?user=$DIIGO_USERNAME&filter=all&sort=0&count=10&start=2" | jq . >2.json

# echo "✅ Done."
# echo "ℹ️ Next steps: run ./diff-changes.sh && zip-and-upload.sh && ./clean-up.sh"
