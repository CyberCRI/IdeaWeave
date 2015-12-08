angular.module('cri.search', [])
.factory('SearchBar',function(Config,$http,$q){
    var service = {
        lookFor : function(search, include){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/search/all', { params: { search: search, include: include } })
            .success(function(searchResult){
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
}).directive('searchBar',function(){
    return {
        restrict : 'EA',
        templateUrl : 'modules/common/search/searchBar.tpl.html',
        scope: {
            onSelection: "=",
            include: "=?",
            filter: "=?"
        },
        controller: function($scope, SearchBar) {
            $scope.lookUp = function(search) { 
                if(search.length == 0) return [];

                return SearchBar.lookFor(search, $scope.include)
                .then(function(results) {
                    if(!$scope.filter) return results;

                    return _.filter(results, $scope.filter);
                })
                .catch(function(err) {
                    Notification.display(err.message);
                });
            }
        }
    };
});
