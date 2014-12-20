var SubblyViewSearch

Components.Subbly.View.Search = SubblyViewSearch = SubblyView.extend(
{
    _viewName:   'ListSearch'

  , _xhrPromise: false

  // on Subbly View Initialize override
  , initialize: function( options )
    {
      // reference to the parent view
      this._context      = options.context

      // model's relations to include
      this._includes     = options.includes || []

      // Controller reference is needed 
      // to initialize view
      options.controller = options.context._controller

      // Call parent `initialize` method
      SubblyView.prototype.initialize.apply( this, arguments )

      // set DOM element
      this.setElement( options.element )

      // extend list collection with search's properties
      var baseCollection = Helpers.getNested( Components, options.collection , false )
        , collection     = baseCollection.extend( SubblyCollectionSearch )

      this.collection = new collection()

      // collect DOM's elements
      this._$input   = this.$el.find('input[type="search"]')
      this._$btnRest = this.$el.find('a.js-reset-search') 

      // Create the listener function
      var scope      = this
        , prevQuery  = false
        , lazySearch = _.debounce( function( query )
          {
            if( query === prevQuery )
              return
            
            prevQuery = query

            scope.doSearch( query )
          }, 500)

      // Attach form event
      this._$btnRest.on( 'click', _.bind( this.resetSearch, this ) )
      this._$input.on( 'keyup', function( event )
      {
        // prevent arrow key move, form validation and bubbling
        if( [ 13,37,38,39,40 ].indexOf( event.keyCode ) != -1 )
        {
          event.stopPropagation()
          event.preventDefault()
          return
        }

        var query  = $.trim( event.currentTarget.value )

        if( _.isBlank( query ) )
        {
          scope.resetSearch()
          return
        }

        Subbly.trigger( 'hash::change', 'customers/search/' + query, false )

        // TODO: set as callback
        scope._context.showLoading()
        // scope._context.callController('noResults')

        // scope.$el.addClass('searching')
        // scope._context.callController('searching')
        scope.searching()

        lazySearch( query )
      })

      return this
    }

  , searching: function()
    {
      this.$el.addClass('searching')
      this._context.callController('searching')      
    }

  , preFill: function( query )
    {
      this._$input.val( query )
      this.searching()
      this.doSearch( query )
    }

  , doSearch: function( query )
    {
      // if running search, abort active request
      if( 
          this._xhrPromise
          && this._xhrPromise.readyState > 0 
          && this._xhrPromise.readyState < 4 
        )
        this._xhrPromise.abort()

      var scope = this

      this._xhrPromise = Subbly.fetch( this.collection,
      {
          data: { includes: this._includes, q: query }
        , success: function( collection, response )
          {
            scope._xhrPromise = false

            if( !collection.length )
            {
              scope._context.callController('noResults')
              return
            }

            scope._context
              .resetList()
              .setValue( 'collection', collection )
              .render()
              .onInitialRender()
          }
      }, this )
    }

  , resetSearch: function()
    {
      this._xhrPromise = false
      this.$el.removeClass('searching')
      this._$input.val('')

      Subbly.trigger( 'hash::change', 'customers', true )

      this._context
        .resetList()
        .callController('resetSearch')
    }
})