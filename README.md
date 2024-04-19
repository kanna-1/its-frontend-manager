## Project 1 - Frontend Management System for ITS

### Getting Started

To get started with your own development, you will need the following prerequisites:

1. A [Vercel account](https://vercel.com/signup)
2. Basic knowledge of [Git](https://git-scm.com/doc) and [NPM](https://www.npmjs.com/)
3. An email domain for sending emails

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
7. Rename the environment variable file `.env.local` to `.env`
8. For the environment variables under `# NextAuth`, `# Vercel Blob` and , `# Vercel Postgres` _(see below)_, you may retrieve them from _Vercel.com > Your project > Settings > Environment Variables._
9. For the `PUBLIC_URL` environment variable, you can retrieve it from _Vercel.com > Your project > Settings > Domains._ For example, the `PUBLIC_URL` environment variable for this project is set to `"https://its-frontend-manager.vercel.app"`.
10. For the sending of reset password email, you can either use third-party mail service providers or libraries such as [nodemailer](https://nodemailer.com/). You can refer to this [Vercel guide](https://vercel.com/guides/sending-emails-from-an-application-on-vercel) for more information.
11. If you use third-party service providers, you can remove the environment variables under `# Node Mailer` (_see below_) from your `.env` file. You will also have to reconfigure `send-reset-email.ts` based on your service provider's documentation.
12. For this project, our team has decided to use the Nodemailer library with [Zoho](https://www.zoho.com/mail/) email hosting service.
13. If you use `Nodemailer` with an email domain other than Zoho, you will have to reconfigure the environment variables under `# Node Mailer` (and possibly the _`send-reset-email.ts`_ file) based on the email domain used. You can read more about that at [nodemailer](https://nodemailer.com/).
14. If you choose to use Zoho email hosting service with the Nodemailer library, you can retrieve the following environment variables with the steps below:
- `SMTP_HOST="smtp.zoho.com"`, if you use the US data server, `SMTP_HOST="smtp.zoho.eu"` if you use the European data server.
- For `APP_PASSWORD`, you can generate an app password from _mail.zoho.com/ > My profile > My Account > Security > App Password_
- For `HOST_EMAIL`, you should use your Zoho mail account.

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

# Vercel deployment domain
PUBLIC_URL=""

# Node Mailer
APP_PASSWORD=""
HOST_EMAIL=""
SMTP_HOST=""
```

> For users familiar with Vercel workflow, you may use the [Vercel CLI](https://vercel.com/docs/cli) and directly pull the environment variables from the deployed project _(requires additional set up)_

```bash
vercel env pull
```

15. Install the project dependencies and generate Prisma client

```bash
npm install
```

### Part 3: Initialise the database

> At this point, you should have correctly configured the deployed project on Vercel and the local project environment

16. Push the database schema and seed the database with some initial values

```bash
npx prisma db push
npx prisma db seed
```

17. Finally you can view the deployed project or run a local development

```bash
npm run dev
# Open http://localhost:3000 with your browser
```

## Deploying with Docker

Before proceeding, ensure that you have Docker installed and running on your machine. More details can be found [here](https://docs.docker.com/get-docker/).

1. Ensure that you have already renamed the environment variable file `.env.local` to `.env`.
2. Ensure that the unfilled variables under `# NextAuth`, `# Vercel Blob` and `# Node Mailer` below has been filled with the environment variable's values obtained from Part 1 and 2 above.
3. Ensure that the environment variables under `# Docker` are filled with the values stated below.
4. The `.env` file should contain:
```bash
# NextAuth
AUTH_SECRET=""

# Vercel Blob
BLOB_READ_WRITE_TOKEN=""

# Node Mailer
APP_PASSWORD=""
HOST_EMAIL=""
SMTP_HOST=""

# Docker
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="postgres"
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres?schema=public"
```
5. In `/prisma/schema.prisma`, you should replace `datasource db` with the following changes:
```
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL") // uses connection pooling
  relationMode      = "foreignKeys"
}
```
4. Build your container with `npm run docker:compose:dev`.
5. Run `docker ps` to retrieve the CONTAINER ID for `its-frontend-manager-frontend` image.
6. Run `docker exec {CONTAINER ID} npx prisma db push`
7. Run `docker exec {CONTAINER ID} npx prisma db seed`
8. Open `http://localhost:3000` with your browser

You may read more about Next.js and Docker [here](https://nextjs.org/docs/app/building-your-application/deploying#docker-image).

