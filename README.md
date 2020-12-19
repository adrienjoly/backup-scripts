# backup-scripts

This repository contains a set of scripts that I run regularly to backup my content from local and online locations.

So far, just Trello and Spotify are supported.

In the future, I also plan to add support for:
- Diigo (bookmarks)
- local ssh keys

## Features and design decisions

- Does not require to install any dependency except Docker
- Each backup process is split into 4 scripts: backup, diff, archive and clean-up
- There's just one manual step, optional: check changes since last backup
- Store the last backup in a directory that can be synced online
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
