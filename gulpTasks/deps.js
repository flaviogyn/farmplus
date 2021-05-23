const gulp = require("gulp");
const uglify = require("gulp-uglify");
const uglifycss = require("gulp-uglifycss");
const concat = require("gulp-concat");

gulp.task("deps", ["deps.js", "deps.css", "deps.fonts"]);

//dependencias do projeto
gulp.task("deps.js", () => {
    //return para sequenciar run-sequence
    return gulp.src([
        'node_modules/angular/angular.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-sanitize/angular-sanitize.min.js',
        'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/angular-input-masks/releases/angular-input-masks-standalone.min.js',
        'node_modules/angular-locale-pt-br/angular-locale_pt-br.js',
        'node_modules/admin-lte/bower_components/jquery/dist/jquery.min.js',
        'node_modules/admin-lte/bower_components/jquery-ui/jquery-ui.min.js',
        'node_modules/admin-lte/bower_components/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/admin-lte/bower_components/jquery-slimscroll/jquery.slimscroll.min.js',
        'node_modules/admin-lte/dist/js/adminlte.min.js',
        'node_modules/ui-select/dist/select.min.js',
        //'node_modules/xlsx/dist/xlsx.full.min.js',
        //'node_modules/blobjs/Blob.js',
        //'node_modules/file-saverjs/FileSaver.js',
        //'node_modules/tableexport/dist/js/tableexport.js'
    ])
        .pipe(uglify())
        .pipe(concat('deps.min.js'))
        .pipe(gulp.dest('public/assets/js'))
})

//css do projeto
gulp.task("deps.css", () => {
    return gulp.src([
        'node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css',
        'node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css',
        'node_modules/admin-lte/dist/css/AdminLTE.min.css',
        'node_modules/admin-lte/dist/css/skins/_all-skins.min.css',
        'node_modules/angular-toastr/dist/angular-toastr.min.css',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
        'node_modules/ui-select/dist/select.min.css',
        // 'node_modules/tableexport/dist/css/tableexport.css',
        //'node_modules/material-dashboard/assets/css/.min.css?v=2.1.0'
    ])
        .pipe(uglifycss({ "unglyComments": true }))
        .pipe(concat('deps.min.css'))
        .pipe(gulp.dest('public/assets/css'))
});

gulp.task("deps.fonts", () => {
    return gulp.src([
        'node_modules/font-awesome/fonts/*.*',
        'node_modules/admin-lte/bower_components/bootstrap/fonts/*.*'
    ])
        .pipe(gulp.dest('public/assets/fonts'))
})