angular.module('cri.header')
.factory('SearchBar',['Config','$http','$q',function(Config,$http,$q){
        var service = {
            lookFor : function(search){
                var defered = $q.defer();
                var query = {title:{$regex:search+".*",$options: 'i'},context:'list'};
                var queryUser = {username:{$regex:search+".*",$options: 'i'},context:'list'};
                $http.get(Config.apiServer+'/search/all',{
                    params : {
                        search : search
                    }
                }).success(function(searchResult){
                    // Unpack search result into a flat list with separators in between

                    // First, assign each result its type
                    _.each(searchResult.projects, function(element) { element.type = "project"; });
                    _.each(searchResult.challenges, function(element) { element.type = "challenge"; });
                    _.each(searchResult.ideas, function(element) { element.type = "idea"; });
                    _.each(searchResult.users, function(element) { element.type = "user"; });
                    _.each(searchResult.tags, function(element) { element.type = "tag"; });

                    // Vombine the elements into a list and return the result
                    var flatList = searchResult.projects.concat(searchResult.challenges,searchResult.ideas,searchResult.users,searchResult.tags);
                    defered.resolve(flatList);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }]).directive('searchBar',function(){
        return {
            restrict : 'EA',
            templateUrl : 'modules/header/templates/searchBar.tpl.html'
        };
    });