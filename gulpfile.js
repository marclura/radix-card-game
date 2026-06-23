const gulp = require('gulp')
const stylus = require('gulp-stylus')
const sourcemaps = require('gulp-sourcemaps')

function css() {
    return gulp.src('src/stylus/main.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'))
}

function watch() {
    gulp.watch('src/stylus/**/*.styl', css)
}

exports.default = gulp.series(css, watch)

// run it with 'npx gulp'