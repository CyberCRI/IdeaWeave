angular.module('cri.common')
    .directive('comments',['loggedUser','Comment','$sce','CONFIG',function(loggedUser,Comment,$sce,CONFIG){
        return {
            restrict:'EA',
            templateUrl:'modules/common/directives/comments/comments.tpl.html',
            scope : {
              comments : '=',
              topicId : '@'
            },
            controller : ['$scope','CONFIG',function($scope,CONFIG){
                $scope.me = loggedUser.profile;
                $scope.tinymceOption = CONFIG.tinymceOptions;
            }],
            link: function (scope,element,attrs){
                scope.addComment = function(){
                    var option={
                        owner:loggedUser.profile.id,
                        text:scope.commentValue,
//                        type:oj.type,
                        container:scope.topicId
                    };
                    Comment.post(option).then(function(result){
                        result.displayText = $sce.trustAsHtml(result.text);
//                        scope.comments.splice(0,0,result);
                        scope.commentValue='';
                    }).catch(function(err){
                    })
                };
                scope.replyComment=function(pid,idx){
                    var option={
                        owner:loggedUser.profile.id,
                        text:scope.comments[idx].replyComment,
//                        type:oj.type,
                        container:scope.topicId,
                        parent:pid
                    };
                    Comment.post(option).then(function(result){
                        result = option;
                        result.replyComment='';
                        result.isReply=true;
//                        result.displayText = $sce.trustAsHtml(result.text);
//                        scope.comments.splice(idx+1,0,result);

                    }).catch(function(err){
                        console.log('error',err);
                    })
                }
                scope.removeComment=function(id,idx){
                    Comment.delete(id).then(function(result){
                        scope.comments.splice(idx,1);
                    }).catch(function(err){
                        console.log('error',err);
                    })
                }
            }
        };
    }]);