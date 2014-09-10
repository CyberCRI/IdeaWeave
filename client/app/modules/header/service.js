angular.module('cri.header')
.factory('SearchBar',['Config','$http','$q',function(Config,$http,$q){
        var service = {
            refresh : function(search){
                var defered = $q.defer();
                var query = {title:{$regex:search+".*",$options: 'i'},context:'list'};
                var queryUser = {username:{$regex:search+".*",$options: 'i'},context:'list'};
                $http.get(Config.apiServer+'/search/all',{
                    params : {
                        search : search
                    }
                }).success(function(searchResult){
                    defered.resolve(searchResult);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }]);