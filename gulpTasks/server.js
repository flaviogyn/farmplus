const gulp = require('gulp');
const watch = require('gulp-watch');
const webserver = require('gulp-webserver');

//monitoramento dos arquivos para regerar os aquivos abaixo
gulp.task("watch",  () => {
    //qualquer arquivo
    watch('app/**/*.html', () => gulp.start('app.html'))
    watch('app/**/*.css', () => gulp.start('app.css'))
    watch('app/**/*.js', () => gulp.start('app.js'))
    watch('assets/**/**', () => gulp.start('app.assets'))
})

gulp.task("server", ["watch"], () => {
    return gulp.src('public').pipe(webserver({
        livereload: true,
        port: 21102,
        open: true
    }))
});
