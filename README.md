# IdeaStorm 

Here's how to get started.

## Install app
`npm install`

## Install server
`cd server`
`npm install`

## Running backend
Copy deployConfig.sample.json to deployConfig.json, and change it as needed.

`node app.js`

If you run into "EMFILE" errors, try upping your open file limit (http://blog.izs.me/post/56827866110/wtf-is-emfile-and-why-does-it-happen-to-me)

## Running frontend
`grunt server`

## Minify app
`grunt build`

## Minify Server
`grunt min-server`
