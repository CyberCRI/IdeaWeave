angular.module('cri.challengeSettings',[])
    .controller('ChallengeSettingsCtrl',['$scope','challenge','users','Challenge','CONFIG','Notification',function($scope,challenge,users,Challenge,CONFIG,Notification){
        $scope.user = users;
        $scope.challenge = challenge[0];


        $scope.tinymceOptions = CONFIG.tinymceOptions;

        $scope.updateChallenge=function(){
            var data = {
                presentation : $scope.challenge.presentation,
                brief : $scope.challenge.brief,
                title : $scope.challenge.title
            };
            Challenge.update($scope.challenge.id,data).then(function(){
                Notification.display('Challenge updated');
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
    }])
    .controller('ChallengePosterCtrl',['$scope','Challenge','Notification','$modalInstance',function($scope,Challenge,Notification,$modalInstance){
        $scope.$on('cropReady',function(e,data){
            Challenge.update($scope.challenge.id,{ poster : data}).then(function(){
                $modalInstance.close(data);
            }).catch(function(err){
                Notification.display(err.message);
                $modalInstance.cancel();
            })
        })

    }])
.controller('BannerCtrl',['$scope','Challenge','Notification',function($scope,Challenge,Notification){
        $scope.$watch('bannerResult', function(newVal) {
            console.log('newVal',newVal)
            if (newVal) {
                Challenge.update($scope.challenge.id,{ banner : newVal }).then(function(){
                    $scope.challenge.poster = newVal;
                    Notification.display("Challenge's banner updated");
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        });
    }])