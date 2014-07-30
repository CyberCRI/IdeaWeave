angular.module('cri.common')
    .directive('ownerBlock',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            templateUrl:'modules/common/directives/ownerBlock/ownerBlock.tpl.html',
            link : function(scope,element,attrs){
                scope.uid=scope.$eval(attrs.ownerBlock);
                if(!scope.user){
                    scope.user={};
                }
                if(!scope.user[scope.uid]&&scope.uid!==undefined){
                    var url=CONFIG.apiServer+'/users/'+scope.uid+'?context=userBlock';
                    $http.get(url).success(function(data){
                        scope.user[scope.uid]=data;
                    }).error(function(err){
                        console.log('error',err);
                    })

                }
            }
        }
    }])
    .directive('userInfo',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            replace:true,
            scope : {
                userId : '@'
            },
            template:'<a ng-href="user/{{userId}}" class="inline">{{user.realname || user.username}}</a>',
            link : function(scope,element,attrs){

                var url=CONFIG.apiServer+'/users/'+scope.userId+'?context=userBlock';
                $http.get(url).success(function(data){
                    scope.user=data;
                }).error(function(err){
                    console.log('error',err)
                })

            }
        }
    }])
    .directive('userBlock',['$http','CONFIG','users',function($http,CONFIG,users){
        return {
            restrict:'EA',
            scope : {
                userId : '=',
                myUser : '='
            },
            templateUrl:'modules/common/directives/ownerBlock/userBlock.tpl.html',
            link : function(scope,element,attrs){

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
                element.bind('touch',function(e){
                    scope.block.isHovered = !scope.block.isHovered;
                });
                if(scope.userId){
                    users.fetch(null, scope.userId).then(function(user){
                        console.log(user);
                        scope.user = user;
                    }).catch(function(err){

                    })
                }
                if(scope.myUser){
                    scope.user = scope.myUser;
                }
            }
        }
    }])
.directive('userList',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            templateUrl:'modules/common/directives/ownerBlock/userList.tpl.html',
            scope:{
                userId : "@"
            },
            link : function(scope,element,attrs){
                var url=CONFIG.apiServer+'/users/'+scope.userId+'?context=userBlock';
                $http.get(url).success(function(data){
                    scope.user=data;
                }).error(function(err){
                    console.log('error',err);
                })
            }
        }
    }]);