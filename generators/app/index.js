var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
    this.option('jade');

    this.includeJade = this.options.jade;
  },

  writing: {
    gulpfile: function() {
      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js'), {
          includeJade: this.includeJade
        }
      );
    },
    packageJSON: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          includeJade: this.includeJade
        }
      );
    },
    git: function() {
      this.fs.copy(
        this.templatePath('.gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    babel: function() {
      this.fs.copy(
        this.templatePath('.babelrc'),
        this.destinationPath('.babelrc')
      );
    },

    styles: function() {
      this.fs.copy(
        this.templatePath('main.css'),
        this.destinationPath('src/styles/main.css')
      );
    },
    scripts: function() {
      this.fs.copy(
        this.templatePath('main.js'),
        this.destinationPath('src/scripts/main.js')
      );
    },
    html: function() {
      var ext = this.includeJade ? 'jade' : 'html';
      this.fs.copyTpl(
        this.templatePath('index.' + ext),
        this.destinationPath('src/index.' + ext), {
          title: this.appname
        }
      );
    }
  },

  install: function() {
    var devDependencies = [
      'babel-core',
      'babelify',
      'browser-sync',
      'browserify',
      'gulp',
      'gh-pages',
      'gulp-sass',
      'gulp-less',
      'gulp-util',
      'babel-preset-es2015',
      'vinyl-source-stream'
    ];

    if (this.includeJade)
      devDependencies.push('gulp-jade');

    this.npmInstall(
      devDependencies, {
        'saveDev': true
      }
    );

    this.npmInstall(['normalize.css', 'jquery' , 'underscore', 'backbone'], { 'save': true });
  },

  end: function() {
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('hub', ['create']);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '-m', '"Init"']);
  }
});
