var oauth = require('oauth-client'),
    q = require('q');


exports.getIframe = function(key,secret,id,email,name){
    var defer = q.defer();
        consumer = oauth.createConsumer(key, secret),
        signer = oauth.createHmac(consumer);
//    https://hackpad.com/ep/api/embed-pad?padId="+scope.padId
    var request = {
        port: 443,
        host: 'ideaweave.hackpad.com',
        https: true,
        path: '/ep/api/embed-pad?padId='+id+'&email='+email+'&name='+name,
        oauth_signature: signer,
        method: 'GET'
    };
    var req = oauth.request(request, function(responseObj) {
        console.log(req);
        var response = '';
        responseObj.on('data', function(chunk) { response += chunk; });
        responseObj.on('end', function () {
//            if(responseObj.headers['content-type'].indexOf('application/json') !== -1) {
//                console.log(response)
//                var data = JSON.parse(response);
//                if(data.error) {
//                    defer.reject(data.error);
////                    callback(data.error);
//                } else {
//                    defer.resolve(data);
//                }
//            } else {
                defer.resolve(response);
//            }
        });
    });

    req.end();
    return defer.promise;
};

exports.auth = function(key,secret){
    var consumer = oauth.createConsumer(key, secret),
        signer = oauth.createHmac(consumer);

    return signer;
};