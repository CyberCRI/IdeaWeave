angular.module('cri.message')
.factory('Message',function($http,$q,Config){
        var service = {
            send : function(message){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/messages',message).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            fetch : function(param){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/messages',{
                    params : param
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            refreshUsersList : function(param){
                var defered = $q.defer(),
                    queryUser = {username:{$regex:param+".*",$options: 'i'},context:'list'};
                $http.get(Config.apiServer+'/users?'+JSON.stringify(queryUser)).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    })
