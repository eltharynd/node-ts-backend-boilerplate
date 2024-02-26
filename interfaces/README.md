# Private GPT Interfaces

This is meant as a way to have data structures in one place to be used by both backend and frontend without rewriting them.

## Use in a different project

### 1️⃣ K-Lab gitlab registry authorization for npm

You will need to authorize npm to access the company's gitlab.
You can do that by following these steps:

- Create an access token from the [GitLab menu](https://gitlab.com/-/profile/personal_access_tokens) and generate a new one with all permissions
- Copy the following lines into your `.npmrc` config file making sure to paste your newly created token in there

```bash
@klab:registry=https://gitlab.com/api/v4/projects/55236957/packages/npm/
//gitlab.com/api/v4/projects/55236957/packages/npm/:_authToken=${GITLAB_TOKEN}
```

### 2️⃣ Install

You can simply install with:

```bash
npm i -S @klab/private-gpt-interfaces
```

Import whatever you need as you would normally

```typescript
import {} from '@klab/private-gpt-interfaces'
```

## Developing from a different repo

Inside the root folder of your other repo (for example private-gpt-backend):

- Make sure `.gitignore` contains `/private-gpt-interfaces` so you won't push this code to the wrong repo
- Run `git clone https://gitlab.com/innovation24/klab_dev/ai/private-gpt/private-gpt-interfaces`
- Open the created folder `cd private-gpt-interfaces`
- Link this folder in npm global node_modules `npm link`
- Back in your project's root `cd ..`
- Tell npm to link from local instead of registry `npm link @klab/private-gpt-interfaces`

⚠️⚠️⚠️ **ONLY DO THIS IF YOU KNOW WHAT YOU'RE DOING** ⚠️⚠️⚠️

This will always use your local files, so you won't be able to pull remote changes with `npm i` and you will have to build before changes can take effect `cd private-gpt-interfaces && npm run build`

To undo this:

- Run `npm unlink @klab/private-gpt-interfaces`
- And reinstall from registry `npm install`
