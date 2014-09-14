angular.module('cri.d3',[])
    .factory('d3Service', ['$document', '$q', '$rootScope',
        function($document, $q, $rootScope) {
            var d = $q.defer();
            function onScriptLoad() {
                // Load client in the browser
                $rootScope.$apply(function() { d.resolve(window.d3); });
            }

            function loadCloudLib() {
                var scriptTag2 = $document[0].createElement('script');
                scriptTag2.type = 'text/javascript';
                scriptTag2.async = true;
                scriptTag2.src = 'https://rawgithub.com/jasondavies/d3-cloud/master/d3.layout.cloud.js';
                scriptTag2.onreadystatechange = function () {
                    if (this.readyState == 'complete') onScriptLoad();
                }
                scriptTag2.onload = onScriptLoad;

                var s = $document[0].getElementsByTagName('body')[0];
                s.appendChild(scriptTag2);

            }

            // Create a script tag with d3 as the source
            // and call our onScriptLoad callback when it
            // has been loaded
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'http://d3js.org/d3.v3.min.js';
            scriptTag.onreadystatechange = function () {
                if (this.readyState == 'complete') loadCloudLib();
            }
            scriptTag.onload = loadCloudLib;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);


            return {
                d3: function() { return d.promise; }
            };
        }]);