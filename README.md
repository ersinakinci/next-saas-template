# Baby's first Next.js SaaS template 👶🍼💰

> Use this one weird trick to get your SaaS off the ground

## Getting started

```
npx create-next-app --example https://github.com/ersinakinci/next-saas-template my-saas-app
cd my-saas-app
```

Follow the instructions in the [Configuration](#configuration) section, and then:

```
npm run dev
```

## Features

- 🧱 Framework: [Next.js](https://nextjs.org)
- 🎨 CSS: [Tailwind CSS](https://tailwindcss.com)
  - [Typography](https://tailwindcss.com/docs/typography-plugin)
  - [Animate](https://tailwindcss.com/docs/animate-plugin)
- 🖱️ UI: [Shadcn UI](https://ui.shadcn.com)
- ⭐️ Icons: [Lucide](https://lucide.dev)
- 🗄️ Database: [Postgres](https://www.postgresql.org)
  - Client: [Kysely](https://kysely.dev)
  - Migrations: [Kysely-ctl](https://github.com/kysely-org/kysely-ctl)
  - Typegen: [Kanel](https://github.com/kysely-org/kanel)
  - ID generation: [Nano ID](https://github.com/ai/nanoid)
- 🔑 Authentication: [Auth.js](https://authjs.dev/)
- 💰 Payments: [Stripe](https://stripe.com)
  - Two subscription tiers: `free` and `pro`
- 📈 Analytics: [PostHog](https://posthog.com)
- 📧 Email
  - Marketing: [EmailOctopus](https://emailoctopus.com)
  - Transactional: [Resend](https://resend.com)
- 📄 CMS: [Builder.io](https://builder.io)
- 🚀 Deployment: [Vercel](https://vercel.com)

### Utils

- [date-fns](https://github.com/date-fns/date-fns)
- [date-fns-utc](https://github.com/date-fns/utc)
- [fetch-retry](https://github.com/sindresorhus/fetch-retry)
- [lodash-es](https://github.com/lodash/lodash)
- [tiny-invariant](https://github.com/alexreardon/tiny-invariant)

## Configuration

### Environment variables

- `AUTH_SECRET` - The secret to use for authentication. Generate with `npx auth secret`.
- `DATABASE_URL` - The URL of the database to use. Example: `postgresql://postgres:postgres@localhost:5432/postgres`.
- `EMAIL_OCTOPUS_API_KEY` - The API key for the EmailOctopus API.
- `EMAIL_OCTOPUS_USERS_LIST_ID` - The ID of the users list in EmailOctopus.
- `NEXT_PUBLIC_BUILDER_API_KEY` - The API key for the Builder.io CMS.
- `NEXT_PUBLIC_POSTHOG_HOST` - The host for the PostHog API
  - EU (for GDPR compliance): `https://eu.i.posthog.com`
  - US: `https://us.i.posthog.com`
- `NEXT_PUBLIC_POSTHOG_KEY` - The API key for the PostHog API.
- `NODE_ENV` - The environment to use (`development`, `test`, or `production`).
- `POSTHOG_API_KEY` - The API key for the PostHog API.

### Database

- Create your Postgres database, add the `DATABASE_URL` to your `.env.local` file (see above).
- Run `npm run db:migrate:latest` to create the database schema.
- Run `npm run db:typegen` to generate the database types.
