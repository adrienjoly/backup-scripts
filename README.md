# backup-scripts

This repository contains a set of scripts that I run regularly to backup my content from local and online locations.

## Supported sources

Fully operational:
- Playlists and saved/liked tracks from Spotify
- Playlists and tracks added to Openwhyd

May not work as expected because of bugs from external docker images:
- Boards from Trello

In the future, I also plan to add support for:
- Diigo (bookmarks)
- local ssh keys

## Features and design decisions

- Does not require to install any dependency except Docker
- Each backup process is split into 4 scripts:
    - `backup`: gather the data to backup, into a local file or directory
    - `diff-changes`: display what data was added/removed/changed since the last backup
    - `zip-and-upload`: move the local backup to a directory for long-term storage
    - `clean-up`: remove previous backups from the long-term storage directory, to save some space
- There's just one step that is manual/interactive: `diff-changes`, and it's optional
- Store the last backup in a long-term storage directory that can be synced online (e.g. Google Drive)
- The backup scripts can be run locally, or from a server

## Status

Tested on:
- Mac OS 10.11.6 (El Capitan)
- macOS 10.14.6 (Mojave)

## Requirements

- a `bash` terminal
- docker

## Usage

```sh
$ git clone https://github.com/adrienjoly/backup-scripts.git
$ cd backup-scripts
$ cp .env.example .env
$ vi .env # => add the path of your cloud/upload/sync directory
```

Then, for each service: (e.g. Trello)

```sh
$ cd trello
$ cp .env.example .env
$ vi .env # => add your Trello API key and token
$ ./backup.sh && ./diff-changes.sh && ./zip-and-upload.sh && ./clean-up.sh
```
