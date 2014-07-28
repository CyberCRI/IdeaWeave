angular.module('cri.challenge')
.factory('Challenge',['$http','$q','$upload','CONFIG',function($http,$q,$upload,CONFIG){
        var URI = '/challenges';
        var service  = {

            getFollowers : function(followers){
                var defered = $q.defer();
                var param = angular.toJson(followers);
                $http.get(CONFIG.apiServer+'/followers?users='+param).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            fetch : function(param,id,search){
                var defered = $q.defer();
                var url = CONFIG.apiServer+URI;
                if(id){
                    url += '/'+id;
                }
                if(search){
                    url += '?'+JSON.stringify(search)
                }
                $http.get(url,{
                    params : param
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            create : function(newChallenge){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer+URI,newChallenge).success(function(data){
                    service.data = data;
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            update : function(id,challenge){
                var defered = $q.defer();
                $http.put(CONFIG.apiServer+URI+'/'+id,challenge).success(function(data){
                    service.data = data;
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            uploadPoster : function(file){
                var defered = $q.defer();
                $upload.upload({
                    url: CONFIG.apiServer+'/upload?subdir=challenge&challenge='+service.data.id,
                    method: 'POST',
                    file: file
                }).success(function(data, status, headers, config) {
                    service.data.poster = CONFIG.apiServer+'/fileUpload/challenge/'+data[0].filename
                    $http.put(CONFIG.apiServer+'/challenges',service.data)
                        .success(function(data){
                            defered.resolve(data);
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                })
                return defered.promise;
            },
            follow : function(challengeId){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer + '/datas/follow/challenges/' + challengeId).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            unfollow : function(challengeId){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer + '/datas/unfollow/challenges/' + challengeId).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            getFollowing : function(userId){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/datas/fChallenges/'+userId).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            getContributed : function(userId){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/datas/conChallenges/'+userId).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            }
        }
        return service;
    }])