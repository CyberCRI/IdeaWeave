angular.module('cri.profile')
    .directive('userInfo', function() {
        return {
            restrict:'EA',
            scope : {
                userId : '=',
                myUser : '='
            },
            templateUrl:'modules/profile/directives/userBlock/user-info.tpl.html',
            controller : function($scope,Profile){
                if($scope.userId){
                    Profile.fetch( { _id : $scope.userId, type : 'card' }).then(function(user){
                        $scope.user = user[0];
                        console.log(user[0]);
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.user = $scope.myUser;
                }
            },
            link : function(scope,element,attrs){
            }
        };
    })
    .directive('userBlock', function(){
        return {
            restrict:'EA',
            scope : {
                userId : '=',
                myUser : '=',
                height : '=',
                width : '='
            },
            templateUrl:'modules/profile/directives/userBlock/user-block.tpl.html',
            controller : ['$scope','Profile',function($scope,Profile){
                if($scope.userId){
                    Profile.fetch( { _id : $scope.userId, type : 'block' }).then(function(user){
                        $scope.user = user[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.user = $scope.myUser;
                }
            }],
            link : function(scope,element,attrs){
                if(scope.height){
                    element.find('img').attr('height' , scope.height);
                }

                if(scope.width){
                    element.find('img').attr('width' , scope.width);
                }


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
        };
    })
    .directive('userCard', function(){
        return {
            restrict:'EA',
            scope : {
                userId : '=',
                myUser : '='
            },
            templateUrl:'modules/profile/directives/userBlock/user-card.tpl.html',
            controller : function($scope,Profile) {
                console.log('ici le controller');
                if($scope.userId){
                    Profile.fetch( { _id : $scope.userId, type : 'card' }).then(function(user){
                        $scope.user = user[0];
                        console.log(user[0]);
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.user = $scope.myUser;
                }
            }
        };
    });