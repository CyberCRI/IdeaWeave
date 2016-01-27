angular.module('cri.tag')
    .directive('tagManager', function(){
        return {
            restrict: 'EA',
            scope: {
                model: '='
            },
            replace: true,
            templateUrl: 'modules/tag/directives/tags.tpl.html',
            controller : function($scope,Tag,Notification){
                var allTags = [];
                Tag.fetch().then(function(result){
                    allTags = result;
                }).catch(function(err){
                    console.log(err);
                });

                $scope.matchedTags = allTags;
                $scope.updateMatchedTags = function(userText) {
                    if(userText == "") return;

                    var searchText = userText.toLowerCase();

                    // Find approximate matches
                    $scope.matchedTags = _.filter(allTags, function(tag) { 
                        return tag.entityCount > 0 && tag.title.toLowerCase().indexOf(searchText) != -1;
                    });

                    // If there's not an exact match, propose the user's text first
                    if(!_.find($scope.matchedTags.matchedTags, function(tag) { tag.title.toLowerCase() == searchText }))
                    {
                        $scope.matchedTags.unshift({ title: userText, _id: "TEMPORARY" });
                    }
                };

                $scope.pickedItem = function(selectedItem) {
                    // selectedItem could be an existing tag or a new tag (_id == "TEMPORARY")

                    // If the tag already exists, just use it
                    if(selectedItem._id != "TEMPORARY") return selectedItem;

                    // Otherwise the tag may exist but not displayed (number == 0)
                    var existingTag = _.find(allTags, function(tag) { return tag.title == selectedItem.title; });
                    if(existingTag) return existingTag;

                    // No existing tag. Time to create a new one
                    Tag.create(selectedItem.title).then(function(newTag) {
                        allTags.push(newTag);

                        // Replace the temporary tag object with the new one
                        var tagIndex = _.findIndex($scope.model, function(tag) { return tag.title == selectedItem.title });
                        $scope.model[tagIndex] = newTag; 
                    }).catch(function(err){
                        console.log("Error creating tag", err);
                        Notification.display("Error creating tag");
                    });

                    return selectedItem;
                };
            }
        };
    })
    .directive('showTags',function(){
        return {
            restrict: 'EA',
            scope: { model: '=' },
            templateUrl:'modules/tag/directives/show-tags.tpl.html'
        };
    });