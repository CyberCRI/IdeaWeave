angular.module('cri.badge', [])
.service('Badge', function($http, $q, Config) {
    function makeQPromiseForRequest(request) {
        var deferred = $q.defer();
        request.success(function(data){
            deferred.resolve(data);
        }).error(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var service = {
        listBadges: function() {
            return makeQPromiseForRequest($http.get(Config.apiServer + "/badges"));
        },
        getBadge: function(badgeId) {
            return makeQPromiseForRequest($http.get(Config.apiServer + "/badges/" + badgeId));
        },
        // filter is an object with parameters: badge, givenByEntity, or givenToEntity
        listCredits: function(filter) {
            return makeQPromiseForRequest($http.get(Config.apiServer + "/credit"), { params: filter });
        },
        getCredit: function(creditId) {
            return makeQPromiseForRequest($http.get(Config.apiServer + "/credit/" + creditId));
        },
        giveCredit: function(credit) {
            return makeQPromiseForRequest($http.post(Config.apiServer + "/credit", credit));
        }
    };
    return service;
});