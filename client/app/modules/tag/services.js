angular.module('cri.tag')
.factory('Tag',['$q','$http','CONFIG',function($q,$http,CONFIG){
        var service = {
            fetch : function(param){
                var defered = $q.defer();
                var url = CONFIG.apiServer+'/tags'
                if(param){
                    url += '?'+JSON.stringify(param)
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
            search : function(tagTitle){
                var defered = $q.defer();
                var url = CONFIG.apiServer+'/datas/searchTag/'+tagTitle
                $http.get(url).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                })
                return defered.promise;
            },
            fetchold : function(tag){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/datas/searchTag/'+tag)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            create : function(tag){
                var defered = $q.defer();
                $http.post(CONFIG.apiServer+'/tags',tag)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
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
                                    var node = {
                                        name : v,
                                        group : 1
                                    }
                                    d3TagData.nodes.push(node);
                                    var link = {
                                        source : origin,
                                        target : d3TagData.nodes.indexOf(node)
                                    }
                                    d3TagData.links.push(link);
                                }
                            })
                        }
                    })
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
                }
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
                    parseTag(v.tags,d3TagData.nodes.indexOf(node))
                })
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
                })
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
                })
                return d3TagData;
            }
        }
        return service;
    }])