> [!IMPORTANT]
> So far, I did not manage to make these instructions work on 50 GB files.
> - `aws s3 cp` systematically fails with error: `(InvalidArgument) when calling the UploadPart operation: Part number must be an integer between 1 and 1000, inclusive`
> - `aws s3api put-object --bucket ajbackup --storage-class GLACIER --key archive.zip --body ./archive.zip` also failed with error: `(EntityTooLarge) when calling the PutObject operation (reached max retries: 2): Your proposed upload exceeds the maximum allowed size` (before I specified the `--storage-class GLACIER`, at least)
>
> => Instead, I'm uploading via the Scaleway's web interface, with a stable internet connection. 

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

## Reference links

- CLI suggested by Scaleway: [Understanding Object Storage object operations | Scaleway Documentation](https://www.scaleway.com/en/docs/object-storage/api-cli/object-operations/#putobject) (`aws s3api put-object` => no progress bar while uploading)
- AWS reference documentation for `put-object` API: [put-object — AWS CLI 1.38.8 Command Reference](https://docs.aws.amazon.com/cli/latest/reference/s3api/put-object.html)
- AWS reference documentation for `aws s3 cp` command: [cp — AWS CLI 1.38.8 Command Reference](https://docs.aws.amazon.com/cli/latest/reference/s3/cp.html#:~:text=Uploading%20a%20local%20file%20stream%20to%20S3)
