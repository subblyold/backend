/*!
 * Subbly's Gruntfile
 * http://subbly.com
 */

module.exports = function(grunt) 
{
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json')
      , banner: '/*! \n' +
' * Subbly  \n' +
' *\n' +
' * @package   Subbly Back-office\n' +
' * @version   v<%= pkg.version %>\n' +
' * @link      <%= pkg.homepage %>\n' +
' */\n'
      , less: 
        {
            development: 
            {
                options: 
                {
                    strictMath: true
                  , sourceMap: true
                  , outputSourceFiles: true
                  , sourceMapURL: '<%= pkg.filename %>.local.css.map'
                  , sourceMapFilename: '<%= pkg.dist %>css/<%= pkg.filename %>.local.css.map'
                }
              , files: {
                  '<%= pkg.dist %>css/<%= pkg.filename %>.local.css': 'assets/less/subbly.less'
                }
            }
          , staging: 
            {
                options: 
                {
                    strictMath: true
                  , sourceMap: true
                  , outputSourceFiles: true
                  , sourceMapURL: '<%= pkg.filename %>.staging.css.map'
                  , sourceMapFilename: '<%= pkg.dist %>css/<%= pkg.filename %>.staging.css.map'
                  , compress: true
                }
              , files: {
                  '<%= pkg.dist %>css/<%= pkg.filename %>.staging.css': 'assets/less/subbly.less'
                }
            }
        }
      , autoprefixer: 
        {
            options: 
            {
              browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
            }
          , core: 
            {
                options: 
                {
                    map:     true
                  , compile: true
                }
              , files: 
                {
                    '<%= pkg.dist %>css/<%= pkg.filename %>.local.css': [
                        'assets/less/subbly.less'
                    ]
                }
              , src: '<%= pkg.dist %>css/<%= pkg.filename %>.local.css'
            }
        }
      , csslint: 
        {
            options: 
            {
              csslintrc: 'assets/less/.csslintrc'
            }
          , src: [ '<%= pkg.dist %>css/<%= pkg.filename %>.local.css' ]
        }
      , cssmin: 
        {
            options: 
            {
                compatibility: 'ie8'
              , keepSpecialComments: '*'
            }
          , core: 
            {
                files: 
                {
                  '<%= pkg.dist %>css/<%= pkg.filename %>.production.css': '<%= pkg.dist %>css/<%= pkg.filename %>.local.css'
                }
            }
        }
      , usebanner: 
        {
            options: 
            {
                position: 'top'
              , banner: '<%= banner %>'
            }
          , files: 
            {
                src: '<%= pkg.dist %>css/*.css'
            }
        }
      , csscomb: 
        {
            options: {
              config: 'less/.csscomb.json'
            }
          , dist: 
            {
                expand: true
              , cwd: '<%= pkg.dist %>css/'
              , src: ['*.css', '!*.min.css']
              , dest: '<%= pkg.dist %>css/'
            }
        }
      , concat_sourcemap: 
        {
            options: 
            {
                banner: '<%= banner %>'
              , stripBanners: false
              , sourcesContent: true
            }
          , js: 
            {
                src: [
                  // Dependencies
                    'assets/lib/jquery/jquery-2.1.1.js'
                  // , 'assets/lib/jquery/jquery.ui.widget.js'
                  , 'assets/lib/jquery/jquery.nanoscroller.js'
                  // , 'assets/lib/jquery/jquery.fileupload.js'
                  , 'assets/lib/underscore/underscore.js'
                  , 'assets/lib/backbone/backbone.js'
                  , 'assets/lib/backbone/backbone.controller.js'
                  , 'assets/lib/backbone/backbone-approuter.js'
                  , 'assets/lib/backbone/backbone-appready.js'
                  , 'assets/lib/backbone/backbone.basicauth.js'
                  , 'assets/lib/handlebars/handlebars-v2.0.0.js'
                  , 'assets/lib/handlebars/handlebars-intl.js'
                  , 'assets/lib/handlebars/locale/en.js'
                  , 'assets/lib/handlebars/locale/fr.js'
                  // , 'assets/lib/bootstrap/dropdown.js'
                  , 'assets/lib/bootstrap/button.js'
                  // , 'assets/lib/bootstrap/modal.js'
                  , 'assets/lib/moment/moment.js'
                  // , 'assets/lib/download/download.js'

                  // App
                  , 'assets/js/closure.intro.js'
                  , 'assets/js/helpers/scroll2sicky.js'
                  , 'assets/js/helpers/helpers.js'
                  , 'assets/js/helpers/handlebars.js'
                  , 'assets/js/helpers/validation.js'
                  , 'assets/js/helpers/xhr.js'
                  , 'assets/js/helpers/feedback.js'
                  // , 'assets/js/helpers/delete.js'
                  // , 'assets/js/helpers/uploader.js'
                  // , 'assets/js/helpers/session.js'
                  // , 'assets/js/helpers/feedback.js'

                  , 'assets/js/model.js'
                  , 'assets/js/collection.js'
                  , 'assets/js/view.js'
                  , 'assets/js/controller.js'
                  , 'assets/js/subbly.js'

                  , 'assets/js/models/*.js'
                  , 'assets/js/collections/*.js'
                  , 'assets/js/controllers/*.js'
                  , 'assets/js/views/*.js'

                  , 'assets/js/builtin/*.js'

                  , 'assets/js/router.js'
                  , 'assets/js/closure.utils.js'
                  , 'assets/js/closure.outro.js'
                ]
              , dest: '<%= pkg.dist %>js/<%= pkg.filename %>.local.js'
            }
        }
      , uglify: 
        {
          staging:
          {
              options: 
              {
                  banner: '<%= banner %>'
                , sourceMap: true
                , sourceMapName: '<%= pkg.dist %>js/<%= pkg.filename %>.staging.js.map'
              }
            , files: 
              {
                  '<%= pkg.dist %>js/<%= pkg.filename %>.staging.js': '<%= pkg.dist %>js/<%= pkg.filename %>.local.js'
              }            
          }
        , production:
          {
              options: 
              {
                  banner: '<%= banner %>'
                , sourceMap: false
              }
            , files: 
              {
                  '<%= pkg.dist %>js/<%= pkg.filename %>.production.js': '<%= pkg.dist %>js/<%= pkg.filename %>.local.js'
              }            
          }
        }
      , notify_hooks: 
        {
          options: 
          {
              enabled: true
            , max_jshint_notifications: 5 // maximum number of notifications from jshint output
            , title: '<%= pkg.name %>' // defaults to the name in package.json, or will use project directory's name
            , success: true // whether successful grunt executions should be notified automatically
            , duration: 3 // the duration of notification in seconds, for `notify-send only
          }
        }
      , watch: 
        {
            javascript: 
            {
              files: ['assets/js/*.js', 'assets/js/*/*.js', 'themes/plugins/*.js'] //, 'assets/js/*/*.js'
            , tasks: ['concat_sourcemap']
            , options: 
              {
                  debounceDelay: 250
              }
            }
          , css: 
            {
              files: ['assets/less/*.less']
            , tasks: ['less-compile']
            , options: 
              {
                  debounceDelay: 250
              }
            }
          , grunt: 
            {
              files: ['Gruntfile.js']
            }
        }
    });

    // grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.task.run('notify_hooks');

    grunt.registerTask('less-compile', ['less:development']);

    grunt.registerTask('default', [
        'concat_sourcemap'
      , 'less-compile'
    ]);
    grunt.registerTask('build', [
        'concat_sourcemap'
      , 'uglify'
      , 'less'
      , 'cssmin'
    ]);
    grunt.registerTask('dev', [
        'watch'
    ]);

};