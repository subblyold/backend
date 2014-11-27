
  var SettingsPage = 
  {
      _controllerName: 'Settings'
    , _viewsNames:     'Subbly.View.Settings'
    , _mainNavRegister:
      {
          name:       'Settings'
        , order:      160
        , defaultUrl: 'settings'
      }

    , onInitialize: function() {}

    , routes: {
          'settings': 'list'
      }

      // Routes
      //-------------------------------

    , list: function() 
      {
        var scope    = this

        new xhrCall(
        {
            url:     'settings'
          , headers: subbly.apiHeader()
          , success: function( response )
            {
              var settings = {
                siteStatusList: [ 'offline', 'online' ]
              }

              _.each( response.response.settings, function( value, key )
              {
                Helpers.setNested( settings, key, value )
              })

              scope.getViewByPath( scope._viewsNames )
                .setValue( 'settings', settings )
                .displayTpl( settings )
            }
          , error:   function( jqXHR, textStatus, errorThrown )
            {
            }
        })
      }
  }

  var SettingsView = 
  {
      _viewName:  'Settings'
    , _viewTpl:    TPL.settings.index
    , _$tabsLinks: false
    , _$tabs:      false

      // On view initialize
    , onInitialize: function()
      {
        // add view's event
        this.addEvents( {
            'click ul.nav-tabs a': 'switchTab'
          , 'submit form':         'submit'
        })
      }

    , onDisplayTpl: function()
      {
        this._$tabsLinks = this.$el.find('ul.nav-tabs a')
        this._$tabs      = this.$el.find('.tab-pane')
      }

    , switchTab: function( event )
      {
        event.preventDefault()

        var id = event.target.href.split('#')[1]

        this._$tabsLinks.removeClass('active')
        this._$tabs.removeClass('active')

        event.target.classList.add('active')

        document.getElementById( id ).classList.add('active')
      }

    , submit: function( event )
      {
        event.preventDefault()

        var $inputs  = $( event.target ).find(':input')
          , formData = $inputs.serializeObject( false )

        new xhrCall(
        {
            url:     'settings'
          , type:    'PUT'
          , data:    JSON.stringify( formData )
          , headers: subbly.apiHeader()
          , success: function( response )
            {

            }
          , error:   function( jqXHR, textStatus, errorThrown )
            {
            }
        })

      }

    // , addNew: function()
    //   {
    //     subbly.trigger( 'hash::change', 'products/_new' )
    //   }
  }

  Subbly.register('Subbly', 'Settings', {
      'View:Settings':       SettingsView
    , 'Controller:Settings': SettingsPage
  })
