angular.module('cri.common')
.factory('Url',['CONFIG','$http','$q',function(CONFIG,$http,$q){
        var service = {
            fetch : function(param){
                var defered = $q.defer();
                if(!param){
                    var param = {}
                }
                $http.get(CONFIG.apiServer+'/urls',{
                    params : param
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            update : function(param){
                var defered=  $q.defer();
                $http.put(CONFIG.apiServer+'/urls',param).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            }
        }
        return service;
    }])