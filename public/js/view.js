
// Subbly's Backbone base model

var SubblyView = Backbone.View.extend(
{
    _viewId:          false
  , _viewName:        false
  , _viewTpl:         false
  , _controller:      false
  , _$nano:           false
  , _sticky:          false
  , _$fetchView:      false
  , _isRendering:     false
  , _classlist:       []
  , _renderingStates: 'loading empty search idle error'
  , _renderingClass:  'rendering'

  , initialize: function( options )
    {
      this._viewId     = options.viewId
      this._controller = options.controller

      if( this._classIdentifier )
        this._classlist.push( this._classIdentifier )

      // add extra class
      _( this._classlist )
        .forEach( function( c )
        {
          this.el.classList.add( c )
        }, this)

      // Public views `initialize` callback
      // you can use it
      if( this.onInitialize )
        this.onInitialize( options )

      return this
    }

    // view events
  , events: {}

    // Add events hash to the view
  , addEvents: function( events )
    {
      this.events = _.extend( {}, this.events, events )
    }

    // Hook to override if needed
  , onInitialize: function()
    {
      // this.on( 'fetch::calling', ..., ... )
      // this.on( 'fetch::responds', ..., ... 
    }

  , getControllerName: function()
    {
      return this._controller.getName()
    }

    // Call controller method from view
  , callController: function( method )
    {
      if( !this._controller[ method ] )
        throw new Error( 'controller "' + this.getControllerName() + '" does not have  "' + method + '" method' )

      var args = [].slice.call( arguments, 1 )

      return this._controller[ method ].apply( this._controller, args )
    }

  , setValue: function( key, value )
    {
      // TODO: add test
      if( _.isObject( key ) )
      {
        _.each( key, function( v, k )
        {
          this[ k ] = v
        }, this)
      }
      else
      {
        this[ key ] = value
      }
      
      return this
    }

    // Display view's 'state.
    // E.G.: loading, empty, etc.
  , displayRendering: function( state )
    {
      this._$fetchView
        .removeClass( this._renderingStates )

      var klass = this._renderingClass

      if( !_.isUndefined( state ) )
        klass += ' ' + state

      this._$fetchView
        .addClass( klass  )

      return this
    }

    // Remove rendering state
    // to display view's content
  , removeRendering: function()
    {
      this._$fetchView
        .removeClass( this._renderingClass + ' ' + this._renderingStates )

      return this
    }

    // Rendering shortcuts
    // --------------------

  , showLoading: function()
    {
      this.displayRendering( 'loading' )

      return this
    }

  , showIdle: function()
    {
      this.displayRendering( 'idle' )

      return this
    }

  , showEmpty: function()
    {
      // this._$fetchView.addClass('rendering').addClass('empty')
      this.displayRendering( 'empty' )

      return this
    }

  , showSearch: function()
    {
      this.displayRendering( 'search' )

      return this
    }

    // TO REMOVE SOON BEGING 
  , removeLoading: function()
    {
console.log( 'call removeLoading')

      return this
    }

  , removeIdle: function()
    {
console.log( 'call removeIdle')

      return this
    }

  , removeEmpty: function()
    {
console.log( 'call removeEmpty')

      return this
    }

  , removeNoResults: function()
    {
console.log( 'call removeNoResults')

      return this
    }
    // TO REMOVE SOON END 

  , displayTpl: function( tplData )
    {
      if( !this._viewTpl )
        return

      tplData = tplData || {}

      var tpl  = Handlebars.compile( this._viewTpl )
        , html = tpl( tplData )

      // inject html inton view
      this.$el.html( html )

      // Setup nanoscroller
      this._$nano      = this.$el.find('div.nano')
      this._$fetchView = this.$el.find('.fetch-holder')

      var scope = this

      this._$nano.nanoScroller()
      this._$nano.on( 'scrollend', function( event )
      {
        scope.trigger('view::scrollend')
      })

      this._sticky = new scroll2sicky( this.$el )

      if( this.onDisplayTpl )
        this.onDisplayTpl()

      return this
    }

  , render: function()
    {
      this.removeRendering()

      if( this.onRenderAfter )
        this.onRenderAfter()

      return this
    }

  , onClose: function()
    {
      if( this._$nano )
        this._$nano.nanoScroller({ destroy: true })

      if( this._sticky )
        this._sticky.kill()
    }
})
