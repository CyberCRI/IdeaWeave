'use strict';

module.exports = {
	app: {
		title: 'IdeaWeave public api',
		description: 'Open webservice for research project',
		keywords: 'collaborative, projects, idea, cri, university, research, symbio4all'
	},
	port: process.env.PORT || 5011,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'rI11qh8DV1DnmE-2jjljDbri',
    TWITTER_KEY: process.env.TWITTER_KEY || 'Twitter Consumer Key',
    TWITTER_SECRET : process.env.TWITTER_SECRET || 'a9c4e876e84a60db81e2bceb449fc7b848e7b756',
    TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'localhost:5000/home'
};