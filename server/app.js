var deployd = require('deployd');

var apiServer = deployd({
    port: process.env.PORT || 5011,
    env: 'prod',
    db: {
        host: "localhost",
        port: 27017,
        name: 'ideas'
    }
});

apiServer.listen();
apiServer.on('listening', function () {
    console.log("API server is listening");
});

apiServer.on('error', function (err) {
    process.nextTick(function () { // Give the server a chance to return an error
        process.exit();
    });
});