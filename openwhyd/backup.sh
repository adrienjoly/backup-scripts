set -e # this script will exit if any command returns a non-null value

TIMESTAMP="$(date +'%Y-%m-%d_%H-%M')_backup"
BACKUP_PATH="${PWD}/${TIMESTAMP}"

# ℹ️ the script will generate a subdirectory in it like: 2018-07-29_12-13-18_backup
echo "Output directory: ${BACKUP_PATH}"
mkdir -p $BACKUP_PATH

source ./.env # loads PROFILE_URL

echo "Backing up Openwhyd playlists from ${PROFILE_URL} to ${BACKUP_PATH} ..."

docker build -t "openwhyd-pl-dl" https://github.com/adrienjoly/openwhyd-pl-dl.git
docker run -it --rm \
           -v "${BACKUP_PATH}:/app" -w "/app" "openwhyd-pl-dl" \
           "/bin/bash" -c "/bin/bash <(wget -qO- https://raw.githubusercontent.com/adrienjoly/openwhyd-pl-dl/master/openwhyd-pl-dl-json.sh) ${PROFILE_URL}"

echo "✅ Done."
echo "ℹ️ Next steps: run ./diff-changes.sh && zip-and-upload.sh && ./clean-up.sh"
