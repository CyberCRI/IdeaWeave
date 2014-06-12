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
    .controller('HeaderCtrl',function($scope,Socket,loggedUser, users,$state,toaster,Project,Challenge,$q){
        $scope.user = users;
        $scope.me = loggedUser;

        $scope.logout =function(){
            users.logout().then(function(){
                $state.go('home');
            })
        }

        $scope.address = {};
        var first = true;
        $scope.refreshSearchBar = function(search) {
            var query = {title:{$regex:search+".*",$options: 'i'},context:'list'};
            var queryUser = {username:{$regex:search+".*",$options: 'i'},context:'list'}
            $q.all([
                users.fetch(queryUser),
                Challenge.fetch(query),
                Project.fetch(query)
            ]).then(function(data){
                console.log(first);
                if(!first){
                    console.log('er')
                    $scope.searchResult = [];
                    angular.extend($scope.searchResult, data[0],data[1],data[2]);
                }
                first = false;

            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
//            return $http.get(
//                'http://maps.googleapis.com/maps/api/geocode/json',
//                {params: params}
//            ).then(function(response) {
//                $scope.addresses = response.data.results
//            });
        };

    })
