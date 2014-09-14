angular.module('cri.common',[])
    .provider('Config',function($windowProvider){
        var config = {
            tinymceOptions : {
                height : '500px',
                resize :false,
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime template media table contextmenu paste textcolor "
                ],
                toolbar: "template styleselect fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image | forecolor backcolor fullscreen",
                image_advtab: true
            },
            paginateChallenge : 10,
            paginateProject : 10,
            activityLimit : 40,
            tinyMceOptions : {
                popUp :{

                },
                web : {

                }
            }
        };
        var $window = $windowProvider.$get();
        console.log($window.location.host)
        if($window.location.host == 'localhost:5000'){
            config.env = 'dev';
            config.apiServer = 'http://localhost:5011';
            config.githubClient = 'a7b3f0d3bbda1a42f26e',
            config.googleClient = '372552657598-hdg4o1pqc15amejp9jlr2qs016k0m6ve.apps.googleusercontent.com'

        }else{
            config.env = 'prod';
            config.apiServer = 'http://ideastorm.io:5011'
            config.githubClient = '';
            config.githubClient = '';
            config.githubClient = 'a0de9026823b0f3c405e';
            config.googleClient = '372552657598-hdg4o1pqc15amejp9jlr2qs016k0m6ve.apps.googleusercontent.com';
        }
        this.$get = function(){
            return config;
        }

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

