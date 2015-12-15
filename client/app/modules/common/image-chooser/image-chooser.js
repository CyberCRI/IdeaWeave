angular.module("cri.imageChooser", ["ngImgCrop"])
.factory("imageChooserModal", function($q, $mdDialog, Notification) {
    return function(options) {
        if(!options) options = {};

        _.defaults(options, { 
            shape: "circle"
        });

        var deferred = $q.defer();

        $mdDialog.show({
            templateUrl : 'modules/common/image-chooser/image-chooser-modal.tpl.html',
            controller : function($scope){
                $scope.shape = options.shape;
                
                $scope.imageCropResult = null;
                $scope.isImageChosen = false;

                $scope.save = function() {
                    Notification.display('Image saved');
                    $mdDialog.hide();
                    deferred.resolve($scope.imageCropResult);
                };

                $scope.cancel = function() {
                    $mdDialog.hide();
                    deferred.reject();
                };
            }
        });

        return deferred.promise;
    };
}).directive("imageChooser", function() {
    return {
        restrict : 'E',
        templateUrl : 'modules/common/image-chooser/image-chooser.tpl.html',
        scope: {
            inputImage: "=?",
            finalImage: "=",
            isImageChosen: "=?",
            shape: "=?"
        },
        controller: function($scope) {
            $scope.selectedFiles = null;
            $scope.isImageChosen = false;

            var handleFileSelect = function(evt) {
                if(!$scope.selectedFiles || $scope.selectedFiles.length === 0) return;

                $scope.isImageChosen = false;
                var file = $scope.selectedFiles[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function($scope) {
                        $scope.inputImage = evt.target.result;
                        $scope.isImageChosen = true;
                    }); 
                };
                reader.readAsDataURL(file);
            };

            $scope.$watch("selectedFiles", handleFileSelect);
        }
    };
});
