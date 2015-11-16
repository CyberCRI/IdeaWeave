angular.module('cri.idea')
.directive('ideaInfo', function ($http,Config,Idea) {
    return {
        restrict:'EA',
        replace: true,
        scope: {
            ideaId: '=',
            myIdea: '='
        },
        controller: function ($scope, Idea) {
            if($scope.myIdea) {
                $scope.idea = $scope.myIdea;
            } else {
                Idea.fetch($scope.ideaId).then(function(idea){
                    $scope.idea = idea;
                }).catch(function(err){
                    console.log('error',err);
                });
            }
        },
        templateUrl: 'modules/idea/directives/ideaInfo/idea-info.tpl.html'
    };
});
