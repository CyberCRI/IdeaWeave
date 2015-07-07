angular.module('cri.idea')
.directive('ideaInfo', function ($http,Config,Idea) {
    return {
        restrict:'EA',
        replace: true,
        scope: {
            ideaId: '='
        },
        controller: function ($scope, Idea) {
            Idea.fetch($scope.ideaId).then(function(idea){
                $scope.idea = idea;
            }).catch(function(err){
                console.log('error',err);
            });
        },
        templateUrl: 'modules/idea/directives/ideaInfo/idea-info.tpl.html'
    };
});
