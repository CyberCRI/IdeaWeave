angular.module('cri.header')
.factory('SearchBar',['CONFIG','$http','$q',function(CONFIG,$http,$q){
        var service = {
            refresh : function(search){
                var defered = $q.defer();
                var query = {title:{$regex:search+".*",$options: 'i'},context:'list'};
                var queryUser = {username:{$regex:search+".*",$options: 'i'},context:'list'};
                $q.all([
                    $http.get(CONFIG.apiServer+'/users?'+JSON.stringify(queryUser)),
                    $http.get(CONFIG.apiServer+'/projects?'+JSON.stringify(query)),
                    $http.get(CONFIG.apiServer+'/challenges?'+JSON.stringify(query))
                ]).then(function(data){
                    var response = data[0].data.concat(data[1].data,data[2].data);
                    defered.resolve(response);
                }).catch(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }]);