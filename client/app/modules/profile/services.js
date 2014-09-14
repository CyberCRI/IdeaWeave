angular.module('cri.profile')

    .service('Profile', ['$http', '$q','$upload','Config', function ($http, $q, $upload,Config) {
        var service = {

            getMe: function () {
                var deferred = $q.defer();
                $http.get(Config.apiServer + '/me')
                    .success(function (me) {
                        if (me) {
                            deferred.resolve(me);
                        } else {
                            deferred.reject('no active user session');
                        }
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            },
            validateEmail: function (userId) {
                var defered = $q.defer();
                $http.put(Config.apiServer+'/users/' + userId).then(function(){
                    defered.resolve();
                }).catch(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            fetch :function(param,userId){
                var defered = $q.defer();
                var url = Config.apiServer + '/users';
                if(userId){
                    url += '/'+userId
                }
                $http.get(url,{
                    params : param
                })
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            getProfile : function(id){
                var defered = $q.defer();
                var url = Config.apiServer + '/profile/'+id;
                $http.get(url).success(function(data){
                        defered.resolve(data);
                    }).error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            getPoster : function(id){
                var defered = $q.defer();
                var url = Config.apiServer + '/profile/poster/'+id;
                $http.get(url).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            update : function(id,profile){
                var defered = $q.defer();
                $http.put(Config.apiServer+'/profile/'+id,profile)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            follow : function(follower,following){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/profile/follow',{
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
                $http.post(Config.apiServer+'/profile/unfollow/',{
                    follower : follower,
                    following : following
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            getActivity : function(uid,limit){
                var defered = $q.defer();
                var url = Config.apiServer+'/profile/activity/'+uid;
                $http.get(url,{
                    params : {
                        limit : limit
                    }
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            getResetPassToken : function(email){
                var defered = $q.defer();
                $http.post(Config.apiServer + '/datas/resetPass/' + email)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            resetPassword : function(resetF){
                var defered = $q.defer();
                $http.post(Config.apiServer + '/datas/reset/', resetF)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            remove : function(id){
                var defered = $q.defer();
                $http.delete(Config.apiServer+'/users/'+id).success(function(){
                    defered.resolve()
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }]);