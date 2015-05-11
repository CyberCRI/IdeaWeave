angular.module('cri.notes', ['ngSanitize'])
.directive("listNotes", function() {
    return {
        restrict: "E",
        scope: {
            challenge: "=",
            currentUser: "="
        },
        templateUrl: "modules/notes/templates/show-notes.tpl.html",
        controller: function($scope,Challenge,Notification,$state,Project,$rootScope,NoteLab,$materialDialog) {
            $scope.canPostNote = function() {
                return $scope.currentUser._id == $scope.challenge.owner._id ;
            };

            $scope.canDeleteNote = function(note) {
                return note.owner._id == $scope.currentUser._id;
            }

            $scope.canPostComment = function(note) {
                // Return true if logged in
                return $scope.currentUser;
            }

            $scope.canDeleteComment = function(note, comment) {
                return note.owner._id == $scope.currentUser._id || comment.owner._id == $scope.currentUser._id;
            }

            $scope.refreshNotes = function() {
                NoteLab.listNotes({ challenge: $scope.challenge._id }).then(function(data){
                    $scope.notes = data;
                    
                    angular.forEach($scope.notes, function(note) {
                        // Add newComment field
                        note.newComment = "";
                    });
                }).catch(function(err){
                    Notification.display(err.message);
                });
            };

            $scope.popUpNewNote = function(){
                var notesInScope = $scope.notes;
                $materialDialog({
                    templateUrl : 'modules/notes/templates/add-note-modal.tpl.html',
                    locals : {
                        challenge : $scope.challenge
                    },
                    controller : function($scope,$hideDialog,challenge,Config){
                        $scope.tinymceOption = Config.tinymceOptions;

                        $scope.noteText = "";
                        $scope.addNote = function(noteText){
                            $scope.isLoading = true;

                            var note = {
                                challenge: challenge._id,
                                text: noteText
                            };

                            NoteLab.createNote(note).then(function(data){
                                Notification.display('Posted successfully');
                                notesInScope.unshift(data);
                            }).catch(function(err){
                                Notification.display(err.message);
                            }).finally(function(){
                                $scope.isLoading = false;
                                $hideDialog();
                            });
                        };
                        $scope.cancel = function(){
                            $hideDialog();
                        };
                    }
                });
            };
            
            $scope.deleteNote = function(note) {
                NoteLab.deleteNote(note._id).then(function() {
                    Notification.display("Publication deleted");

                    // Delete the note from the list
                    var noteIndex = $scope.notes.indexOf(note);
                    $scope.notes.splice(noteIndex, 1);
                });
            };

            $scope.postComment = function(note) {
                NoteLab.createComment(note._id, note.newComment).then(function(data){
                    Notification.display("Comment posted");

                    // Add the new comment and clear the field
                    note.comments.push(data);
                    note.newComment = "";
                }).catch(function(err){
                    Notification.display(err.message);
                });
            };

            $scope.deleteComment = function(note, comment) {
                NoteLab.deleteComment(note._id, comment._id).then(function(){
                    Notification.display("Comment deleted");

                    // Delete the comment from the list
                    var commentIndex = note.comments.indexOf(comment);
                    note.comments.splice(commentIndex, 1);
                }).catch(function(err){
                    Notification.display(err.message);
                });
            };

            $scope.refreshNotes();
        }
    };
});


