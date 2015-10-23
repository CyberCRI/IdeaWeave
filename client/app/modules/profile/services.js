angular.module('cri.profile')

    .service('Profile', ['$http', '$q','Upload','Config', function ($http, $q, Upload,Config) {
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
                });
                return defered.promise;
            },
            fetch :function(param,userId){
                var defered = $q.defer();
                var url = Config.apiServer + '/users';
                if(userId){
                    url += '/'+userId;
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
                    service.data = data.data;
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
            sendResetPasswordEmail : function(email){
                var defered = $q.defer();
                $http.post(Config.apiServer + '/auth/forgotPassword', { email: email })
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            resetPassword : function(email, token, newPassword){
                var defered = $q.defer();
                $http.post(Config.apiServer + '/auth/resetPassword', { email: email, token: token, newPassword: newPassword })
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
                    defered.resolve();
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            getFeed: function() {
                var defered = $q.defer();
                $http.get(Config.apiServer+'/notifications/me').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            listFollowingTags: function() {
                var defered = $q.defer();
                $http.get(Config.apiServer+'/tags/following').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            followTag: function(tagId) {
                var defered = $q.defer();
                $http.post(Config.apiServer+'/tags/' + tagId + '/follow').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            unfollowTag: function(tagId) {
                var defered = $q.defer();
                $http.post(Config.apiServer+'/tags/' + tagId + '/unfollow').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },

            // Utility function to follow and unfollow so that only new tags are followed 
            updateTagFollowing: function(newTagIds) {
                return service.listFollowingTags().then(function(currentlyFollowingTags) {
                    var oldTagIds = _.pluck(currentlyFollowingTags, "_id");

                    var tagsToFollow = _.difference(newTagIds, oldTagIds);
                    var tagsToUnfollow = _.difference(oldTagIds, newTagIds);

                    var followTagRequests = _.map(tagsToFollow, service.followTag);
                    var unfollowTagRequests = _.map(tagsToUnfollow, service.unfollowTag);

                    return $q.all(_.flatten([followTagRequests, unfollowTagRequests], true));
                });
            }
        };
        return service;
    }]);