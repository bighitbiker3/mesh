var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var notifier = require('node-notifier');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }
  console.log(title, message)
  notifier.notify({title: title, message: message});
};

var bundler = watchify(browserify({
  entries: ['./src/router.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

function bundle() {
  return bundler
    .bundle()
    .on('error', notify)
    .pipe(source('public/javascripts/main.js'))
    .pipe(gulp.dest('./'))
    .pipe(livereload())
}
bundler.on('update', bundle);

gulp.task('build', function() {
  bundle()
});

gulp.task('reload', function () {
    livereload.reload();
});

gulp.task('sass', function () {
  gulp.src('./public/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('./public/stylesheets/style.css'))
    .pipe(gulp.dest('./'))
    .pipe(livereload());
});

gulp.task('default', ['build', 'sass', 'watch', 'reload', 'listen']);

gulp.task('listen', function(){
  livereload.listen()
})

gulp.task('watch', function () {
  gulp.watch('./public/sass/*.scss', ['sass']);
});
