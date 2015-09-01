'use strict';

module.exports = {
	db: 'mongodb://localhost/ideaweave',
    clientBaseUrl : 'http://localhost:5000',
    TOKEN_SECRET: 'my-secret',
    GOOGLE_SECRET: '',
    etherpad: {
        host: "localhost",
        rootPath: "/etherpad/api/1.2.9/",
        port: 9090,
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