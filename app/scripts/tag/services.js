angular.module('cri.tag')
.factory('Tag',function($q,$http,CONFIG){
        var service = {
            fetch : function(param){
                var defered = $q.defer();
                var url = CONFIG.apiServer+'/tags'
                if(param){
                    url += '?'+JSON.stringify(param)
                }
                $http.get(url)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            search : function(tagTitle){
                var defered = $q.defer();
                var url = CONFIG.apiServer+'/datas/searchTag/'+tagTitle
                $http.get(url).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
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
            create : function(tag){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer+'/tags',tag)
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