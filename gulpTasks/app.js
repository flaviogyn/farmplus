const gulp = require('gulp');
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const uglifycss = require("gulp-uglifycss");
const concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");

//executa todas essas outras quando chama a app
gulp.task("app", ["app.html", "app.css", "app.js", "app.assets"]);

gulp.task('app.html', () => {
    return gulp.src('app/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: false })) //true retira os espaços
      .pipe(gulp.dest('public'))
})

gulp.task("app.css",  () => {
    return gulp.src('app/**/*.css')
        .pipe(uglifycss({ "uglyComments": true }))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('public/assets/css'))
})

gulp.task("app.js",  () => {
    return gulp.src('app/**/*.js')
        .pipe(babel({ presets: ['env'] }))
        //.pipe(uglify())
        .pipe(concat('app.min.js'))
        //.pipe('app.min.js')
        .pipe(gulp.dest('public/assets/js'))
})

gulp.task("app.assets",  () => {
    return gulp.src('assets/**/*.*')
        .pipe(gulp.dest('public/assets'))
})