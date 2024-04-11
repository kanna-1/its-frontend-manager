## Project 1 - Frontend Management System for ITS

### Getting Started

To get started with your own development, you will need the following prerequisites:

1. A [Vercel account](https://vercel.com/signup)
2. Basic knowledge of [Git](https://git-scm.com/doc) and [NPM](https://www.npmjs.com/)

### Part 1: Set up a Vercel environment

> For the purpose of this project, we have chosen to use Vercel and its storage services ([Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)) for ease of deployment.

1. Fork this repository using these [steps](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#forking-a-repository)
2. Import the forked repository to Vercel using these [steps](https://vercel.com/docs/getting-started-with-vercel/import)
3. Add the following environment variable during the import process

```bash
# Key: AUTH_SECRET
# Value:
openssl rand -base64 32
```

> For advanced use, you may have different sets of environment variables (e.g. API keys) for production, preview and development. This setting may be changed in the project settings later. For the initial set up, you may check all environments to be applied for a variable. More information can be found [here](https://vercel.com/docs/projects/environment-variables#environments).

4. Follow the steps in this [guide](https://vercel.com/docs/storage/vercel-postgres/quickstart#create-a-postgres-database) to create and connect Vercel Postgres to your project _(similar steps for Vercel Blob)_

> You may name the database however you wish.

### Part 2: Set up a local environment

5. Clone the forked repository into your local drive
6. Navigate to the project directory with your preferred IDE or via the CLI
7. Rename the environment variable file `.env.local` to `.env` and fill in the corresponding key-value (you may retrieve them from _Vercel.com > Your project > Settings > Environment Variables_)

```bash
# NextAuth
AUTH_SECRET=""

# Vercel Blob
BLOB_READ_WRITE_TOKEN=""

# Vercel Postgres
POSTGRES_DATABASE=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_URL_NO_SSL=""
POSTGRES_USER=""

# Node Mailer
APP_PASSWORD=""
HOST_EMAIL=""
PUBLIC_URL=""
SMTP_HOST=""
```

> For users familiar with Vercel workflow, you may use the [Vercel CLI](https://vercel.com/docs/cli) and directly pull the environment variables from the deployed project _(requires additional set up)_

```bash
vercel env pull
```

9. Install the project dependencies and generate Prisma client

```bash
npm install
```

### Part 3: Initialise the database

> At this point, you should have correctly configured the deployed project on Vercel and the local project environment

10. Push the database schema and seed the database with some initial values

```bash
npx prisma db push
npx prisma db seed
```

11. Finally you can view the deployed project or run a local development

```bash
npm run dev
# Open http://localhost:3000 with your browser
```

## Deploying with Docker

Before proceeding, ensure that you have Docker installed on your machine. More details can be found [here](https://docs.docker.com/get-docker/).

1. Build your container with `docker build -t frontend-manager .`

2. Run your container with `docker run -p 3000:3000 frontend-manager`

You may read more about Next.js and Docker [here](https://nextjs.org/docs/app/building-your-application/deploying#docker-image).

