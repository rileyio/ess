<h1 align="center">
  <img src="https://rawgit.com/tdmio/ess/master/ess-logo.svg" width="400px">

  electron-stats-server
</h1>
<p align="center">
  <a href="https://travis-ci.org/tdmio/ess">
  <img src="https://img.shields.io/travis/tdmio/ess/master.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/electron-stats-server">
  <img src="https://img.shields.io/npm/v/electron-stats-server.svg?style=flat-square"></a>
  <a href="https://github.com/tdmio/ess/wiki">
  <img src="https://img.shields.io/badge/GitHub-Wiki-blue.svg?style=flat-square"></a>
  <a href="https://github.com/tdmio/electron-stats">
  <img src="https://img.shields.io/badge/client-electron--stats-brightgreen.svg?style=flat-square"></a>
</p>

## What is ESS?

ESS for short is a self hosted application/system profile collection and reporting endpoint 
service primarily developed for the [`[electron-stats]`](https://github.com/tdmio/electron-stats) collector/module. This was developed for
tracking electron application installs and the systems being used for a better understanding 
of real world application(s) usage by users. ESS was designed with the intent to only collect 
non-user identifying information.

## What is currently supported for collection/reporting
```ts
App ->
  version:  string  // Application version
  electron: string  // Electron version
  arch:     string  // Architecture used
CPU ->
  cores:    number  // Count determined from os.cpu
  model:    string  // Example: Intel(R) Core(TM) i7-4770K CPU @ 3.50GHz
  speed:    number  // Speed in MHz
OS  ->
  release:  string  // OS release number, Example (from MacOS): 16.6.0
  platform: string  // OS base, Example (from MacOS): darwin
  memory:   string  // System memory in MBs
```

## Planned/Implemented features
- [x] Track basic system & application data
- [-] Interactive administration menu
  - [x] Test DB connection
  - [x] Manage Applications
  - [x] Manage authentication keys
  - [x] Basic stats output
  - [x] Load previous ESS config
- [x] Job queue
  - [x] Add existing profile (uuid hash) updates to queue
  - [x] Update processing
- [x] Authentication
- [ ] Tests
- [ ] Cleanup tasks
  - [ ] Expiry checks
  - [ ] Cleanup old unlinked app, cpu and os entries
- [ ] Reports API

## How to setup

Fetch the latest release from GitHub:
```
npm install tdmio/ess
```
Install dependencies `npm install`

Build project files `npm run gulp:build`

Run the interactive setup to configure the application using the following
command, this will guide you through setting up and ensuring all required
settings are set.

Make sure to migrate (setup) your database

```
npm run db:migrate

```

Access the interactive menu using:
```
npm run start:interactive
```

After completing the setup start the application (probably recommended to use
something like PM2 to manage).

## License

MIT
