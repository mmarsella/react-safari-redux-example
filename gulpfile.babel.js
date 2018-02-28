import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import rimraf from 'rimraf';

const plugins = loadPlugins();

import popupWebpackConfig from './front/src/popup/webpack.config';
import backWebpackConfig from './back/webpack.config';
import frontWebpackConfig from './front/webpack.config';


gulp.task('popup-js', ['clean'], (cb) => {
  webpack(popupWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});
/*
*/


gulp.task('back-js', ['clean'], (cb) => {
  webpack(backWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('front-js', ['clean'], (cb) => {
  webpack(frontWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});



gulp.task('popup-html', ['clean'], () => {
  return gulp.src('front/src/popup/src/index.html')
    .pipe(plugins.rename('popup.html'))
    .pipe(gulp.dest('./build.safariextension/'))
});
/*
*/

gulp.task('background-html', ['clean'], () => {
  return gulp.src('back/src/background.html')
    .pipe(gulp.dest('./build.safariextension/'))
});

gulp.task('imgs', ['clean'], () => {
  return gulp.src('imgs/*')
    .pipe(gulp.dest('./build.safariextension/'))
});

gulp.task('pList', ['clean'], () => {
  return gulp.src('./Info.plist')
    .pipe(gulp.dest('./build.safariextension/'))
});

/*
gulp.task('copy-manifest', ['clean'], () => {
  return gulp.src('manifest.json')
    .pipe(gulp.dest('./build.safariextension'));
});
*/

gulp.task('clean', (cb) => {
  rimraf('./build.safariextension', cb);
});


// , 'popup-js', 'popup-html',
//  'copy-manifest'
gulp.task('build', ['back-js', 'front-js', 'background-html', 'imgs', 'pList', 'popup-js', 'popup-html']);

gulp.task('watch', ['default'], () => {
  gulp.watch('popup/**/*', ['build']);
  gulp.watch('front/**/*', ['build']);
  gulp.watch('back/**/*', ['build']);
});

gulp.task('default', ['build']);
