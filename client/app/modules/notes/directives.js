angular.module('cri.notes', ['ngSanitize'])
.directive("listNotes", function() {
    return {
        restrict: "E",
        scope: {
            challenge: "=",
            project: "=",
            idea: "=",
            currentUser: "=",
            templates: "="
        },
        templateUrl: "modules/notes/templates/show-notes.tpl.html",
        controller: function($scope, Notification, Notes, $mdDialog) {
            $scope.canPostNote = function() {
                if(!$scope.currentUser) return false;

                // The owner can always post notes
                if($scope.container.owner._id == $scope.currentUser._id) return true;

                // Members can also post notes
                if($scope.container.members && _.contains(_.pluck($scope.container.members, "_id"), $scope.currentUser._id)) return true;

                return false;
            };

            $scope.canDeleteNote = function(note) {
                if(!$scope.currentUser) return false;

                // The owner can always remove notes
                if($scope.container.owner._id == $scope.currentUser._id) return true;

                // The creator of the note can remove it
                return note.owner._id == $scope.currentUser._id;

                return false;
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

                $mdDialog.show({
                    templateUrl : 'modules/notes/templates/add-note-modal.tpl.html',
                    locals : {
                        container: $scope.container,
                        containerType: $scope.containerType,
                        templates: $scope.templates
                    },
                    controller : function($scope, container, containerType, templates, Config){
                        $scope.tinymceOption = _.extend({}, Config.tinymceOptions, {
                            templates: templates
                        });

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
                                $mdDialog.hide();
                            });
                        };
                        $scope.cancel = function(){
                            $mdDialog.hide();
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


            // Notes will belong to either a challenge, project, or idea
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
        scope: {
            noteId: '=',
            myNote: '='
        },
        controller: function ($scope, Notes, $state, Project, Challenge) {
            function updateScope(note) {
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
                    // Projects and notes need their access URLs 
                    if(note.project) {
                        Project.fetch({ _id: note.project }).then(function(projects) {
                            $state.go("project.home", { pid: projects[0].accessUrl });
                        });
                    }
                    else if(note.challenge) {
                        Challenge.fetch({ _id: note.challenge }).then(function(challenges) {
                            $state.go("challenge", { pid: challenges[0].accessUrl });
                        });
                    }
                    else if(note.idea) {
                        $state.go("idea", { iid: note.idea });
                    }
                    else {
                        throw new Error("Note is not attached to project, challenge, or idea");
                    }
                }
            }

            if($scope.noteId) {
                Notes.fetchNote($scope.noteId).then(updateScope)
                .catch(function(err) {
                    console.log('error', err);
                });
            } else {
                updateScope($scope.myNote);
            }
        },
        templateUrl: 'modules/notes/templates/note-info.tpl.html'
    };
});


