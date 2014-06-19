angular.module('cri.common')
    .directive('challengeBlock',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            template:'<div><h3><a ui-sref="challenge({ pid : challenge[cid].accessUrl})" >{{challenge[cid].title}}</a></h3><blockquote ng-bind-html="challenge[cid].brief"></blockquote></div>',
            link : function(scope,element,attrs){
                scope.cid=scope.$eval(attrs.challengeBlock);
                if(!scope.challenge){
                    scope.challenge={};
                }
                if(!scope.challenge[scope.cid]){
                    $http.get(CONFIG.apiServer+"/challenges/"+scope.cid+"?context=list").success(function(data){
                        scope.challenge[scope.cid]=data;
                    }).error(function(err){
                        console.log('error',err);
                    })
//                    jzCommon.getOj('challengeBlock-'+scope.cid,CONFIG.apiServer+"/challenges/"+scope.cid+"?context=list").then(function(data){
//                        scope.challenge[scope.cid]=data;
//                    })
                }
            }
        }
    }])
    .directive('challengeInfo',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            template:'<a ui-sref="challenge({ pid : challenge[cid].accessUrl })"  target="_blank">{{challenge[cid].title}}</a>',
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