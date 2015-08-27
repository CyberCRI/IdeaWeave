# IdeaWeave 

IdeaWeave is a collaborative platform intended to help people sharing idea and organise themself in team. It has two separate components, a server and a client.

## Javascript fullstack
![nodejs](http://nodejs.org/images/logos/nodejs.png)
![Angularjs](https://raw.githubusercontent.com/angular/angular.js/master/images/logo/AngularJS.exports/AngularJS-small.png)

## Dependancies
- [NodeJs](http://nodejs.org/)
- [MongoDb](http://www.mongodb.org/) 
- [Express](http://expressjs.com/)
- [Mongoose](http://mongoosejs.com/)
- [socket.io](http://socket.io/)
- [Etherpad](http://etherpad.org/)
- [nginx](http://nginx.org/)

## Running backend

Make sure MongoDB is up and running. Then install dependencies:

- `cd server`
- `npm install`

You can now configure your backend with the database URL and OAuth codes. In the `server/config/env` directory, copy over a config file like `development.sample.js` to `development.js`, and change the values in it.  

Finally, run the backend (by default, on port 5011):

- `node server.js`

To change the config file used by the server at startup, set the NODE_ENV variable. For example, on a *nix machine,  `NODE_ENV=production node server.js` will load the `server/config/env/production.js` config file

### Installing Etherpad

Follow the [instructions to install Etherpad](https://github.com/ether/etherpad-lite#installation) according to your platform. 

After you run Etherpad for the first time, it will create a file called `APIKEY.txt` in it's home directly. You will need to copy the contents of this file (a long string) into the IdeaWeave config file (`development.js` and/or `production.js`). The section of the config file will look something like the following.

```
etherpad: {
    host: "localhost",
    rootPath: "/etherpad/api/1.2.9/",
    port: 9090,
    apiKey: "xxx"
}
```

You might also need to change other properties such as the port and root path of the EtherPad API, depending on how you are deploying Etherpad.

### Setting up email

IdeaWeave uses [NodeMailer](http://www.nodemailer.com/) to send password reset and notification email. In order to get email to work, you need to tell IdeaWeave about it in your config file (`development.js` and/or `production.js`). Under the `email` attribute, include a `from` email address and a `transport` object that follows the format in the [Nodemailer documentation](http://www.nodemailer.com/). For example, the following configuration would send email from a fictional Gmail account:

````
email: {
    from: "IdeaWeave Robot <gmail.user@gmail.com>",
    transport: {
        service: 'Gmail',
        auth: {
            user: 'gmail.user@gmail.com',
            pass: 'userpass'
        }
    }
}
```

## Running frontend
![gulp](http://ih3.redbubble.net/image.15786709.1011/sticker,375x360.png)

Install dependencies:

- `cd client`
- `npm install`
- `bower install` (Choose the latest version of AngularJS)

Currently, you need a manual fix for one of the dependencies. Change line 1013 of `vendors/angular-material/angular-material.js` to be 

```
    inputDirective.link.pre(scope, {
```

Now you need to configure your frontend to tell it where to find the server. In the `client/app/env` directory, copy over a config file like `dev.js.sample` to `config.js`. Notice that the `apiServer` attribute is set to access your backend on port 5011.

To build the frontend and run a test server:

- `gulp dev`

Now visit [http://localhost:5000](http://localhost:5000) to see your IdeaWeave site!

You can also use another webserver like nginx or Apache for the frontend.

To build the frontend without launching a test server: 

- `gulp build`

### Configuring nginx

We use nginx to manage the 3 types of data sent by IdeaWeave: static files (served by nginx itself), the API (redirected by nginx and served by node.js), and Etherpad (redirected by nginx and served by the Etherpad node.js server).

To set this up, copy the `nginx.sample.conf` file and rename it (for example to `nginx.conf`). In the new file, replace `[ROOT_DIRECTORY]` by the path of your IdeaWeave installation. This is where nginx will look for your files.

Next, tell nginx to load this config file when it starts. One way to do this is to change your base nginx config file. On most Linux distributions this is found in `/etc/nginx/nginx.conf`, and in under OSX `/usr/local/etc/nginx/nginx.conf`. Add the following line near the end of the file, but before the closing braket, to have nginx load your IdeaWeave configuration:

```
include /Users/himmelattack/projects/cri/RedWire/server/redwire.nginx.conf;
```

Now restart nginx. Make sure to check your nginx log files to diagnose errors.

## Deploy

Go back to the root of the project. Install dependencies:

- `npm install`

IdeaWeave uses grunt to do the deployment. Copy over the file `deployConfigExample.json` to `deployConfig.json`, and set your values appropriately. 

To run the deployment: 

- `grunt deploy`
