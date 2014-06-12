var deployd = require('deployd');
var serverConfig = require('./serverConfig');
var deployConfig = require('../deployConfig');

var apiServer = deployd({
    port: serverConfig.apiPort,
    env: deployConfig.env,
    db: {
        host: "localhost",
        port: 27017,
        name: 'ideas'
    }
});

apiServer.listen();
apiServer.on('listening', function () {
    console.log("API server is listening on " + deployConfig.host + ":" + serverConfig.apiPort);
});

apiServer.on('error', function (err) {
    console.error(err);
    process.nextTick(function () { // Give the server a chance to return an error
        process.exit();
    });
});