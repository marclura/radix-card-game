const gulp = require('gulp')
const stylus = require('gulp-stylus')

function css() {
    return gulp.src('src/stylus/main.styl')
        .pipe(stylus())
        .pipe(gulp.dest('src/css'))
}

function watch() {
    gulp.watch('src/stylus/**/*.styl', css)
}

exports.default = gulp.series(css, watch)

// run it with 'npx gulp'