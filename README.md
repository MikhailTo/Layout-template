# Layout-template
Template for layout of sites with gulp, html, sass and js

## Must be installed:
1. [Git](https://git-scm.com/downloads)
2. [NodeJS](https://nodejs.org/en/download)
3. [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
```
npm install -g npm-check-updates

```
4. [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start)
```
npm install --global gulp-cli

```

## For start:
```
$ ncu -u --packageFile package.json
$ npm i
$ gulp
```

## Possible errors:
```
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: <...> module <...>
```
Solution:
```
const module; 
import("name-of-module").then(res => { 
		module = res; 
	});
```