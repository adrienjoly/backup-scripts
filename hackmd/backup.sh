set -e # this script will exit if any command returns a non-null value

# for verbose logs, pass DEBUG='*'

TIMESTAMP="$(date +'%Y-%m-%d_%H-%M')_backup"
BACKUP_FILE="${PWD}/hackmd-${TIMESTAMP}.zip"

# ℹ️ the script will generate a subdirectory in it like: 2018-07-29_12-13-18_backup
echo "Output file: ${BACKUP_FILE}"

source ./.env # loads HACKMD_EMAIL and HACKMD_PWD

echo "Backing up HackMD notes for ${HACKMD_EMAIL} to ${BACKUP_FILE} ..."

(cd src/ && NODE_VERSION=$(cat ../.nvmrc) ~/.nvm/nvm-exec npm install)
NODE_VERSION=$(cat .nvmrc) HACKMD_EMAIL="${HACKMD_EMAIL}" HACKMD_PWD="${HACKMD_PWD}" DEBUG="${DEBUG}" ~/.nvm/nvm-exec node src/backup-hackmd.js "${HACKMD_EMAIL}" "${HACKMD_PWD}" > "${BACKUP_FILE}"

echo "✅ Done."
echo "ℹ️ Next steps: run ./diff-changes.sh && zip-and-upload.sh && ./clean-up.sh"
