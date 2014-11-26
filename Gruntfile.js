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
                  , sourceMapURL: '<%= pkg.name %>.local.css.map'
                  , sourceMapFilename: '<%= pkg.dist %>css/<%= pkg.name %>.local.css.map'
                }
              , files: {
                  '<%= pkg.dist %>css/<%= pkg.name %>.local.css': 'public/src/less/subbly.less'
                }
            }
          , staging: 
            {
                options: 
                {
                    strictMath: true
                  , sourceMap: true
                  , outputSourceFiles: true
                  , sourceMapURL: '<%= pkg.name %>.staging.css.map'
                  , sourceMapFilename: '<%= pkg.dist %>css/<%= pkg.name %>.staging.css.map'
                  , compress: true
                }
              , files: {
                  '<%= pkg.dist %>css/<%= pkg.name %>.staging.css': 'public/src/less/subbly.less'
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
                    '<%= pkg.dist %>css/<%= pkg.name %>.local.css': [
                        'public/src/less/subbly.less'
                    ]
                }
              , src: '<%= pkg.dist %>css/<%= pkg.name %>.local.css'
            }
        }
      , csslint: 
        {
            options: 
            {
              csslintrc: 'public/src/less/.csslintrc'
            }
          , src: [ '<%= pkg.dist %>css/<%= pkg.name %>.local.css' ]
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
                  '<%= pkg.dist %>css/<%= pkg.name %>.production.css': '<%= pkg.dist %>css/<%= pkg.name %>.local.css'
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
                    'public/src/lib/jquery/jquery-2.1.1.js'
                  // , 'public/src/lib/jquery/jquery.ui.widget.js'
                  , 'public/src/lib/jquery/jquery.nanoscroller.js'
                  // , 'public/src/lib/jquery/jquery.fileupload.js'
                  , 'public/src/lib/underscore/underscore.js'
                  , 'public/src/lib/backbone/backbone.js'
                  , 'public/src/lib/backbone/backbone.controller.js'
                  , 'public/src/lib/backbone/backbone-approuter.js'
                  , 'public/src/lib/backbone/backbone-appready.js'
                  , 'public/src/lib/backbone/backbone.basicauth.js'
                  , 'public/src/lib/handlebars/handlebars-v2.0.0.js'
                  // , 'public/src/lib/bootstrap/dropdown.js'
                  , 'public/src/lib/bootstrap/button.js'
                  // , 'public/src/lib/bootstrap/modal.js'
                  , 'public/src/lib/moment/moment.js'
                  // , 'public/src/lib/download/download.js'

                  , 'public/src/js/scroll2sicky.js'

                  // App
                  , 'public/src/js/closure.intro.js'
                  , 'public/src/js/helpers/helpers.js'
                  , 'public/src/js/helpers/handlebars.js'
                  , 'public/src/js/helpers/validation.js'
                  , 'public/src/js/helpers/xhr.js'
                  , 'public/src/js/helpers/feedback.js'
                  // , 'public/src/js/helpers/delete.js'
                  // , 'public/src/js/helpers/uploader.js'
                  // , 'public/src/js/helpers/session.js'
                  // , 'public/src/js/helpers/feedback.js'

                  , 'public/src/js/model.js'
                  , 'public/src/js/collection.js'
                  , 'public/src/js/view.js'
                  , 'public/src/js/controller.js'
                  , 'public/src/js/subbly.js'

                  , 'public/src/js/models/*.js'
                  , 'public/src/js/collections/*.js'
                  , 'public/src/js/controllers/*.js'
                  , 'public/src/js/views/*.js'

                  , 'public/src/js/builtin/*.js'

                  , 'public/src/js/router.js'
                  , 'public/src/js/closure.utils.js'
                  , 'public/src/js/closure.outro.js'
                ]
              , dest: '<%= pkg.dist %>js/<%= pkg.name %>.local.js'
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
                , sourceMapName: '<%= pkg.dist %>js/<%= pkg.name %>.staging.js.map'
              }
            , files: 
              {
                  '<%= pkg.dist %>js/<%= pkg.name %>.staging.js': '<%= pkg.dist %>js/<%= pkg.name %>.local.js'
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
                  '<%= pkg.dist %>js/<%= pkg.name %>.production.js': '<%= pkg.dist %>js/<%= pkg.name %>.local.js'
              }            
          }
        }
      , watch: 
        {
            javascript: 
            {
              files: ['public/src/js/*.js', 'public/src/js/*/*.js', 'themes/plugins/*.js'] //, 'public/src/js/*/*.js'
            , tasks: ['concat_sourcemap']
            , options: 
              {
                  debounceDelay: 250
              }
            }
          , css: 
            {
              files: ['public/src/less/*.less']
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