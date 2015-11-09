angular.module('cri.idea')
.directive('ideaCard', function ($http,Config,Idea) {
    return {
        restrict:'EA',
        replace: true,
        scope: {
            ideaId: '=',
            myIdea: '=',
            height: '=',
            width: '='
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
        templateUrl: 'modules/idea/directives/ideaCard/idea-card.tpl.html',
        link: function(scope,element,attrs){
            element.bind('mouseenter',function(e){
                scope.isHovered = true;
            });
            element.bind('mouseleave',function(e){
                scope.isHovered = false;
            });
        }
    };
});
