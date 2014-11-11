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

Make sure MongoDB is up and running. Then:

- `cd server`
- `npm install`
- `node server.js`

## Running frontend
![gulp](http://ih3.redbubble.net/image.15786709.1011/sticker,375x360.png)

- `cd client`
- `npm install`
- `bower install` (Choose the latest version of AngularJS)
- `gulp dev`

Now visit [http://localhost:5000](http://localhost:5000) to see your IdeaWeave site!

### Build front-end

- `gulp build`

## Deploy
Go back to the root of the project
- `npm install`
- `grunt deploy`
