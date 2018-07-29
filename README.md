# backup-scripts

This repository contains a set of scripts that I run regularly to backup my content from local and online locations.

So far, just Trello is supported.

In the future, I also plan to add support for:
- Diigo (bookmarks)
- local ssh keys

## Features and design decisions

- Does not require to install any dependency except Docker
- Each backup process is split into 4 scripts: backup, diff, archive and clean-up
- Only manual step is optional: check changes since last backup
- Store the last backup in a directory that can be synced online
- The backup scripts can be run locally, or from a server

## Status

Only tested on Mac OS 10.11.6 (El Capitan), so far.

## Requirements

- a `bash` terminal
- docker

## Usage

```bash
$ git clone https://github.com/adrienjoly/backup-scripts.git
$ cd backup-scripts
$ cp .env.example .env
$ vi .env # => add the path of your cloud/upload/sync directory
$ cd trello
$ cp .env.example .env
$ vi .env # => add your Trello API key and token
$ ./backup.sh && ./diff-changes.sh && ./zip-and-upload.sh && ./clean-up.sh
```
