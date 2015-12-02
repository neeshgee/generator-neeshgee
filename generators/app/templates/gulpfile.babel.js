import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import browserSync from 'browser-sync';
import less from 'gulp-less';
import ghPages from 'gh-pages';
import gutil from 'gulp-util';
import path from 'path';

const sync = browserSync.create();

gulp.task('html', () => {
    gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({
      stream: true
    }));
     gulp.src('src/CNAME').pipe(gulp.dest('dist'))
});

gulp.task('script', () => {
  browserify({
      entries: ['./src/scripts/main.jsx'],
      extensions: ['.js', '.jsx'],
      debug: true
    }).transform(babelify.configure({
      optional: ['es7.classProperties']
    })).bundle()
    .on('error', (error) => {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      gutil.beep();
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({
      stream: true
    }));
});

gulp.task('styles', () => {
  gulp.src('src/styles/**/*.{css,less}')
    .pipe(less()
      .on('error', (error) => {
        gutil.log(gutil.colors.red('Error: ' + error.message));
        gutil.beep();
      }))
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({
      stream: true
    }));
});

 gulp.task('images', () => {
  gulp.src('src/styles/images/*')
   .pipe(gulp.dest('dist/images'));
});

gulp.task('build', ['html', 'script', 'styles', 'images']);

gulp.task("deploy", ["build"], function(cb) {
  ghPages.publish(path.join(process.cwd(), "dist"), cb);
});

gulp.task('serve', ['build'], () => {
  sync.init({
    server: 'dist',
  });

  gulp.watch('src/**/*.{html,jade}', ['html']);
  gulp.watch('src/**/*.{css,less}', ['styles']);
  gulp.watch('src/**/*.{js,jsx}', ['script'])
  gulp.watch('src/styles/images/**/*', ['images']);
});

gulp.task('default', ['serve']);
