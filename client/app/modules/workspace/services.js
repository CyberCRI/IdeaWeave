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

        uploadFile : function(note,file,description,ownerId){
            var defered = $q.defer();
            $upload.upload({
                url: Config.apiServer+'/upload',
                method: 'POST',
                file: file,
                data: {
                    project:note.project,
                    topic: note._id,
                    projectUrl : $stateParams.pid,
                    description : description,
                    owner : ownerId,
                    container : $stateParams.tid
                }
            }).progress(function(evt) {
//                    $rootScope.$broadcast('upload::progress',evt)
                console.log(evt);
            }).success(function(data, status, headers, config) {
                defered.resolve(data);
            });
            return defered.promise;
        },
        fetchFile : function(id){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/upload',{
                params : {
                    container : id
                }
            }).success(function(data){
               defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }
    };
    return service;
}]);
