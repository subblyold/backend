
// Subbly's Backbone base model

var SubblyView = Backbone.View.extend(
{
    _viewId:     false
  , _viewName:   false
  , _viewTpl:    false
  , _classlist:  []
  , _controller: false
  , _$nano:      false
  , _sticky:     false
  , _$fetchView: false

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

    // Call controller method from view
  , callController: function( method )
    {
      if( !this._controller[ method ] )
        throw new Error( 'controller "' + this._controllerName + '" does not have  "' + method + '" method' )

      var args = [].slice.call( arguments, 1 )

      return this._controller[ method ].apply( this._controller, args )
    }

  , setValue: function( key, value )
    {
      this[ key ] = value

      return this
    }

  , showLoading: function()
    {
      this._$fetchView.addClass('rendering').addClass('loading')

      return this
    }

  , removeLoading: function()
    {
      this._$fetchView.removeClass('rendering').removeClass('loading')

      return this
    }

  , displayTpl: function( tplData )
    {
      if( !this._viewTpl )
        return

      // this.$el.find('div.fetch-holder').removeClass('rendering').removeClass('loading')

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
      this.removeLoading()

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
