angular.module('cri.header',[])
    .directive('selectFocus',function(){
        return {
            link : function(scope,element,attrs){
                var input = element.find('input');
                input.bind('focus',function(){
                    scope.width = '400px';
                })
                input.bind('blur',function(){
                    scope.width='300px';
                })
            }
        }
    })
    .controller('HeaderCtrl',['$scope','loggedUser', 'users','$state','toaster','SearchBar', '$materialSidenav','$timeout', function($scope,loggedUser, users,$state,toaster,SearchBar,$materialSidenav,$timeout){
        $scope.user = users;
        $scope.me = loggedUser;

        $scope.logout =function(){
            users.logout().then(function(){
                $state.go('main');
            })
        };

        $scope.goHome = function(){
            if(loggedUser.profile){
                $state.go('home');
            }else{
                $state.go('main');
            }
        }
        $timeout(function(){
            var loginNav;
            $scope.toggleLogin = function() {
                loginNav.toggle();
            };
            loginNav = $materialSidenav('login');

            $scope.$on('side:close-right',function(){
                loginNav.toggle();
            });
            var notifNav;
            $scope.toggleNotif = function() {
                console.log('derr')
                notifNav.toggle();
            };
            notifNav = $materialSidenav('notif');

            if($scope.me.profile){
                users.getActivity($scope.me.profile.id).then(function(data){
                    console.log('activities',data);
                    $scope.activities = data;
                }).catch(function(err){
                    console.log(err);
                })
            }
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
                    console.log(result)
                    $scope.searchResult = result;
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
                })
            }
        };

        $scope.goTo = function(result){
            console.log(result)
            if(result.username){
                console.log(result)
                $state.go('profile',{ uid : result.id })
            }else if(result.container){
                $state.go('project',{ pid : result.accessUrl })
            }else{
                $state.go('challenge',{ pid : result.accessUrl })
            }
            console.log(result)
        };

        dpd.on('activities:create',function(data){
            console.log('new Activity', data);
            if(data.owner == $scope.me.profile.id){
                $scope.$apply(function(){
                    $scope.newNotif = true;
                })
            }

        })

    }])
