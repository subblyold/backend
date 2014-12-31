
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
        var settings = Subbly.storeSettings().getAsObject()

        this.getViewByPath( this._viewsNames )
          .setValue( 'settings', settings )
          .setValue( 'model', Subbly.storeSettings() )
          .displayTpl( settings )
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

        var scope      = this
          , $inputs    = $( event.target ).find(':input')
          , formData   = $inputs.serializeObject( false )
          , updateI18n =  ( 
                            formData['subbly.backend_language'] 
                            && Subbly.getSetting('subbly.backend_language') != formData['subbly.backend_language']
                          )

        Subbly.store( this.model, formData, 
        {
            type: 'PUT'
          , onSuccess: function( model, response )
            {
              if( updateI18n )
              {
                Subbly.i18n().setLocale( formData['subbly.backend_language'], function()
                {
                  scope.displayTpl( model.getAsObject() )
                })
              }
            }
        })
      }

    // , addNew: function()
    //   {
    //     Subbly.trigger( 'hash::change', 'products/_new' )
    //   }
  }

  Subbly.register('Subbly', 'Settings', {
      'View:Settings':       SettingsView
    , 'Controller:Settings': SettingsPage
  })
