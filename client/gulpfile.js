
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    copy = require('gulp-copy'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    anotate = require('gulp-ng-annotate'),
    sass = require('gulp-sass'),
    path = require('path'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    rev = require('gulp-rev'),
    inlineAngularTemplates = require('gulp-inline-angular-templates'),
    merge = require('merge-stream'),
    livereloadport = 35729,
    serverport = 5000;

require('gulp-grunt')(gulp);


// Dev tasks

gulp.task('lint', function() {
    gulp.src(['./app/modules/**/*.js'])
        .pipe(refresh(lrserver))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function () {
    gulp.src('./app/styles/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/styles'))
        .pipe(refresh(lrserver));
});

gulp.task('html', function () {
    gulp.src('./app/**/*.html')
        .pipe(refresh(lrserver));
});


gulp.task('watch', function() {
    gulp.watch([ './app/**/**/*.scss','./app/styles/main.scss'],[
          'sass'
    ]);
    gulp.watch('./app/**/*.js',[
        'lint'
    ]);
    gulp.watch('./app/**/*.html',[
        'html'
    ]);
});

//express server
var server = express();
server.use(livereload({port: livereloadport}));
server.use(express.static('./app'));
server.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'app' });
});

gulp.task('dev', function() {
    server.listen(serverport);
    lrserver.listen(livereloadport);
    gulp.run('sass');
    gulp.run('watch');
});

gulp.task('serveprod',function(){
    var server = express();
    server.use(livereload({port: livereloadport}));
    server.use(express.static('./dist'));
    server.all('/*', function(req, res) {
        res.sendFile('index.html', { root: 'dist' });
    });
    server.listen(serverport);
    lrserver.listen(livereloadport);
});

//build tasks

gulp.task('template',function(){
    gulp.src('dist/index.html')
        .pipe(inlineAngularTemplates({
            base: 'app/modules/**/*.html'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('temp',function(){
    gulp.run('grunt-inline_angular_templates')
});

gulp.task('build', function() {
    // Wait on the combination of all these tasks
    return merge(
        gulp.src('./app/index.html')
            .pipe(usemin({
                css: [minifyCss()],
                html: [minifyHtml({empty: true})],
                js: [anotate(),uglify(),rev()]
            }))
            .pipe(gulp.dest('./dist')),
        gulp.src('./app/images/**')
            .pipe(copy('./dist/images/',{prefix : 2})),
        gulp.src('./app/vendors/tinymce/**')
            .pipe(copy('./dist/vendors/tinymce/',{prefix : 3})),
        gulp.src('./app/vendors/Font-Awesome/fonts/**')
            .pipe(copy('./dist/',{prefix : 3}))
    );
});
