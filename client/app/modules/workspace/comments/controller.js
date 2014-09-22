angular.module('cri.workspace')
    .controller('CommentsCtrl',['$scope','Comment','$sce','Config','$materialDialog','mySocket',function($scope,Comment,$sce,Config,$materialDialog,mySocket){
        var myTopic = $scope.myNote,
            currentUser = $scope.currentUser;

        $scope.popUpComment = function(e,parent,pid){
            $materialDialog({
                templateUrl : 'modules/workspace/comments/templates/commentModal.tpl.html',
                targetEvent: e,
                controller : ['$scope','$hideDialog',function($scope,$hideDialog){
                    $scope.tinymceOption = Config.tinymceOptions;

                    $scope.addComment = function(){
                        var myComment;
                        if(!parent){
                            myComment = {
                                owner:currentUser._id,
                                text:$scope.commentValue,
                                container:myTopic._id
                            };
                        }else{
                            myComment = {
                                owner:currentUser._id,
                                text:$scope.commentValue,
                                container:myTopic._id,
                                parent:pid
                            };
                        }
                        Comment.post(myComment).then(function(result){
                            result.displayText = $sce.trustAsHtml(result.text);
                            $hideDialog();

                        }).catch(function(err){
                            $hideDialog();

                        });
                    };
                    $scope.cancel = function () {
                        $hideDialog();
                    };
                }]
            });
        };
        $scope.removeComment=function(id,idx){
            Comment.delete(id).then(function(result){
                $scope.comments.splice(idx,1);
            }).catch(function(err){
                console.log('error',err);
            });
        };

        $scope.comments=[];
        Comment.fetch({container:myTopic._id}).then(function(result){
            angular.forEach(result,function(comment,id){
                    comment.displayText = $sce.trustAsHtml(comment.text);
                    angular.forEach(comment.answer,function(answer){
                        answer.displayText = $sce.trustAsHtml(answer.text);
                    });
                $scope.comments.splice(0,0,comment);
            });
        }).catch(function(err){
            console.log('error',err);
        });

        $scope.commentsShow = false;
        $scope.showComment = function($index){
            $scope.commentsShow = !$scope.commentsShow;
        };
        $scope.answers = [];
        $scope.showAnswer = function($index){
            if(!$scope.answers[$index]){
                $scope.answers[$index] = true;
            }else{
                $scope.answers[$index] = false;
            }
        };

        mySocket.socket.on('notelab_'+myTopic._id+'::newComment',function(newComment){
            newComment.displayText = $sce.trustAsHtml(newComment.text);
            if(newComment.parent) {
                angular.forEach($scope.comments,function(comment){
                    if(newComment.parent == comment._id){
                        comment.answer.push(newComment);
                    }
                });
            }else {
                $scope.comments.push(newComment);
            }
        });
    }])
    .directive('comments',['Comment','$sce','Config','$materialDialog',function(Comment,$sce,Config,$materialDialog){
        return {
            restrict:'EA',
            templateUrl:'modules/workspace/comments/templates/comments.tpl.html',
            scope : {
              comments : '=',
              topicId : '@'
            },
            controller : ['$scope','Config','$materialDialog',function($scope,Config){


            }],
            link: function (scope,element,attrs){


            }
        };
    }]);