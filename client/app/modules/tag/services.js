angular.module('cri.tag')
.factory('Tag',['$q','$http','Config',function($q,$http,Config){
        var service = {
            fetch : function(param){
                var defered = $q.defer();
                var url = Config.apiServer+'/tags';
                if(param){
                    url += '?'+JSON.stringify(param);
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
            search : function(tagTitle){
                // Make 3 simultaneous requests
                var challengeRequest = $http.get(Config.apiServer + '/challenges/tag/' + tagTitle);
                var projectRequest = $http.get(Config.apiServer + '/projects/tag/' + tagTitle);
                var userRequest = $http.get(Config.apiServer + '/profile/tag/' + tagTitle);
                var ideaRequest = $http.get(Config.apiServer + '/ideas/tag/' + tagTitle);

                // Return this promise
                var defered = $q.defer();
                $q.all([challengeRequest, projectRequest, userRequest, ideaRequest]).then(function(responses) {
                    defered.resolve({
                        challenges: responses[0].data,
                        projects: responses[1].data,
                        users: responses[2].data,
                        ideas: responses[3].data
                    });
                }).catch(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            create : function(tag){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/tags', { title: tag })
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    });
                return defered.promise;
            },
            d3FormatData : function(data,tagTitle){

                function parseTag(tags,origin){
                    var exist = true;
                    angular.forEach(tags,function(v,k){
                        if(v != tagTitle){
                            angular.forEach(d3TagData.nodes,function(node,k){
                                if(node.name != v){
                                    exist = false;
                                    node = {
                                        name : v,
                                        group : 1
                                    };
                                    d3TagData.nodes.push(node);
                                    var link = {
                                        source : origin,
                                        target : d3TagData.nodes.indexOf(node)
                                    };
                                    d3TagData.links.push(link);
                                }
                            });
                        }
                    });
                }
                var d3TagData = {
                    nodes : [
                        {
                            name : tagTitle,
                            group : 1
                        }
                    ],
                    links : [

                    ]
                };
                angular.forEach(data.users,function(v,k){
                    var node = {
                        name : v.username,
                        group : 2,
                        poster : v.poster,
                        brief : v.brief,
                        id : v.id
                    };
                    d3TagData.nodes.push(node);

                    var link = {
                        source : d3TagData.nodes.indexOf(node),
                        target : 0
                    };
                    d3TagData.links.push(link);
//                    parseTag(v.tags,d3TagData.nodes.indexOf(node))
                });
                angular.forEach(data.challenges,function(v,k){
                    var node = {
                        name : v.title,
                        group : 3,
                        poster : v.poster,
                        brief : v.brief,
                        url : v.accessUrl
                    };
                    d3TagData.nodes.push(node);

                    var link = {
                        source : d3TagData.nodes.indexOf(node),
                        target : 0
                    };
                    d3TagData.links.push(link);
                });
                angular.forEach(data.projects,function(v,k){
                    var node = {
                        name : v.title,
                        group : 4,
                        poster : v.poster,
                        brief : v.brief,
                        url : v.accessUrl

                    };
                    d3TagData.nodes.push(node);

                    var link = {
                        source : d3TagData.nodes.indexOf(node),
                        target : 0
                    };
                    d3TagData.links.push(link);
                });
                return d3TagData;
            },
            remove : function(id){
                var defered = $q.defer();
                $http.delete(Config.apiServer+'/tags/'+id)
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