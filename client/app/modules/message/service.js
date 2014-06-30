angular.module('cri.message')
.factory('Message',['$http','$q','CONFIG',function($http,$q,CONFIG){
        var service = {
            send : function(message){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer+'/messages',message).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            fetch : function(param){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/messages',{
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
                $http.get(CONFIG.apiServer+'/users?'+JSON.stringify(queryUser)).success(function(data){
                    console.log('service message refresh to' , data)
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }])
