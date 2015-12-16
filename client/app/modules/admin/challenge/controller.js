angular.module('cri.admin.challenge',[])
    .controller('ChallengeAdminLeftCtrl',function($scope,$mdDialog,$state,Challenge,Notification,NoteLab,imageChooserModal){
        $scope.popUpPoster = function() {
            imageChooserModal({ shape: "square" }).then(function(image) {
                var newChallenge = {
                    poster: image
                };
                Challenge.update(Challenge.data._id, newChallenge);
            });
        };

        $scope.popUpBanner = function() {
            imageChooserModal({ 
                shape: "rectangle", 
                aspectRatio: 3, 
                finalImageSize: {w: 900, h: 300} 
            }).then(function(image) {
                var newChallenge = {
                    banner: image
                };
                Challenge.update(Challenge.data._id, newChallenge);
            });
        };

        $scope.popUpEdit = function(){
            $mdDialog.show({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-edit-modal.tpl.html',
                locals : {
                    challenge : Challenge.data
                },
                controller : function($scope,challenge,Config){
                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.newChallenge = {};
                    $scope.newChallenge.home = challenge.home;
                    $scope.update = function(newChallenge){
                        $scope.isLoading = true;
                        Challenge.update(challenge._id,newChallenge).then(function(data){
                            Notification.display('Updated successfully');
                            Challenge.data = data; // Update the challenge locally so that the next edit will take it into account
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

        $scope.popUpRemove = function(){
            $mdDialog.show({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-remove-modal.tpl.html',
                locals : {
                    challenge : Challenge.data
                },
                controller : function($scope,challenge){
                    $scope.challengeTitle = challenge.title

                    $scope.delete = function(){
                        Challenge.remove(challenge._id).then(function(){
                            Notification.display(challenge.title+' successfully removed');
                            $state.go("home");
                        }).catch(function(err){
                            Notification.display('Error, the challenge was not removed');
                        }).finally(function(){
                            $mdDialog.hide();
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };
    })
    .controller('AdminChallengeCtrl', function($scope,challenge,Challenge,Notification,$mdDialog,Project,$rootScope,Badge){
        $scope.challenge = challenge[0];
        $scope.templates = [];
        $scope.toggleLeft = function(){
            $rootScope.$broadcast('toggleLeft');
        };

        Project.getByChallenge($scope.challenge._id).then(function(data){
           $scope.projects = data;
        }).catch(function(err){
            console.log(err);
        });

        Challenge.getTemplates( $scope.challenge._id).then(function(data){
            $scope.templates = data;
        }).catch(function(err){
            console.log(err);
        });

        $scope.badges = [];
        function updateBadges() {
            Badge.listBadges().then(function(badges) { 
                $scope.badges = badges;
            }).catch(function(err) { 
                console.error(err); 
            });
        }
        updateBadges();

        $scope.canModifyBadge = function(badge) {
            return badge.owner == $rootScope.currentUser._id;
        }

        $scope.popUpGiveBadge = function(badge) {
            $mdDialog.show({
                templateUrl: 'modules/badge/templates/give-badge-modal.tpl.html',
                escapeToClose: true,
                clickOutsideToClose: true,
                locals: { 
                    challenge: $scope.challenge,
                },
                controller: function($scope, challenge) {
                    $scope.badge = badge;

                    $scope.project = null;
                    $scope.testimonial = "";

                    // Only include projects for this challenge
                    $scope.filter = function(item) {
                        return item.container == challenge._id;
                    }

                    $scope.onSelection = function(selection) {
                        $scope.project = selection;
                    }

                    $scope.give = function() {
                        if(!$scope.project) return;

                        var credit = {
                            badge: badge._id,
                            givenByEntity: challenge._id,
                            givenByType: "challenge",
                            givenToEntity: $scope.project._id,
                            givenToType: "project",
                            testimonial: $scope.testimonial
                        };

                        return Badge.giveCredit(credit).then(function(data) {
                           Notification.display('Badge given');
                           $mdDialog.hide();
                        }).catch(function(err) {
                            Notification.display('Error giving badge');
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.popUpCreateBadge = function() {
            $mdDialog.show({
                templateUrl: 'modules/badge/templates/create-badge-modal.tpl.html',
                escapeToClose: true,
                clickOutsideToClose: true,
                locals: { 
                    challenge: $scope.challenge
                },
                controller: function($scope, challenge, Files, Notification) {
                    $scope.title = "Create Badge";
                    $scope.badge = {
                        image: null
                    };

                    $scope.done = function() {
                        return Badge.createBadge($scope.badge).then(function(data) {
                           updateBadges();
                           Notification.display('Badge created');
                           $mdDialog.hide();
                        }).catch(function(err) {
                            Notification.display('Error creating badge');
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.popUpModifyBadge = function(badge) {
            $mdDialog.show({
                templateUrl: 'modules/badge/templates/create-badge-modal.tpl.html',
                escapeToClose: true,
                clickOutsideToClose: true,
                locals: { 
                    challenge: $scope.challenge
                },
                controller: function($scope, challenge, Files, Notification) {
                    $scope.title = "Modify Badge";
                    $scope.badge = badge;

                    $scope.done = function() {
                        return Badge.updateBadge($scope.badge).then(function(data) {
                           updateBadges();
                           Notification.display('Badge updated');
                           $mdDialog.hide();
                        }).catch(function(err) {
                            Notification.display('Error updating badge');
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.popUpRemoveBadge = function(badge) {
            var dialog = $mdDialog.confirm({
                title: "Remove Badge",
                content: "Are you sure you want to remove this badge?",
                ok: "ok",
                cancel: "cancel"
            });

            return $mdDialog.show(dialog)
            .then(function() {
                return Badge.removeBadge(badge._id);
            }).then(function() {
                updateBadges();
                Notification.display('Badge removed');
            });
        };

        $scope.popUpCreateTemplate = function(){
            $mdDialog.show({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-template-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    challenge : $scope.challenge,
                    templates : $scope.templates
                },
                controller : function($scope,challenge,templates,Config){
                    $scope.title = "Create Template";
                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.save = function(newTemplate){
                        newTemplate.challenge = challenge._id;
                        Challenge.createTemplate(challenge._id,newTemplate).then(function(data){
                           templates.push(data);
                           Notification.display('Template created');
                        }).catch(function(err){
                            Notification.display('Error creating template');
                        }).finally(function(){
                           $mdDialog.hide();
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.popUpEditTemplate = function(template){
            $mdDialog.show({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-template-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    challenge : $scope.challenge,
                    templates : $scope.templates
                },
                controller : function($scope,challenge,templates,Config){
                    $scope.title = "Edit Template";

                    $scope.newTemplate = angular.copy(template);

                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.save = function(newTemplate){
                        newTemplate.challenge = challenge._id;
                        Challenge.updateTemplate(challenge._id,template._id, newTemplate).then(function(data){
                            var index = templates.indexOf(template);
                            templates[index] = data;
                           Notification.display('Template updated');
                        }).catch(function(err){
                            Notification.display('Error updating template');
                        }).finally(function(){
                           $mdDialog.hide();
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.removeTemplate = function(template) {
            Challenge.removeTemplate($scope.challenge._id,template._id).then(function(data){
                // Delete the template from the list
                var index = $scope.templates.indexOf(template);
                $scope.templates.splice(index, 1);
                Notification.display('Template removed');
            }).catch(function(err){
                Notification.display('Error removing template');
            });
        }

        $scope.updateChallenge=function(){
            $scope.isBasicLoading = true;
            var data = {
                title: $scope.challenge.title,
                tags: _.pluck($scope.challenge.tags, "_id"), // Just take the IDs of tags
                brief: $scope.challenge.brief,
                showProgress : $scope.challenge.showProgress,
                progress : $scope.challenge.progress
            };
            Challenge.update($scope.challenge._id,data).then(function(){
                Notification.display('Challenge updated');
            }).catch(function(err){
                Notification.display(err.message);
            }).finally(function(){
                $scope.isBasicLoading = false;
            });
        };
    });