angular.module('cri.tag')
    .directive('tagManager', function(){
        return {
            restrict:'EA',
            scope:{entity:'='},
            replace:true,
            templateUrl:'modules/tag/directives/tags.tpl.html',
            controller : function($scope,Tag,Notification){
                var allTags = [];
                Tag.fetch().then(function(result){
                    allTags = result;
                }).catch(function(err){
                    console.log(err);
                });

                $scope.matchedTags = allTags;
                $scope.updateMatchedTags = function(userText) {
                    var searchText = userText.toLowerCase();
                    $scope.matchedTags = _.filter(allTags, function(tag) { 
                        return tag.title.toLowerCase().indexOf(searchText) != -1;
                    });
                };

                $scope.pickedItem = function(selectedItem) {
                    console.log("Chose", selectedItem);

                    // selectedItem could be an existing tag (an object) or a new tag (a string)
                    if(_.isObject(selectedItem)) return selectedItem;

                    Tag.create(selectedItem).then(function(newTag) {
                        allTags.push(newTag);

                        // Replace the temporary tag object with the new one
                        var tagIndex = _.findIndex($scope.entity.tags, function(tag) { return tag.title == selectedItem });
                        $scope.entity.tags[tagIndex] = newTag; 
                    }).catch(function(err){
                        console.log("Error creating tag", err);
                    });

                    return { title: selectedItem, _id: "TEMPORARY" };
                };
            }
        };
    })
    .directive('showtags',function(){
        return {
            restrict: 'EA',
            scope: { entity: '=' },
            templateUrl:'modules/tag/directives/show-tags.tpl.html'
        };
    });