angular.module('cri.common')
.factory('Follower',function($q,$http,CONFIG){
        var service = {
            fetch : function(param){
                var defered = $q.defer();
                var url = CONFIG.apiServer + '/followers'
                if (param){
                    url = url + '?' + JSON.stringify(param);
                }
                $http.get(url)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            }
        }
        return service;
    })