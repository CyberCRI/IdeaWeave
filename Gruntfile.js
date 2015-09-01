module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    var deployConfig = {};
    try {
        deployConfig = grunt.file.readJSON('./deployConfig.json');
    } catch(err) {
        console.warn("*** WARNING: Cannot load deployment config ***\n");
    }
    grunt.initConfig({
        sshconfig: {
            prod: deployConfig
        },
        sshexec: {
            uptime: {
                command: "uptime",
                options: {
                    config: "prod"
                }
            },

            start: {
                command: deployConfig.path + "/server/foreverStart.sh",
                options: {
                    config: "prod"
                }
            },

            stop: {
                command: deployConfig.path + "/server/foreverStop.sh",
                options: {
                    config: "prod"
                }
            },
            clean: {
                command: "rm -r " + deployConfig.path + "/*",
                options: {
                    config: "prod"
                }
            },

            npm_install_server: {
                command: "cd " + deployConfig.path + "/server" + " && npm install",
                options: {
                    config: "prod"
                }
            }
        },
        rsync: {
            startStopScript : {
                options: {
                    host: deployConfig.username + "@" + deployConfig.host,
                    src: "server/forever*.sh",
                    exclude: [],
                    dest: deployConfig.path + "/server",
                    recursive: true,
                    syncDestIgnoreExcl: true
                }
            },
            client: {
                options: {
                    host: deployConfig.username + "@" + deployConfig.host,
                    src: "client/*",
                    exclude: ["node_modules", "app/env/config.js"],                    
                    dest: deployConfig.path + "/client",
                    recursive: true,
                    syncDestIgnoreExcl: true
                }
            },
            server: {
                options: {
                    host: deployConfig.username + "@" + deployConfig.host,
                    src: "server/*",
                    exclude: ["node_modules", "db", "public", "config/env/development.js", "config/env/production.js"],
                    dest: deployConfig.path + "/server",
                    recursive: true,
                    syncDestIgnoreExcl: true
                }
            }
        }
    })
    grunt.registerTask('deploy', [
        'rsync:startStopScript',
        'sshexec:stop',
        'rsync:server',
        'sshexec:npm_install_server',
        'rsync:client',
        'sshexec:start'
    ]);
    grunt.registerTask('clean_deploy', [
        'rsync:startStopScript',
        'sshexec:stop',
        'sshexec:clean',
        'rsync:server',
        'sshexec:npm_install_server',
        'rsync:client',
        'sshexec:start'
    ]);
};