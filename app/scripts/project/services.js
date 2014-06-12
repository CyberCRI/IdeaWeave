angular.module('cri.project')
    .service('Project',['$http','$q','$upload','CONFIG', function($http,$q,$upload,CONFIG){

    var service = {
        current : {},
        getAssociatedFiles : function(id,poster){
            var defered = $q.defer();
            if(poster && id){
                var url = CONFIG.apiServer+'/upload?project='+id+'&poster='+true
            }else if(id){
                var url = CONFIG.apiServer+'/upload?project='+id;
            }else{
                var url = CONFIG.apiServer+'/upload?posters='+true
            }
            $http.get(url)
                .success(function(data){
                    console.log(data)
                    defered.resolve(data);
                })
                .error(function(err){
                    defered.reject(err);
                })
            return defered.promise;
        },
        update : function(param,id){
            var defered = $q.defer(),
                url = CONFIG.apiServer + '/projects';
            console.log(param);
            if(id){
                url += '/'+id;
            }
            $http.put(url,JSON.stringify(param)).success(function(){
                defered.resolve();
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        fetch :function(param){
            var defered = $q.defer();
            var url = CONFIG.apiServer+'/projects';
            if(param){
                url += '?'+ JSON.stringify(param);
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
        create : function(project){
            console.log(project)
            var defered = $q.defer();
            $http.post(CONFIG.apiServer + '/projects', project)
                .success(function (data) {
                    service.data = data;
                    defered.resolve(data)
                })
                .error(function (err) {
                    console.log(err)
                    defered.reject(err)
                });
            return defered.promise;
        },
        follow : function(projectId){
            var defered = $q.defer();
            $http.post(CONFIG.apiServer + '/datas/follow/project/' + projectId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        unfollow : function(projectId){
            var defered = $q.defer();
            $http.post(CONFIG.apiServer + '/datas/unfollow/project/' + projectId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        apply : function(param){
            var defered = $q.defer();
            $http.post(CONFIG.apiServer+'/applyteams',param).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        getApply : function(param){
            var defered = $q.defer();
            console.log('service : ', param)
            var url = CONFIG.apiServer+'/applyteams?'+ JSON.stringify(param);
            $http.get(url)
                .success(function(data){
                    console.log('result',data)
                    defered.resolve(data);
                })
                .error(function(err){
                    console.log('error',err.message);
                    defered.reject(err);
                })
            return defered.promise;
        },
        finishApply : function(param, id){
            var defered = $q.defer();
            $http.put(CONFIG.apiServer+'/applyteams/'+id,param).success(function(data){
                defered.resolve(data);
            }).catch(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        uploadPoster : function(file){
            var defered = $q.defer();
            $upload.upload({
                url: CONFIG.apiServer+'/upload?subdir=project&project='+service.data.id,
                method: 'POST',
                file: file
            }).success(function(data, status, headers, config) {
                service.data.poster = CONFIG.apiServer+'/fileUpload/project/'+data[0].filename
                $http.put(CONFIG.apiServer+'/projects',service.data)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
            })
            return defered.promise;
        },
        getFollowing : function(userId){
            var defered = $q.defer();
            $http.get(CONFIG.apiServer+'/datas/fProjects/'+userId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        getContributed : function(userId){
            var defered = $q.defer();
            $http.get(CONFIG.apiServer+'/datas/conProjects/'+userId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        delete : function(id){
            var defered = $q.defer();
            $http.delete(CONFIG.apiServer+'/projects/'+id).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        sendInvite : function(invite){
            var defered = $q.defer();
            $http.post(CONFIG.apiServer+'/invites',invite).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        join : function(projectId){
            var defered = $q.defer();
            $http.post(CONFIG.apiServer+'/datas/joinTeam/'+projectId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            })
            return defered.promise;
        },
        parseUrl : function(string){
            var re_weburl = new RegExp(
                "^" +
                "(?:(?:https?|ftp)://)" +
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
                "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
                "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                ")" +
                "(?::\\d{2,5})?" +
                "(?:/[^\\s]*)?" +
                "$", "i"
            );
            console.log(string.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
        }
    }

    return service;
}])