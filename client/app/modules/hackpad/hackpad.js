angular.module('cri.hackpad',[])

.directive('hackpad',function($window,$sce,$document,$http,$templateCache,Config,NoteLab,$rootScope){
        return {
            restrict : 'EA',
            scope : {
                curentUser : '=',
                padId : '='
            },
            templateUrl : 'modules/hackpad/templates/hackpad.tpl.html',

            link : function(scope,element){
//                console.log(NoteLab.data)
//                $http.get(Config.apiServer+'/hackpad/embed/'+NoteLab.data.hackPadId,{
//                    params : {
//                        email : $rootScope.currentUser.email,
//                        name :$rootScope.currentUser.username
//                    }
//                }).success(function(lol){
////                    scope.url = '/';
//                    scope.data = "data:text/html;charset=utf-8,"+lol;
//
////                    element.find('iframe').attr('src',"data:text/html;charset=utf-8," +lol);
////                    $templateCache.put('test.html', lol);
//                    scope.display = true;
//                }).error(function(err){
//                    console.log(err)
//                });

                $http.get(Config.apiServer+'/hackpad/auth').success(function(data) {
                    var a = document.createElement('a');

                    scope.url = $sce.trustAsResourceUrl("https://ideaweave.hackpad.com/ep/api/embed-pad?padId="+scope.padId);
//                        +'&email='+$rootScope.currentUser.email+'&name='+$rootScope.currentUser.username+'&oauth_signature='+oauthSign);
                    a.href = scope.url;
                    var origin = a.protocol + '//' + a.host;
                    scope.frameId = "hackpad-" + scope.padId;
                    $window.addEventListener("message", function(event) {
                        if (event.origin == origin) {
                            var args = event.data.split(":");

                            // 3rd party cookies workaround
                            if (args[0] == "hackpad" && args[1] == "getcookie") {
                                // go to hackpad.com to establish a cookie, then come back here
                                var contURL = decodeURIComponent(args[2]);
                                $document.location = contURL + "&contUrl=" + encodeURIComponent($document.location);
                            }
                            // height adjustment
                            if (args.length == 3 && args[0] ==  scope.frameId && args[1] == "height") {
                                var height = Number(args[2]) + 60; // 60 is non-ace elements offset
                                var hp = element[0].parentElement;
                                if (hp && height > 550) {
                                    hp.style.height = height + "px";
                                }
                            }
                        }
                    }, false);
                }).error(function(err){
                    console.log('error',err);
                });
            }
        };
    });