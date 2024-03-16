import gulp from 'gulp';
import plumber from 'gulp-plumber';
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


// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  styles, html, server, watcher
);
