angular.module('cri.workspace')
.factory('NoteLab',['$http','$q','Config','$upload','$stateParams','mySocket','$rootScope',function($http,$q,Config,$upload,$stateParams,mySocket,$rootScope){
    var service = {
        fetch : function(param){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/note',{
                params : param
            }).success(function(data){
                service.data = data[0];
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },

        exportHackPad : function(id){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/note/hackpad/'+id).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },

        listUrls : function(projectId){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/project/'+projectId+'/url').success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        addUrl : function(projectId, url){
            var defered = $q.defer();
            $http.post(Config.apiServer+'/project/'+projectId+'/url', url).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        removeUrl : function(projectId, urlId){
            var defered = $q.defer();
            $http.delete(Config.apiServer+'/project/'+projectId+'/url/'+urlId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },

        uploadFile : function(projectId, description, file){
            var defered = $q.defer();
            $upload.upload({
                url: Config.apiServer+'/project/'+projectId+'/file',
                method: 'POST',
                file: file,
                data: {
                    description : description,
                }
            }).progress(function(evt) {
                console.log(evt);
            }).success(function(data, status, headers, config) {
                defered.resolve(data);
            });
            return defered.promise;
        },
        listFiles : function(projectId){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/project/'+projectId+'/file').success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        removeFile : function(projectId, fileId){
            var defered = $q.defer();
            $http.delete(Config.apiServer+'/project/'+projectId+'/file/'+fileId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
    };
    return service;
}]);
