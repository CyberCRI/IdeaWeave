# IdeaWeave 

IdeaWeave is a collaborative platform intended to help people sharing idea and organise themself in team. It has two separate components, a server and a client.

## Javascript fullstack
![nodejs](http://nodejs.org/images/logos/nodejs.png)
![Angularjs](https://raw.githubusercontent.com/angular/angular.js/master/images/logo/AngularJS.exports/AngularJS-small.png)

## Dependancies
- [NodeJs](http://nodejs.org/)
- [MongoDb](http://www.mongodb.org/) 

## Running backend

### Main dependancies
- [Express](http://expressjs.com/)
- [Mongoose](http://mongoosejs.com/)
- [socket.io](http://socket.io/)

Make sure MongoDB is up and running. Then install dependencies:

- `cd server`
- `npm install`

And then run the backend (by default, on port 5011):

- `node server.js`


## Running frontend
![gulp](http://ih3.redbubble.net/image.15786709.1011/sticker,375x360.png)

Install dependencies:

- `cd client`
- `npm install`
- `bower install` (Choose the latest version of AngularJS)

Now you need to configure your frontend to tell it where to find the server. In the `client/app/env` directory, copy over a config file like `dev.js.sample` to `config.js`. Notice that the `apiServer` attribute is set to access your backend on port 5011.

To build the frontend and run a test server:

- `gulp dev`

Now visit [http://localhost:5000](http://localhost:5000) to see your IdeaWeave site!

You can also use another webserver like nginx or Apache for the frontend.

To build the frontend without launching a test server: 

- `gulp build`

## Deploy

Go back to the root of the project. Install dependencies:

- `npm install`

IdeaWeave uses grunt to do the deployment. Copy over the file `deployConfigExample.json` to `deployConfig.json`, and set your values appropriately. 

To run the deployment: 

- `grunt deploy`
