angular.module('cri.header',[])

    .controller('HeaderCtrl',['$scope','$state','Notification','SearchBar', '$materialSidenav','$timeout','$auth','$rootScope',function($scope,$state,Notification,SearchBar,$materialSidenav,$timeout,$auth,$rootScope){
        var rightNav;

        $scope.sideNavToggle = function(event){
            $rootScope.$broadcast(event);
        };
        $rootScope.$on('showLogin',function(){
            $scope.toggleRight('login')
        });

        $timeout(function(){
            $scope.toggleRight = function(template) {
                if(template){
                    switch(template){
                        case 'login':
                            $scope.sideNavTemplateUrl = 'modules/auth/templates/signin.tpl.html';
                            break;
                        case 'menu':
                            $scope.sideNavTemplateUrl = 'modules/header/templates/menu.tpl.html';
                            break;
                        case 'notif':
                            $scope.sideNavTemplateUrl = 'modules/header/templates/notifications.tpl.html';
                            if($scope.currentUser){
                                users.getActivity($scope.currentUser._id,5).then(function(data){
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
            $scope.signout =function(){
                $auth.logout();
                rightNav.toggle();
                Notification.display('You have been logged out');
            };

        },500);

        $scope.refreshSearchBar = function(search) {
            if(search.length >=  1 ){
                SearchBar.refresh(search).then(function(result){
                    $scope.searchResult = result;
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        };

        $scope.goTo = function(result){
            if(result.username){
                $state.go('profile',{ uid : result._id })
            }else if(result.container){
                $state.go('project',{ pid : result.accessUrl })
            }else{
                $state.go('challenge',{ pid : result.accessUrl })
            }
        };
    }])
