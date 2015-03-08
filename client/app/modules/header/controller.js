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
                });
            }
        };

        $scope.goTo = function(result){
            switch(result.type) {
                case "user": 
                    $state.go('profile',{ uid : result._id });
                    break;
                case "project": 
                    $state.go('project.home',{ pid : result.accessUrl });
                    break;
                case "challenge": 
                    $state.go('challenge',{ cid : result.accessUrl });
                    break;
                case "tag":
                    $state.go('tag', { title: result.title });
                    break;
                default:
                    throw new Error("Cannot goto type " + type);
            }
        };
    }]);
