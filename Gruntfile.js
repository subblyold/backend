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
                  '<%= pkg.dist %>css/<%= pkg.filename %>.local.css': 'public/less/subbly.less'
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
                  '<%= pkg.dist %>css/<%= pkg.filename %>.staging.css': 'public/less/subbly.less'
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
                        'public/less/subbly.less'
                    ]
                }
              , src: '<%= pkg.dist %>css/<%= pkg.filename %>.local.css'
            }
        }
      , csslint: 
        {
            options: 
            {
              csslintrc: 'public/less/.csslintrc'
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
                    'public/lib/jquery/jquery-2.1.1.js'
                  , 'public/lib/jquery/jquery.ui.core.js'
                  , 'public/lib/jquery/jquery.ui.widget.js'
                  , 'public/lib/jquery/jquery.ui.mouse.js'
                  , 'public/lib/jquery/jquery.ui.draggable.js'
                  , 'public/lib/jquery/jquery.ui.droppable.js'
                  , 'public/lib/jquery/jquery.ui.sortable.js'
                  , 'public/lib/jquery/jquery.nanoscroller.js'
                  , 'public/lib/jquery/jquery.slugify.js'
                  // , 'public/lib/jquery/jquery.sortable.js'
                  , 'public/lib/jquery/jquery.fileupload.js'
                  , 'public/lib/underscore/underscore.js'
                  , 'public/lib/underscore/underscore.string.js'
                  , 'public/lib/backbone/backbone.js'
                  , 'public/lib/backbone/backbone.controller.js'
                  , 'public/lib/backbone/backbone-approuter.js'
                  , 'public/lib/backbone/backbone-appready.js'
                  , 'public/lib/backbone/backbone.basicauth.js'
                  , 'public/lib/handlebars/handlebars-v2.0.0.js'
                  // , 'public/lib/bootstrap/dropdown.js'
                  , 'public/lib/bootstrap/button.js'
                  , 'public/lib/bootstrap/modal.js'
                  , 'public/lib/moment/moment.js'
                  // , 'public/lib/download/download.js'

                  // App
                  , 'public/js/closure.intro.js'
                  , 'public/js/helpers/scroll2sicky.js'
                  , 'public/js/helpers/helpers.js'
                  , 'public/js/helpers/i18n.js'
                  , 'public/js/helpers/handlebars.js'
                  , 'public/js/helpers/validation.js'
                  , 'public/js/helpers/xhr.js'
                  , 'public/js/helpers/uploader.js'
                  , 'public/js/helpers/feedback.js'
                  , 'public/js/helpers/sortable.js'
                  // , 'public/js/helpers/delete.js'
                  // , 'public/js/helpers/session.js'
                  // , 'public/js/helpers/feedback.js'

                  , 'public/js/model.js'
                  , 'public/js/collection.js'
                  , 'public/js/view.js'
                  , 'public/js/controller.js'
                  , 'public/js/subbly.js'

                  , 'public/js/models/*.js'
                  , 'public/js/collections/*.js'
                  , 'public/js/controllers/*.js'
                  , 'public/js/views/*.js'

                  , 'public/js/builtin/*.js'

                  , 'public/js/router.js'
                  , 'public/js/closure.utils.js'
                  , 'public/js/closure.error.js'
                  , 'public/js/closure.outro.js'
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
      , exec: 
        {
            devCss: 
            {
                cmd: function() 
                {
                    return 'cp public/assets/css/* ../../../themes/backend/assets/css'
                }
            }
          , devJs: 
            {
                cmd: function() 
                {
                    return 'cp public/assets/js/* ../../../themes/backend/assets/js'
                }
            }
          , docco: 
            {
                cmd: function() 
                {
                    return 'docco assets/js/subbly.js '
                }
            }
        }
      , docco: 
        {
            dist: 
            {
                src: ['assets/js/subbly.js']
              , options: 
                {
                  output: 'docs/'
                }
            }
        }
      , watch: 
        {
            javascript: 
            {
              files: ['public/js/*.js', 'public/js/*/*.js', 'themes/plugins/*.js'] //, 'assets/js/*/*.js'
            , tasks: ['concat_sourcemap', 'exec:devJs']
            , options: 
              {
                  debounceDelay: 250
              }
            }
          , css: 
            {
              files: ['public/less/*.less']
            , tasks: ['less-compile', 'exec:devCss']
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
    grunt.loadNpmTasks('grunt-exec');
    // grunt.loadNpmTasks('grunt-docco');

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
      // , 'exec:docco'
    ]);
    grunt.registerTask('dev', [
        'watch'
    ]);

};