## Guides / Documentation / Usage
- [`[guide]` Quick install ](#how-to-setup-quick-guide)
- [[Interactive]]

### How to setup (Quick guide)

Download ESS from the NPM repo (latest release) `npm install electron-stats-server`

Install dependencies `npm install`

Build project files `npm run gulp:build`

Run the interactive setup to configure the application using the following command, this will guide you through setting up and ensuring all required settings are set.

`npm run start:interactive`

Make sure to migrate (setup) your database

`npm run db:migrate`

After completing the setup start the application (probably recommended to use something like PM2 to manage).

