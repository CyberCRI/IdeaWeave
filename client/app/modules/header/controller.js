angular.module('cri.header',[])

.controller('HeaderCtrl',function($scope,$auth,$state,Notification,SearchBar,$mdSidenav,$rootScope,mySocket,Profile){
    $scope.searchText = "";

    $scope.sideNavToggle = function(event){
        $rootScope.$broadcast(event);
    };

    $scope.toggleRight = function(param){
        $rootScope.$broadcast('toggleRight',param);
    };

    $scope.lookFor = function(search) {
        if(search.length == 0) return [];

        return SearchBar.lookFor(search).catch(function(err){
            Notification.display(err.message);
        });
    };

    $scope.signout = function() {
        $auth.logout();
        $rootScope.currentUser = null;
        mySocket.disconnect();
        Notification.display('You have been logged out');
    }

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
            case "idea":
                $state.go('idea', { iid: result._id });
                break;
            default:
                throw new Error("Cannot goto type " + type);
        }
    };
});
