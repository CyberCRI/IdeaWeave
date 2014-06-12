angular.module('cri.tag')
.factory('Tag',function($q,$http,CONFIG){
        var service = {
            fetch : function(){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/tags')
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            fetchold : function(tag){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/datas/searchTag/'+tag)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            create : function(){
                var defered = $q.defer();
                $http.post()
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