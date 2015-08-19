'use strict';

module.exports = {
    db: 'mongodb://localhost/ideaweave',
    crossOrigin : 'http://ideastorm.io',
    TOKEN_SECRET: 'mysecret',
    GOOGLE_SECRET: '',
    etherpad: {
        host: "ideaweave.io",
        port: 80,
        rootPath: "/etherpad/api/1.2.9/",
        apiKey: "xxx"
    }},
    email: {
        from: "IdeaWeave Robot <ideaweave-noreply@ideaweave.io>",
        transport: {
            service: "",
            auth: {
            }
        }
    };