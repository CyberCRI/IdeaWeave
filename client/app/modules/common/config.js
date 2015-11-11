angular.module('cri.common',[])
    .provider('Config', function() {
        var config = {
            tinymceOptions : {
                height : '500px',
                resize :false,
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime template media table contextmenu paste textcolor"
                ],
                toolbar: "template media styleselect fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image | forecolor backcolor fullscreen",
                image_advtab: true,
                extended_valid_elements:"iframe[src|title|width|height|allowfullscreen|frameborder|class|id],object[classid|width|height|codebase|*],param[name|value|_value|*],embed[type|width|height|src|*]"
            },
            paginateChallenge : 100,
            paginateProject : 100,
            paginateIdea : 100,
            activityLimit : 40
        };

        // Copy in options from config file
        _.extend(config, PrivateConfig);

        this.$get = function(){
            return config;
        };

    })
    .directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });

