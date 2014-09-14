angular.module('cri.header',[])

    .controller('HeaderCtrl',['$scope','$state','Notification','SearchBar','$auth','$rootScope',function($scope,$state,Notification,SearchBar,$materialSidenav,$rootScope){

        $scope.sideNavToggle = function(event){
            $rootScope.$broadcast(event);
        };

        $scope.toggleRight = function(param){
            $rootScope.$broadcast('toggleRight',param);
        };

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
    }]);
