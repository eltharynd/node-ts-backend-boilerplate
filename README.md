# Private GPT Backend

This repo contains the backend for the private gpt project.
It is currently intended for development/staging only.

## K-Lab gitlab registry authorization for npm

You will need to authorize npm to access the company's gitlab.
You can do that by following these steps:

- Create an access token from the [GitLab menu](https://gitlab.com/-/profile/personal_access_tokens) and generate a new one with all permissions
- Copy the following lines into your `.npmrc` config file making sure to paste your newly created token in there

  ```bash
  @klab:registry=https://gitlab.com/api/v4/projects/55236957/packages/npm/
  //gitlab.com/api/v4/projects/55236957/packages/npm/:_authToken=${GITLAB_TOKEN}
  ```

## Setting up the development environment

- Install npm modules with

  ```bash
  npm install
  ```

- Create an empty '.env' file in the root foder and paste the development environment variables found [here](https://knowledge-lab.atlassian.net/wiki/spaces/AI/pages/563216403/Private+GPT+Backend+.env).

## Starting the project with autoreload for development

- In a console tab run the following to compile the code in watch mode

  ```bash
  tsc -w
  ```

- In a different console tab run the following to start the server and make it reload on changes

  ```bash
  nodemon dist/index.js
  ```

## Testing your code

```bash
  npm test
```

# Test User for Development or Staging environment

```json
{
  "email": "test@k-lab.ch",
  "password": "averysecurepassword"
}
```

# Using the API

Documentation on the various endpoints can be found [here](https://knowledge-lab.atlassian.net/wiki/spaces/AI/pages/588546084/API).
