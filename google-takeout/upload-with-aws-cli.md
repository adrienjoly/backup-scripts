# Uploading files to Scaleway using AWS CLI

Scaleway's documentation mentions that AWS CLI is recommended to upload large files, with https://www.scaleway.com/en/docs/storage/object/api-cli/object-operations/#putobject.

## 1. Install AWS CLI

E.g. using the GUI installer for MacOS, cf https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html.

Then, check that the CLI was correctly installed:

```sh
$ which aws
```

## 2. Setup the CLI for Scaleway

Follow [Scaleway's instructions](https://www.scaleway.com/en/docs/storage/object/api-cli/object-storage-aws-cli/#how-to-install-the-aws-cli) to:
- create a personal API key,
- enter the credentials with `$ aws configure`
- setup the endpoints in configuration files

Then, check the connection and list available buckets:

```sh
$ aws s3 ls --endpoint-url https://s3.fr-par.scw.cloud
```

> [!IMPORTANT]
> - As suggested in the instructions, double check that the cluster's location was updated everywhere in the file.
> - To prevent `Part number must be an integer between 1 and 10000, inclusive` errors on large files, given that uploads to Scaleway are limited to 1000 chunks, make sure that the `multipart_chunksize` setting has a value equal or higher than the size of the file divided by 1000.

## 3. Upload the file

```sh
$ aws s3 cp \
  --endpoint-url https://s3.fr-par.scw.cloud \
  /path-to-archive/takeout-xxx-001.tgz.gpg \
  s3://name_of_bucket/
```
