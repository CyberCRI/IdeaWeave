angular.module('cri.challenge')
    .directive('challengeBlock',[function(){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                myChallenge : '='
            },
            templateUrl:'modules/challenge/directives/challengeBlock/challenge-block.tpl.html',
            controller : ['$scope','Challenge',function($scope,Challenge){

                if($scope.challengeId){
                    Challenge.fetch( { id : $scope.projectId, type : 'block' }).then(function(challenge){
                        $scope.challenge = challenge[0];
                    }).catch(function(err){
                        console.log('error',err);
                    })
                }else{
                    $scope.challenge = $scope.myChallenge;
                }
            }],
            link : function(scope,element,attrs){

                scope.block = {
                    isHovered : false
                };
                scope.hoverEnter = function($event){
                    scope.block.isHovered = true;
                    scope.blockHeight =  element.find('div').height()+'px';
                };
                scope.hoverLeave= function($event){
                    scope.block.isHovered = false;
                };
                element.bind('touch',function(e){
                    scope.block.isHovered = !scope.block.isHovered;
                });


            }
        }
    }])
    .directive('challengeInfo',[function(){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                myChallenge : '='
            },
            templateUrl:'modules/challenge/directives/challengeBlock/challenge-info.tpl.html',
            controller : ['$scope','Challenge',function($scope,Challenge){
                if($scope.challengeId){
                    Challenge.fetch( { _id : $scope.projectId, type : 'info' }).then(function(challenge){
                        $scope.challenge = challenge[0];
                    }).catch(function(err){
                        console.log('error',err);
                    })
                }else{
                    $scope.challenge = $scope.myChallenge;
                }
            }],
            link : function(scope,element,attrs){

            }
        }
    }])
    .directive('challengeCard',[function(){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                myChallenge : '=',
                admin : '='

            },
            templateUrl:'modules/challenge/directives/challengeBlock/challenge-card.tpl.html',
            controller : ['$scope','Challenge',function($scope,Challenge){
                if($scope.challengeId){
                    Challenge.fetch( { _id : $scope.challengeId, type : 'card' }).then(function(challenge){
                        $scope.challenge = challenge[0];
                    }).catch(function(err){
                        console.log('error',err);
                    })
                }else{
                    $scope.challenge = $scope.myChallenge;
                }
            }],
            link : function(scope,element,attrs){
                element.bind('mouseenter',function(e){
                    scope.isHovered = true;
                });
                element.bind('mouseleave',function(e){
                    scope.isHovered = false;
                })
            }
        }
    }]);