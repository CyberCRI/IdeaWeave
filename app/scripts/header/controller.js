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
    .controller('HeaderCtrl',function($scope,Socket,loggedUser, users,$state,toaster,SearchBar){
        $scope.user = users;
        $scope.me = loggedUser;

        $scope.logout =function(){
            users.logout().then(function(){
                $state.go('home');
            })
        }

        $scope.refreshSearchBar = function(search) {
            SearchBar.refresh(search).then(function(result){
                $scope.searchResult = result;
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
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
        }
    })
