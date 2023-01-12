# Metadata Processor
REST API following the Serverless approach using AWS Lambda, API Gateway, DynamoDB, and the Serverless Framework
<br/>
<br/>
>## Configure Serverless environment in your PC
<br/>

- ### Install latest `Node.js` on your PC.
- ### Run the following command to install serverless environment using `'Command Prompt'`.

```sh
npm install serverless -g
```
<br/>

>## Install all Dependencies
<br/>

- ### Install all dependencies from a `package.json` file.

```sh
npm install
```
&nbsp;&nbsp;&nbsp;&nbsp; `OR`

```sh
npm i
```

<br/>

>## Configure Access to deploy Applications
<br/>

- ### The following command enables you to deploy a serverless application to AWS.
 
```sh
serverless config credentials --provider aws --key <Access key ID> --secret <Secret access key>
```
#### `Note: A User must have permission to deploy. Permissions in the policies (AWS) determine whether the request is allowed or denied and provide access to AWS resources.`
<br/>
<br/>

>## Deploy Application
<br/>

- ### Run the following command to deploy application using `'Git Bash'`.

```sh
serverless deploy
```
#### `Note: `<b>`'serverless'`</b>` can be replaced with`<b>` 'sls'.`</b>
<br/>

```sh
sls deploy
```