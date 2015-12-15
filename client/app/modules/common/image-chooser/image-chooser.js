angular.module("cri.imageChooser", ["ngImgCrop"])
.directive('imageChooser', function() {
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
