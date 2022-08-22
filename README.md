# a Node.js backend boilerplate with express, socket.io, mongodb and stripe

# Contributing

## Setting up the development environment

- Clone the repo with

  ```bash
  git clone https://github.com/eltharynd/node-ts-backend-boilerplate
  ```

- Install npm modules with

  ```bash
  npm install
  ```

- Create an empty '.env' file in the root foder and paste the development environment variables following the `sample.env` file.

## Starting the project with autoreload for development

- In a console tab run the following to compile the code in watch mode

  ```bash
  tsc -w
  ```

- In a different console tab run the following to start the server and make it reload on changes

  ```bash
  nodemon dist/index.js
  ```

## You can test your code with

```bash
  npm test
```

# Deploying

## Setting up the environment

- Follow the steps for setting up the development environment.

  ```bash
  git clone https://github.com/eltharynd/node-ts-backend-boilerplate

  npm install

  #create your .env file in the root directory
  ```

## Deploying manually

- Make sure to build your project with

  ```bash
  npm run build
  ```

- The project starts with

  ```bash
  npm run start
  ```

This can be used to run in any type of container or machine, usually in conjunction with [pm2](https://pm2.keymetrics.io/).

# Using for frontend testing

- Build the project with

  ```bash
  npm run build
  ```

- Start the project with

  ```bash
  npm run run:test
  ```

This will run the server with a **temporary** in-memory database filled with mock data.

From your front-end application you can then connect to [http://localhost:3000](http://localhost:3000)
