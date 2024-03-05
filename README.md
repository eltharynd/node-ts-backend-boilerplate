# Node TS Backend BOilerplate

This repo contains a boilerplate backend with Nodejs and Express in Typescript.
It is currently intended for development/staging only.

## Setting up the development environment

- Install npm modules with

  ```bash
  npm install
  ```

- Create an empty `.env` file in the root foder using `sample.env` as an example.

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
