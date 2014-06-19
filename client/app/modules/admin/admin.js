angular.module('cri.admin', [])

    .config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $stateProvider
            .state('admin.challenge.create', {
                url : '/admin/challenge/create',
                templateUrl: 'views/admin/challenge/create.html',
                controller: 'CreateChallengeCtrl'
            })
            .state('admin.challenge.list',{
                url : '/admin/challenge/list',
                templateUrl: 'views/admin/challenge/list.html',
                controller: 'ChallengeListCtrl'
            })
    }])

    .controller('TabsCtrl', ['$scope', '$location', function($scope, $location){

        $scope.isActive = function(tab) {
            var path = $location.path().split('/');
            var urlToken = path[path.length-1];
            return tab === urlToken;
        };

    }])

    .controller('CreateChallengeCtrl',['$scope', function($scope){

    }])

    .controller('ChallengeListCtrl',['$scope', function($scope){

    }]);