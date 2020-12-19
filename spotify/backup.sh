set -e # this script will exit if any command returns a non-null value

DEST_FILE="spotify.txt"

echo "Backing up Spotify playlists to ${DEST_FILE} ..."

rm -f "${DEST_FILE}.bak"; mv "${DEST_FILE}" "${DEST_FILE}.bak" || true 
python3 "spotify-backup.py" "${DEST_FILE}" --dump=liked,playlists

# TODO: get rid of spotify-backup.py, use Docker instead:
# docker run -it --rm --env-file ./.env --expose 43019 -p 43019:43019 \
#            -v "$BACKUP_PATH:/app" "python:3.9.1-alpine3.12" \
#            "/bin/sh" -c 'wget https://raw.githubusercontent.com/caseychu/spotify-backup/d0bb610af74c5845e87d23eaf758c91a51e7b20e/spotify-backup.py;
#              python spotify-backup.py spotify.txt --dump=liked,playlists'

echo "✅ Done."
echo "ℹ️ Next steps: run ./diff-changes.sh && zip-and-upload.sh && ./clean-up.sh"
