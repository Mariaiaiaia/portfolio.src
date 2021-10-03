const browserSync = require('browser-sync');

let project_folder = "dist";
let sourse_folder = "src";

let path={
    build: {
        html: project_folder+"/",
        css: project_folder+"/css/",
        js: project_folder+"/js/",
        img: project_folder+"/images/",
        json: project_folder+"/data/"
    },
    src: {
        html: sourse_folder+"/*.html",
        css: sourse_folder+"/scss/style.scss",
        js: sourse_folder+"/js/*.js",
        img: sourse_folder+"/images/*.{jpg,png,svg,gif,ico,webp,jfif}",
        json: sourse_folder+"/data/*.json"
    },
    watch: {
        html: sourse_folder+"/**/*.html",
        css: sourse_folder+"/scss/**/*.scss",
        js: sourse_folder+"/js/**/*.js",
        img: sourse_folder+"/images/*.{jpg,png,svg,gif,ico,webp,jfif}",
        json: sourse_folder+"/data/*.json"
    },
    clean:"./"+ project_folder + "/"
}


let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    sass = require("gulp-sass")(require("sass")),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    imagemin = require("gulp-imagemin");






function brSync(params) {
    browsersync.init({
        server:{
            baseDir: "./" + project_folder + "/"
        },
        port:3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
    .pipe(
        sass({
            outputStyle: "expanded"
        }) 
    )
    .pipe(
        group_media()
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function json() {
    return src(path.src.json)
    .pipe(dest(path.build.json))
    .pipe(browsersync.stream())
}

function clean(params) {
    return del(path.clean);
}


function watchFiles(param) {
  
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.json], json);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, json));
let watch = gulp.parallel(build, watchFiles, brSync);

exports.json = json;
exports.images = images;
exports.js = js;
exports.css = css;
exports.build = build;
exports.html = html;
exports.watch = watch;
exports.default = watch;