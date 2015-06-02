angular.module('cri.idea')
.factory('Idea', function ($http,$q,Config) {
    var URI = '/ideas';
    var service  = {
        getByTag : function(tag,param){
            var defered = $q.defer();
            $http.get(Config.apiServer+URI+'/tag/'+tag,{
                params : param
            }).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        fetch : function(param,id){
            var defered = $q.defer();
            var url = Config.apiServer+URI;
            if(id) {
                url += '/'+id;
            }
            $http.get(url,{
                params : param
            }).success(function(data){
                service.data = data[0];
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        create : function(newIdea){
            var defered = $q.defer();
            $http.post(Config.apiServer+URI,newIdea).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        update : function(id,idea){
            var defered = $q.defer();
            $http.put(Config.apiServer+URI+'/'+id,idea).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        remove : function(id){
            var defered = $q.defer();
            $http.delete(Config.apiServer+URI+'/'+id).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        /*follow : function(follower,following){
            var defered = $q.defer();
            $http.post(Config.apiServer + '/ideas/follow',{
                follower : follower,
                following : following
            }).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        unfollow : function(follower,following){
            var defered = $q.defer();
            $http.post(Config.apiServer + '/ideas/unfollow',{
                follower : follower,
                following : following
        }).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        getFollowing : function(userId){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/datas/fIdeas/'+userId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }
        */

    };
    return service;
});