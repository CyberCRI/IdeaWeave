angular.module('cri.challengeSettings',[])
    .controller('ChallengeSettingsCtrl',['$scope','challenge','users',function($scope,challenge,users){
        $scope.user = users;
        $scope.challenge = challenge[0];

    }])
    .controller('ChallengeSettingsBasicCtrl',['$scope','Challenge','Notification','CONFIG',function($scope,Challenge,Notification,CONFIG){
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
    .controller('ChallengeSettingsPosterCtrl',['$scope','Challenge','Notification',function($scope,Challenge,Notification) {
        $scope.$watch('imageCropResult', function(newVal) {
            if (newVal) {
                Challenge.update($scope.challenge.id,{ poster : newVal }).then(function(){
                    $scope.challenge.poster = newVal;
                    Notification.display("Challenge's poster updated");
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        });
        $scope.$watch('bannerResult', function(newVal) {
            if (newVal) {
                Challenge.update($scope.challenge.id,{ banner : newVal }).then(function(){
                    $scope.challenge.poster = newVal;
                    Notification.display("Challenge's poster updated");
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        });
    }]);




