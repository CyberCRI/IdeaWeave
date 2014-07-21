angular.module('cri.header',[])
    .directive('selectFocus',function(){
        return {
            link : function(scope,element,attrs){
                var input = element.find('input');
                input.bind('focus',function(){
                    scope.width = '400px';
                });
                input.bind('blur',function(){
                    scope.width='300px';
                })
            }
        }
    })
    .controller('HeaderCtrl',['$scope','loggedUser', 'users','$state','toaster','SearchBar', '$materialSidenav','$timeout',
        function($scope,loggedUser, users,$state,toaster,SearchBar,$materialSidenav,$timeout){
        $scope.user = users;
        $scope.me = loggedUser;

        $scope.logout =function(){
            users.logout().then(function(){
                //todo fix this for production
//                $window.location.href=''
                $state.go('home');
            })
        };


        $timeout(function(){
            var rightNav;
            $scope.toggleRight = function(template) {
                if(template){
                    switch(template){
                        case 'login':
                            $scope.sideNavTemplateUrl = 'modules/account/templates/signin.tpl.html';
                            break;
                        case 'menu':
                            $scope.sideNavTemplateUrl = 'modules/header/templates/menu.tpl.html';
                            break;
                        case 'notif':
                            $scope.sideNavTemplateUrl = 'modules/header/templates/notifications.tpl.html';
                            if($scope.me.profile){
                                users.getActivity($scope.me.profile.id,0).then(function(data){
                                    $scope.activities = data;
                                }).catch(function(err){
                                    console.log(err);
                                })
                            }
                            break;
                    }
                }

                rightNav.toggle();
            };
            rightNav = $materialSidenav('right');

            $scope.$on('side:close-right',function(){
                rightNav.toggle();
            });

        },500);
        $scope.noPage=1;
        $scope.isEnd=false;
        $scope.loadMoreActivities=function(num){
            $scope.noPage=num+1;
            var skip=10*num;
            if(!$scope.isEnd){
                users.getActivity($scope.me.profile.id,skip).then(function(result){
                    if(result.length>0){
                        for(var i=0;i<result.length;i++){
                            $scope.activities.push(result[i]);
                        }
                    }else{
                        $scope.isEnd=true;
                    }
                })
            }
        };

        $scope.refreshSearchBar = function(search) {
            if(search.length >=  2 ){
                SearchBar.refresh(search).then(function(result){
                    $scope.searchResult = result;
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
                })
            }
        };

        $scope.goTo = function(result){
            if(result.username){
                $state.go('profile',{ uid : result.id })
            }else if(result.container){
                $state.go('project',{ pid : result.accessUrl })
            }else{
                $state.go('challenge',{ pid : result.accessUrl })
            }
        };

        dpd.on('activities:create',function(data){
            if(data.owner == $scope.me.profile.id){
                $scope.$apply(function(){
                    $scope.newNotif = true;
                })
            }

        });


    }])