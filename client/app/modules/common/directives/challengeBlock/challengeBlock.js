angular.module('cri.common')
    .directive('challengeList',['$http','CONFIG','Challenge',function($http,CONFIG,Challenge){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                showDetails : '@'
            },
            templateUrl:'modules/common/directives/challengeBlock/challenge-list.tpl.html',
            link : function(scope,element,attrs){

                console.log(scope.challengeId )
                Challenge.fetch(null, scope.challengeId).then(function(challenge){
                    console.log(challenge);
                    scope.challenge = challenge;
                }).catch(function(err){

                })
            }
        }
    }])
    .directive('challengeBlock',['$http','CONFIG','Challenge',function($http,CONFIG,Challenge){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                challenge : '='
            },
            templateUrl:'modules/common/directives/challengeBlock/challenge-block.tpl.html',
            link : function(scope,element,attrs){

                console.log(scope.challengeId )
                scope.block = {
                    isHovered : false
                };
                scope.hoverEnter = function($event){
                    console.log(element.find('div').height());
                    scope.block.isHovered = true;
                    scope.blockHeight =  element.find('div').height()+'px';
                };
                scope.hoverLeave= function($event){
                    scope.block.isHovered = false;
                };
//                element.bind('mouseenter',function(e){
//                    console.log(scope.block.isHovered)
//                    scope.block.isHovered=true;
//                });
//                element.bind('mouseleave',function(e){
//                    console.log( scope.block.isHovered)
//                    scope.block.isHovered = false;
//                });
                element.bind('touch',function(e){
                    scope.block.isHovered = !scope.block.isHovered;
                });

                if(scope.challengeId){
                    Challenge.fetch(null, scope.challengeId).then(function(challenge){
                        console.log(challenge);
                        scope.challenge = challenge;
                    }).catch(function(err){

                    })
                }
            }
        }
    }])
    .directive('challengeInfo',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            template:'<a ui-sref="challenge.details({ pid : challenge[cid].accessUrl })"  target="_blank">{{challenge[cid].title}}</a>',
            link : function(scope,element,attrs){
                scope.cid=scope.$eval(attrs.challengeInfo);
                if(!scope.challenge){
                    scope.challenge={};
                }
                if(!scope.challenge[scope.cid]){
                    $http.get(CONFIG.apiServer+"/challenges/"+scope.cid+"?context=list").success(function(data){
                        scope.challenge[scope.cid]=data;
                    }).error(function(err){
                        console.log('error',err)
                    })
                }
            }
        }
    }]);