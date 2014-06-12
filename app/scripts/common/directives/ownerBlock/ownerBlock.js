angular.module('cri.common')
    .directive('ownerBlock',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            templateUrl:'scripts/common/directives/ownerBlock/ownerBlock.tpl.html',
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
            template:
                '<a ng-href="user/{{uid}}" class="inline">{{user[uid].username}}</a>',
            link : function(scope,element,attrs){
                scope.uid=scope.$eval(attrs.userInfo);

                if(!scope.user&&scope.uid!==undefined){
                    scope.user={};
                }
                if(scope.uid===undefined){
                    return false;
                }

                if(!scope.user[scope.uid]&&scope.uid!==undefined){
                    var url=CONFIG.apiServer+'/users/'+scope.uid+'?context=userBlock';
                    var hash='usersBlock-'+scope.uid;
                    $http.get(url).success(function(data){
                        scope.user[scope.uid]=data;
                    }).error(function(err){
                        console.log('error',err)
                    })
                }
            }
        }
    }])
    .directive('userBlock',['$http','CONFIG','$document',function($http,CONFIG,$document){
        return {
            restrict:'EA',
            replace:true,
            templateUrl:'scripts/common/directives/ownerBlock/userBlock.tpl.html',
            link : function(scope,element,attrs){
                console.log(attrs)


                scope.uid=scope.$eval(attrs.userBlock);
                if(!scope.user&&scope.uid!==undefined){
                    scope.user={};
                }
                if(scope.uid===undefined){
                    return false;
                }

                if(!scope.user[scope.uid]&&scope.uid!==undefined){
                    var url=CONFIG.apiServer+'/users/'+scope.uid+'?context=userBlock';
                    $http.get(url).success(function(data){
                        scope.user[scope.uid]=data;
                        if(attrs.del === 'true'){
                            element[0].style.position ="relative;";
                            var i = $document[0].createElement('i');
                            i.style.position = "absolute"
                            i.style.top = "-10px";
                            i.style.right = "-10px";
                            i.classList.add("fa");
                            i.classList.add("fa-2x");
                            i.classList.add("fa-times");
                            element[0].appendChild(i);
                            i.addEventListener('click',function(){
                                scope.removeMember(attrs.index,scope.user[scope.uid]);
                            })
                        }
                    }).error(function(err){
                        console.log('error',err);
                    })
                }
            }
        }
    }])
;