/**
 * automatic working flow for fuqin project
 * 
 * @function 
 *      automatic compile sourse files to developing folder
 *      or building release files to dist folder
 * 
 * @author allen wong
 * 
 * @date   2017-05-15
 * 
 * @last-monify  2017-05-17
 * 
 * @logs
 * 
 */


/** require modules */
const gulp = require('gulp')
const del = require('del')
const sass = require('gulp-sass')
const babel =require('gulp-babel')
const concat = require('gulp-concat')
const htmlReplace = require('gulp-html-replace')
const htmlmin = require('gulp-htmlmin')
const cleanCss = require('gulp-clean-css')
const uglify = require('gulp-uglify')

//browser-sync and its reload
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

/**
 * development part
 */
gulp.task('del:dev', () => {
    return del([
        './dev/**/*'
    ])
})

gulp.task('img:dev', () => {
    return gulp.src('./src/image/**/*.{png,jpg,gif}')
        .pipe(gulp.dest('./dev/image'))
        .pipe(reload({ stream: true }))
})

gulp.task('sass:dev', () => {
    return setTimeout(() => {
        gulp.src('./src/style/sass/*.scss')
            .pipe(sass({ outputStyle: 'compressed' })
            .on('error', sass.logError))
            .pipe(gulp.dest('./dev/css'))
            .pipe(reload({ stream: true }))
    }, 500) 
})

gulp.task('lib:dev', () => {
    return gulp.src('./src/lib-dev/**/*')
        .pipe(gulp.dest('./dev/lib'))
        .pipe(reload({ stream: true }))
})

gulp.task('js:dev', () => {
    return gulp.src('./src/script/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-3']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dev/js'))
        .pipe(reload({ stream: true }))
})

gulp.task('index:dev', () => {
    return gulp.src('./src/html/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dev'))
        .pipe(reload({ stream: true }))
})

gulp.task('html:dev', () => {
    return gulp.src(['./src/html/*.html', '!./src/html/index.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dev/html'))
        .pipe(reload({ stream: true }))
})

gulp.task('dev', ['img:dev',
        'lib:dev',
        'sass:dev',
        'js:dev',
        'index:dev',
        'html:dev',
        ], () => {
    browserSync.init({
        server: {
            baseDir: './dev'
        },
        notify: false
    })
    gulp.watch('./src/img/**/*.*', ['img:dev'])
    gulp.watch('./src/lib-dev/**/*.*', ['lib:dev'])
    gulp.watch('./src/style/sass/**/*.scss', ['sass:dev'])
    gulp.watch('./src/script/*.js', ['js:dev'])
    gulp.watch('./src/html/*.html', ['index:dev', 'html:dev'])
})
/** --- development end --- */

/**
 * build release files
 */
gulp.task('del', () => {
    return del([
        './dist/**/*'
    ])
})

gulp.task('img', () => {
    return gulp.src('./src/image/**/*')
        .pipe(gulp.dest('./dist/image'))
})

gulp.task('bundle', () => {
    return gulp.src('./src/lib/**/*.js')
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/lib'))
})

gulp.task('js', () => {
    return gulp.src('./src/script/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-3']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
})

gulp.task('libcss', () => {
    return gulp.src('./src/lib/**/*.css')
        .pipe(concat('lib.min.css'))
        .pipe(cleanCss({
            advanced: false,
            keepSpecialComments: '*'
        }))
        .pipe(gulp.dest('./dist/lib'))
})

gulp.task('sass', () => {
    return setTimeout(() => {
        gulp.src('./src/style/sass/*.scss')
            .pipe(sass({ outputStyle: 'compressed' })
                .on('error', sass.logError))
            .pipe(gulp.dest('./dist/css'))
    }, 500)
})

gulp.task('index', () => {
    return gulp.src('./src/html/index.html')
        .pipe(htmlReplace({
            js: 'lib/lib.min.js',
            css: 'lib/lib.min.css',
            cordova: {
                src: 'cordova.js',
                tpl: '<script src="%s"></script>'
            }
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist'))
})

gulp.task('html', () => {
    return gulp.src(['./src/html/*.html', '!./src/html/index.html'])
        .pipe(htmlReplace({
            js: '../lib/lib.min.js',
            css: '../lib/lib.min.css',
            cordova: {
                src: '../cordova.js',
                tpl: '<script src="%s"></script>'
            }
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist/html'))
})

gulp.task('build', ['img', 'bundle', 'js', 'libcss', 'sass', 'index', 'html'])

/** --- release end --- */


/* --- copy to cordova www --- */
gulp.task('copy', ['del:dist'], () => {
    return gulp.src('./dist/**/*')
        .pipe(gulp.dest('../webapp/www'))
})

gulp.task('del:dist', () => {
    return del([
        '../webapp/www/**/*'
    ])
})
/* --- end copy --- */
