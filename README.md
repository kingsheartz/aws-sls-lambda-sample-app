# aws-sls-lambda-sample-app
Sample application with lambda API with nodeJS and dynamo DB using AWS Service

# run the following command to create new sample app

- `npm install serverless -g^C`
- `mkdir <Project Repo name>`
- `cd <Project Repo name>`
- `sls create -t aws-nodejs`
- `npm init -y`
- `npm install uuid`

# Configure Access to deploy Application from VS Code

- `serverless config credentials --provider aws --key <Access key ID> --secret <Secret access key>`

# Deploy Application

- `sls deploy`
