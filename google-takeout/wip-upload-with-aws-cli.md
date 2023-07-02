# Scaleway's documentation mentions that AWS CLI is recommended to upload large files,
# with https://www.scaleway.com/en/docs/storage/object/api-cli/object-operations/#putobject

# Install the CLI
# cf https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
which aws # to check if & where it was installed
aws --version

# Setup the CLI for Scaleway
# cf https://www.scaleway.com/en/docs/storage/object/api-cli/object-storage-aws-cli/#how-to-install-the-aws-cli
aws configure set plugins.endpoint awscli_plugin_endpoint
nano ~/.aws/config # to specify the endpoint listed on https://console.scaleway.com/object-storage/buckets/fr-par/ajbackup/settings
aws configure # cf https://www.scaleway.com/en/docs/identity-and-access-management/iam/how-to/create-api-keys/
cat ~/.aws/credentials # to check that credentials are set
aws s3 ls  --endpoint-url https://s3.fr-par.scw.cloud # to test the cluster

# Upload the file
aws s3 --endpoint-url https://s3.fr-par.scw.cloud cp "/path-to-archive/takeout-xxx-001.tgz.gpg" s3://name_of_bucket/
# Note: this does not work as expected..., cf https://console.scaleway.com/support/tickets/500AX000001r8txYAA
