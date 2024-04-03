import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import del from 'del';
import cheerio from 'gulp-cheerio';

// const gulp = require("gulp");
// const plumber = require("gulp-plumber");
// const sourcemap = require("gulp-sourcemaps");
// const sass = require("gulp-dart-sass");
// const postcss = require("gulp-postcss");
// const autoprefixer = require("autoprefixer");
// const browser = require("browser-sync").create();
// const htmlmin = require("gulp-htmlmin");
// const csso = require("postcss-csso");
// const rename = require("gulp-rename");
// const terser = require("gulp-terser");
// const imagemin = require("gulp-imagemin");
// const webp = require("gulp-webp");
// const svgstore = require("gulp-svgstore");
// const del = require("del");



// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//html

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

//scripts

export const script = () => {
  return gulp.src('source/js/app.js')
  .pipe(terser())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('build/js'));
}

//images

export const optimazeImages = () => {
  return gulp.src('source/img/**/*.{jpg,svg,png}')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'));
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,svg,png}')
  .pipe(gulp.dest('build/img'));
}

// wedp

export const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('build/img'));
}

//sprite

export const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
}

// copy

export const copy = (done) => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.svg",
    "!source/img/icons/*.svg"
  ], {base: "source"})
  .pipe(gulp.dest("build"))
  done();
}

// clean

export const clean = () => {
  return del("build");
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source.js/app.js', gulp.series(script));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimazeImages,
  gulp.parallel(
    styles,
    html,
    script,
    sprite,
    createWebp
  )
)


export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    script,
    sprite,
    createWebp,
  ),
  gulp.series(
    server,
    watcher
  )
);
