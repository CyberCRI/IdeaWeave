angular.module('cri.common')
    .directive('comments',['loggedUser','Comment','Socket','$sce',function(loggedUser, Comment, Socket,$sce){
        return {
            restrict:'EA',
            templateUrl:'scripts/common/directives/comments/comments.tpl.html',
            link: function (scope,element,attrs){
                var oj=scope.$eval(attrs.comments);
                //load comments
                scope.comments=[];
                var topicId = attrs.topicid;
                Comment.fetch({type:oj.type,container:topicId}).then(function(result){
                    scope.comments=result;
                    angular.forEach(scope.comments,function(comment,id){
                        console.log(comment)
                        scope.comments[id].displayText = $sce.trustAsHtml(comment.text);
                        console.log(scope.comments[id])
                    })
                }).catch(function(err){
                    console.log('error',err)
                })

                scope.addComment = function(){
                    var option={
                        owner:loggedUser.profile.id,
                        text:scope.commentValue,
                        type:oj.type,
                        container:topicId
                    };
                    Comment.post(option).then(function(result){
                        scope.comments.push(result);
                        scope.commentValue='';
                    }).catch(function(err){
                        console.log('error',err);
                    })
                };
                scope.replyComment=function(pid,idx){
                    var option={
                        owner:loggedUser.profile.id,
                        text:scope.comments[idx].replyComment,
                        type:oj.type,
                        container:topicId,
                        parent:pid
                    };
                    Comment.post(option).then(function(result){
                        scope.comments[idx] = option;
                        scope.comments[idx].replyComment='';
                        scope.comments[idx].isReply=true;
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

                Socket.on('comments:create',function(data){
                    Comment.fetch({id:data.id}).then(function(result){
                        scope.comments.push(result);
                    }).catch(function(err){
                        console.log('error',err);
                    })
                })
            }
        };
    }]);