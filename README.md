<h1 align="center">A starter for Svelte Kit and the Ory Stack 🚀</h1>

This project aims to be a "living", continuously maintained starting template and example of best practices for a modern web app built with [Svelte Kit](https://kit.svelte.dev/), secured using [Ory's open source libraries](https://github.com/ory). For now it only implements Kratos, but I will likely make branches to integrate with Oathkeeper and Keto as well.

Note that neither Svelte Kit or Ory Kratos are in version 1, and their APIs are subject to frequent change. This template attempts to shadow both libraries' latest versions.

- Current Svelte Kit version: **1.0.0-next.192**
- Current Ory Kratos version: **0.8.0-alpha.3**

## Why

This is for you if you like Svelte, and are building a modern web app that needs authentication. Ory Kratos lets you worry about the "meat" or "guts" of your application, instead of building out identity flows for the umpteenth time. You know what I'm talking about: Password hashing, 2FA/MFA, account verification, account recovery, account deletion, email changes, ...

Whether you use Ory or something else (Okta, Auth0, Firebase, Supabase, ...), I highly recommend against rolling your own auth. Defer to an identity provider that knows the ins and outs of identity security, best practices, legal compliance, and has the ear of hundreds if not thousands of companies in industry, storing billions of total identities.

## Features

- [x] TypeScript
- [x] All account flows:
	- [x] Registration
	- [x] Login
	- [x] Account verification
	- [x] Password reset
	- [x] Email change
	- [x] Account deletion by user
		- While user deletion is implemented as a Svelte Kit endpoint here,
chances are you'll want to call this from your own API or use [Kratos webhooks](https://www.ory.sh/kratos/docs/guides/integration-with-other-systems-using-web-hooks)
to clean up any associated user data your app may have stored.
- [x] Social login/OpenID Connect (example is GitHub login)
- [x] Everything server-side rendered
- [x] No runtime dependencies that are not required for Svelte Kit & Kratos
- [x] All flows end-to-end tested with Cypress - with utils like faker data generators, `cy.login` and `cy.register` for you to build upon.
- [x] Unit testing setup with Jest and [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)
- [x] Client-side validation and added UX where it makes sense (e.g. "show password" button). Some UX patterns you might think are a good idea are purposefully left out - see [password policy best practices](https://www.ory.sh/kratos/docs/concepts/security/#password-policy-best-practices)
- [x]  Customizable auth messages and errors via [message mapping](https://github.com/MicLeey/sveltekit-ory-starter/blob/main/src/lib/util/map-message.ts), for client/server message consistency, tone of voice, and i18n
- [x] Simple route guard for protected pages (see [`protected.svelte` example](https://github.com/MicLeey/sveltekit-ory-starter/blob/main/src/routes/protected.svelte))
- [ ] External API authorization example with [Ory Oathkeeper](https://github.com/ory/oathkeeper)
- [ ] RBAC example with [Ory Keto](https://github.com/ory/keto)
- [ ] Custom email template example
- [ ] Two/Multi-Factor authentication ([TOTP](https://en.wikipedia.org/wiki/Time-based_One-Time_Password)  & security codes)
- [ ] [WebAuthn](https://en.wikipedia.org/wiki/WebAuthn)

This template comes with almost no styling, and that is by design. It's meant to be a quick starter for your specific design/brand. Bring your own UX.

*Note*: This example does not enable account enumeration defenses. They are not a concern for my use cases so far. Make sure to read up on [Ory's excellent docs](https://www.ory.sh/kratos/docs/concepts/security/#account-enumeration-attacks) and adjust accordingly if account enumeration attacks are a concern for you.



## Usage

You will need [Node](https://nodejs.org/en/) version >= 14 and [Docker](https://www.docker.com/) installed to your system.

Either clone the repository or run
```bash
npx degit MicLeey/sveltekit-ory-starter
```

Copy `.env.example` to `.env` and update secrets as needed. **Don't use the dev settings in production**.
```bash
cp .env.example .env
```


Run containers
```bash
docker-compose up --build
```

Install dependencies and run the Svelte Kit app
```bash
npm install
npm run dev
```



## Questions you may have

#### How do I add more social login options?
[Start in the docs](https://www.ory.sh/kratos/docs/guides/sign-in-with-github-google-facebook-linkedin), most popular options have a step-by-step guide. The UI will automatically include an enabled sign-in option if it is configured.

#### How do I deploy with technology x or to platform y?
Deployment and hosting depend on your preferences and the rest of your stack, and are very much out of scope for this project. For an easier time with hosting Ory Kratos, get [early access for their cloud offering](https://www.ory.sh/pricing)

#### What about vendor lock-in?
The entire Ory ecosystem is open source and you can self-host whatever you want. Your data is yours, and can be migrated out at any time. If anything, there's "library" lock-in.

#### Does this have [anti-automation](https://www.ory.sh/kratos/docs/concepts/security/#anti-automation) (captchas, rate-limiting, ...) built in?
No, at the time of writing [Ory is still looking into how to make this work well](https://github.com/ory/kratos/issues/138). The TLDR is: use Cloudflare, or handle these concerns yourself. If you have ideas, make sure to leave feedback on the [relevant issue](https://www.ory.sh/kratos/docs/concepts/security/#anti-automation).

#### What about SEO, i18n, image optimization, ...?
This repository aims to solve authentication, and to stay as lean and simple to understand as possible. Not everyone needs the above in their application. A big advantage of using Svelte Kit is that they should be relatively easy to add yourself, especially through some of the community's excellent open source libraries.
