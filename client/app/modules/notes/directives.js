angular.module('cri.notes', ['ngSanitize'])
.directive("listNotes", function() {
    return {
        restrict: "E",
        scope: {
            challenge: "=",
            project: "=",
            idea: "=",
            currentUser: "="
        },
        templateUrl: "modules/notes/templates/show-notes.tpl.html",
        controller: function($scope, Notification, Notes, $materialDialog) {
            $scope.canPostNote = function() {
                return $scope.currentUser && $scope.currentUser._id == $scope.container.owner._id;
            };

            $scope.canDeleteNote = function(note) {
                return $scope.currentUser && note.owner._id == $scope.currentUser._id;
            };

            $scope.canPostComment = function(note) {
                // Return true if logged in
                return $scope.currentUser;
            };

            $scope.canDeleteComment = function(note, comment) {
                return $scope.currentUser && (note.owner._id == $scope.currentUser._id || comment.owner._id == $scope.currentUser._id);
            };

            $scope.refreshNotes = function() {
                var searchParams = {};
                searchParams[$scope.containerType] = $scope.container._id;

                Notes.listNotes(searchParams).then(function(data){
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
                        container: $scope.container,
                        containerType: $scope.containerType
                    },
                    controller : function($scope, $hideDialog, container, containerType, Config){
                        $scope.tinymceOption = Config.tinymceOptions;

                        $scope.noteText = "";
                        $scope.addNote = function(noteText){
                            $scope.isLoading = true;

                            var note = {
                                text: noteText
                            };

                            note[containerType] = container._id;

                            Notes.createNote(note).then(function(data){
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
                Notes.deleteNote(note._id).then(function() {
                    Notification.display("Publication deleted");

                    // Delete the note from the list
                    var noteIndex = $scope.notes.indexOf(note);
                    $scope.notes.splice(noteIndex, 1);
                });
            };

            $scope.postComment = function(note) {
                Notes.createComment(note._id, note.newComment).then(function(data){
                    Notification.display("Comment posted");

                    // Add the new comment and clear the field
                    note.comments.push(data);
                    note.newComment = "";
                }).catch(function(err){
                    Notification.display(err.message);
                });
            };

            $scope.deleteComment = function(note, comment) {
                Notes.deleteComment(note._id, comment._id).then(function(){
                    Notification.display("Comment deleted");

                    // Delete the comment from the list
                    var commentIndex = note.comments.indexOf(comment);
                    note.comments.splice(commentIndex, 1);
                }).catch(function(err){
                    Notification.display(err.message);
                });
            };


            // Notes will belong to either a challenge or project
            if($scope.challenge) {
                $scope.container = $scope.challenge;
                $scope.containerType = "challenge";
            } else if($scope.project) {
                $scope.container = $scope.project;
                $scope.containerType = "project";
            } else if($scope.idea) {
                $scope.container = $scope.idea;
                $scope.containerType = "idea";
            } else {
                throw new Error("No container specified");
            }

            $scope.refreshNotes();
        }
    };
})
.directive('noteInfo', function () {
    return {
        restrict:'EA',
        replace: true,
        scope: {
            noteId: '='
        },
        controller: function ($scope, Notes, $state) {
            Notes.fetchNote($scope.noteId).then(function(note) {
                var MAX_TEXT_LENGTH = 30;

                if(note.text[0] == "<") 
                    // To get text, turn it into an element and ask for inner text
                    $scope.text = angular.element(note.text).text();
                else
                    $scope.text = note.text;

                // Cut off text that's too long
                if($scope.text.length > MAX_TEXT_LENGTH) {
                    $scope.text = $scope.text.slice(0, MAX_TEXT_LENGTH - 4) + " ...";
                }

                $scope.onClick = function() {
                    if(note.project) $state.go("project.home", { pid: note.project });
                    else if(note.challenge) $state.go("challengeById", { cid: note.challenge });
                    else if(note.idea) $state.go("idea", { iid: note.idea });
                    else throw new Error("Note is not attached to project, challenge, or idea");
                }
            }).catch(function(err) {
                console.log('error', err);
            });
        },
        templateUrl: 'modules/notes/templates/note-info.tpl.html'
    };
});


