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

- ✅ Framework: [Next.js](https://nextjs.org)
- ✅ CSS: [Tailwind CSS](https://tailwindcss.com)
- ✅ UI: [Shadcn UI](https://ui.shadcn.com)
- ✅ Icons: [Lucide](https://lucide.dev)
- ✅ Database: [Postgres](https://www.postgresql.org)
- ✅ Database client: [Kysely](https://kysely.dev)
- ✅ Database migrations: [Kysely-ctl](https://github.com/kysely-org/kysely-ctl)
- ✅ Database typegen: [Kanel](https://github.com/kysely-org/kanel)
- ✅ Authentication: [Auth.js](https://authjs.dev/)
- ✅ Payments: [Stripe](https://stripe.com)
- ✅ Deployment: [Vercel](https://vercel.com)

## Configuration

### Environment variables

- `AUTH_SECRET` - The secret to use for authentication. Generate with `npx auth secret`.
- `DATABASE_URL` - The URL of the database to use. Example: `postgresql://postgres:postgres@localhost:5432/postgres`.
