module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({
        inline_angular_templates: {
            dist: {
                options: {
                    base: 'app',
                    unescape: {
                        '&lt;': '<',
                        '&gt;': '>',
                        '&apos;': '\'',
                        '&amp;': '&'
                    }
                },
                files: {
                    'dist/index.html': ['app/modules/**/*.tpl.html']
                }
            }
        }
    });
};

