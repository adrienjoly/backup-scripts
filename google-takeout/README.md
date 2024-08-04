# Backup Google data

## Prerequisites / configuration

The procedure below assumes that you want to encrypt your Google backup archives before uploading them to a (cold) storage service, and that the corresponding passphrase is stored in your Bitwarden password manager account.

0. install `gpg`: `$ brew install gnupg`
1. create your own `.env` file, from the provided example: `cp .env.example .env`
2. install bitwarden CLI: `$ brew install bitwarden-cli`
3. login to bitwarden: `$ bw login`
4. find the identifier of the bitwarden entry containing the passphrase you want to use to encrypt your archives: `$ bw list items --search "Personal data backup" | jq '.[0].id'`
5. store that identifier as the value of the `BITWARDEN_ENTRY_ID` environment variable, in your `.env` file

## Backup procedure

Until I find a way to make uploads to Scaleway's glacier object storage service work from the command line (cf [wip procedure](./wip-upload-with-aws-cli.md)), here's how to proceed:

1. go to https://takeout.google.com/settings/takeout
2. select services which you want to backup data from => ask for an export archive
3. when the archive is ready (as notified by email), download the compressed files

Then, for each archive file:

1. encrypt the file: `encrypt.sh NAME_OF_ARCHIVE_FILE.tgz`
2. upload the encrypted file (e.g. `NAME_OF_ARCHIVE_FILE.tgz.gpg`) by dragging it to your bucket (e.g. https://console.scaleway.com/object-storage/xxx)

Pro tip: to prevent upload failures, plug your computer directly to your internet box, thru an ethernet cable.
