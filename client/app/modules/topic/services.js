angular.module('cri.topic')
.factory('Topic',['$http','$q','CONFIG','$upload','$stateParams','loggedUser','Files',function($http,$q,CONFIG,$upload,$stateParams,loggedUser,Files){

        var service = {
            fetchUrl : function(topicId){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/urls?'+JSON.stringify({ container : topicId })).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            addUrl : function(url){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer+'/urls', url).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            getUrl : function(text){
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.match(urlRegex);
//                return text.replace(urlRegex, function(url) {
//                    return '<a href="' + url + '">' + url + '</a>';
//                })
            },
            urlify : function(text){
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, function(url) {
                    return '<a href="' + url + '">' + url + '</a>';
                })
            },
            createPost : function(post,type){
                var deferred = $q.defer(),
                    url;
                switch(type){
                    case 'project':
                        url =  CONFIG.apiServer+'/pforums';
                    break;
                    case 'challenge':
                        url = CONFIG.apiServer+'/cforums';
                    break;
                }
                $http.post(url, post).success(function (data) {
                    deferred.resolve(data);
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            uploadFile : function(topic,file,description){
                var defered = $q.defer();
                console.log(description)
                $upload.upload({
                    url: CONFIG.apiServer+'/upload?uniqueFilename=true&subdir=topic/'+$stateParams.pid+'&topic='+topic.id+'&projectUrl='+$stateParams.pid+'&description='+description+"&ownerName="+loggedUser.profile.username+"&ownerid="+loggedUser.profile.id,
                    method: 'POST',
                    file: file
                }).success(function(data, status, headers, config) {
                    if(!topic.files){
                        topic.files = new Array;
                    }
                    var myFile = data[0];
                    Files.getPoster(file);
                    myFile.url = CONFIG.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+myFile.filename;
                    topic.files.push(myFile);
                    $http.put(CONFIG.apiServer+'/pforums',topic).success(function(){
                        defered.resolve(data);
                    }).error(function(err){
                        defered.reject(err);
                    })
                });
                return defered.promise;
            },
            fetchFile : function(id){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/upload',{
                    params : {
                        topic : id
                    }
                }).success(function(data){
                   defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        }
        return service;
    }])