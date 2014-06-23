angular.module('cri.common')
    .directive('challengeBlock',['$http','CONFIG','Project',function($http,CONFIG,Challenge){
        return {
            restrict:'EA',
            scope : {
                challengeId : '='
            },
            templateUrl:'modules/common/directives/challengeBlock/challenge-block.tpl.html',
            link : function(scope,element,attrs){
                console.log('challengeBlock',scope.challengeId);

                Challenge.fetch({ id : scope.challengeId }).then(function(challenge){
                    scope.challenge = challenge;
                    console.log('challengeBlock',scope.challenge);
                }).catch(function(err){
                    console.log('error',err);
                })
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