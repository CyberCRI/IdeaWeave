angular.module('cri.challengeSettings',[])
    .controller('ChallengeSettingsCtrl',['$scope','challenge','users',function($scope,challenge,users){
        $scope.user = users;
        $scope.challenge = challenge[0];

    }])
    .controller('ChallengeSettingsBasicCtrl',['$scope','Challenge','toaster','CONFIG',function($scope,Challenge,toaster,CONFIG){
        $scope.tinymceOptions = CONFIG.tinymceOptions;

        $scope.updateChallenge=function(){
            var data = {
                presentation : $scope.challenge.presentation,
                brief : $scope.challenge.brief,
                title : $scope.challenge.title
            };
            Challenge.update($scope.challenge.id,data).then(function(){
                toaster.pop('success','success','Challenge updated');
            }).catch(function(err){
                toaster.pop(err.status,err.message);
            })
        }
    }])
    .controller('ChallengeSettingsPosterCtrl',['$scope','Challenge','toaster',function($scope,Challenge,toaster) {
        $scope.$watch('imageCropResult', function(newVal) {
            if (newVal) {
                console.log($scope.challenge)
                Challenge.update($scope.challenge.id,{ poster : newVal }).then(function(){
                    $scope.challenge.poster = newVal;
                    toaster.pop('success','success',"Challenge's poster updated");
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
                })
            }
        });
    }]);




