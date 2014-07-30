angular.module('cri.user')

    .service('loggedUser', function () {
        return {

            profile: null

        };
    })

    .service('users', ['$http', '$q', 'loggedUser','$upload','CONFIG', function ($http, $q, loggedUser, $upload,CONFIG) {
        var service = {
            login: function (username, password) {
                var deferred = $q.defer();
                $http.post(CONFIG.apiServer + '/datas/login', {username: username}).success(function (me) {
                    $http.post(CONFIG.apiServer + '/datas/login', {username: username, password: password}).success(function () {
                        console.log('login',me)
                        loggedUser.profile = me;
                        deferred.resolve(me);
                    }).catch(function(err){
                        deferred.reject(err);
                    });
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            isLoggedIn: function () {
                return loggedUser.profile !== undefined && loggedUser.profile !== null;
            },

            logout: function () {
                var deferred = $q.defer();
                $http.get(CONFIG.apiServer + '/users/logout').success(function () {
                    delete loggedUser.profile;
                    deferred.resolve();
                }).catch(function(err){
                    console.log('err',err);
                });
                return deferred.promise;
            },

            getMe: function () {
                var deferred = $q.defer();
                $http.get(CONFIG.apiServer + '/users/me')
                    .success(function (me) {
                        console.log('me  ',me)
                        if (me) {
                            loggedUser.profile = me;
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

            register: function (user) {
                var deferred = $q.defer();
                $http.post(CONFIG.apiServer + '/users', user)
                    .success(function (me) {
                        deferred.resolve(me);
                    })
                    .error(function (err) {
                        if (err.errors.username) {
                            alert('Username already exsit');
                        } else if (err.errors.email) {
                            alert('Email already register');
                        } else {
                            alert(err.message);
                        }
                        deferred.reject(err);
                    });
                return deferred.promise;
            },
            validateEmail: function (userId) {
                var defered = $q.defer();
                $http.put(CONFIG.apiServer+'/users/' + userId).then(function(){
                    defered.resolve();
                }).catch(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            fetch :function(param,userId){
                var defered = $q.defer();
                var url = CONFIG.apiServer + '/users';
                if(userId){
                    url += '/'+userId
                }
//                if(param){
//                    url += '?'+ JSON.stringify(param);
//                }
                $http.get(url,{
                    params : param
                })
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            getProfile : function(id){
                var defered = $q.defer();
                var url = CONFIG.apiServer + '/datas/profile/'+id;
                $http.get(url).success(function(data){
                        defered.resolve(data);
                    }).error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            update : function(id,user){
                var defered = $q.defer();
                $http.put(CONFIG.apiServer+'/users/'+id,user)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            getFollower : function(param){
                var defered = $q.defer();
                var url = CONFIG.apiServer + '/followers';
                if (param){
                    url = url + '?' + JSON.stringify(param);
                }
                $http.get(url)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },getFollowing : function(param){
                var defered = $q.defer();
                var url = CONFIG.apiServer + '/following';
                if (param){
                    url = url + '?' + JSON.stringify(param);
                }
                $http.get(url)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            follow : function(uid){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer+'/datas/follow/users/'+uid)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            unfollow : function(uid){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer+'/datas/unfollow/users/'+uid)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            getActivity : function(uid,limit){
                var defered = $q.defer();
                var url = CONFIG.apiServer+'/datas/activity/'+uid+'/'+limit;
                $http.get(url)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            getResetPassToken : function(email){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer + '/datas/resetPass/' + email)
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
                $http.post(CONFIG.apiServer + '/datas/reset/', resetF)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            }
        };
        return service;
    }]);