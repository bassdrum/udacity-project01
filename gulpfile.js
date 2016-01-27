var gulp          = require('gulp'),
    less          = require('gulp-less'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssnano       = require('gulp-cssnano'),
    sourcemaps    = require('gulp-sourcemaps'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    browserSync   = require('browser-sync').create()
    reload        = browserSync.reload,
    eslint        = require('gulp-eslint'),
    useref        = require('gulp-useref');
    

gulp.task('styles', function(){
  gulp.src('./less/master.less')
    .pipe(less().on('error', function (err) {
      console.log(err);
    }))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    /*
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('maps'))
    */
    .pipe(gulp.dest('./dist/css/'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', function(){
  gulp.src('./js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(reload({stream: true}));
});

gulp.task('copy-html', function(){
  gulp.src('./index.html')
    .pipe(useref())
    .pipe(gulp.dest('./dist'))
    .pipe(reload({stream: true}));
});

gulp.task('lint', function () {
  return gulp.src(['./js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['styles', 'lint', 'scripts', 'copy-html'], function(){
  browserSync.init({
    server: './dist/'
  });
  
  gulp.watch('./less/**/*.less', ['styles']);
	gulp.watch('./js/**/*.js', ['lint', 'scripts']);
	gulp.watch('./index.html', ['copy-html']);
});
