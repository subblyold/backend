
  // CONTROLLER
  // --------------------------------

  var Products = 
  {
      _tplStructure:   'full'
    , _viewsNames:     'Subbly.View.Products'
    , _controllerName: 'products'
    , _mainNavRegister:
      {
          name:       'Products'
        , order:      170
        , defaultUrl: 'products'
      }

    , routes: {
          'products':      'display'
      }

      // Routes
      //-------------------------------

    , display: function() 
      {
        var scope = this
          , view  = this.getViewByPath( 'Subbly.View.Products' )

        var collection = Subbly.api('Subbly.Collection.Products')
        
        Subbly.once( 'view::tplDisplayed', function()
        {
          Subbly.fetch( collection,
          {
              data:   {
                  includes: [ 'images']
              }
            , success: function( collection, response )
              {
                view.render()
              }
          }, this )
        } )

        view
          .setValue( 'collection', collection )
          .displayTpl()
      }
  }


  // VIEWS
  // --------------------------------



  // Products List view
  var ProductsList = 
  {
      _viewName:       'Products'
    , _viewTpl:        TPL.products.list
    , _displayMode:    'grid'
    , _cookieName:     'SubblyProductsViewMode'
    , _listSelector:   '#products-view-list'
    , _tplRow:         TPL.products.listrow
    , _headerSelector: 'div.nano-content > div:first-child'

      // On view initialize
    , onInitialize: function()
      {
        this._displayMode = Subbly.getCookie( this._cookieName )

        this.getRowHeight()

        // add view's event
        this.addEvents( {
            'click .js-tigger-goto':  'goTo'
          , 'click a.js-toggle-view': 'clickToggleView'
          , 'click a.js-trigger-new': 'addNew'
        })

        // this._$window = $( window )
      }

      // Build single list's row
    , displayRow: function( model )
      {
        var html = this._tplRowCompiled( model.toJSON() )

        return html
      }

    , onAfterRender: function()
      {
        this._$viewItems = $( document.getElementById('products-view-list') )
        this._$btnViews  = this.$el.find('a[data-view]')
        
        // this.getToggleView()
        this.toggleView()

        var scope = this

        var feedback = Subbly.feedback()

        this.sortable = new sortable( this.$el.find('ul.sortable'), 
        {
            idAttribute: 'sku'
          , url:         scope.collection.serviceName + '/sort' 
          , onSuccess:   function( json )
            {
              feedback.progressEnd()
            }
          , onError: function( json )
            {
              feedback.progressEnd( 'error', 'Whoops, problem' )
            }
          , onUpdate: function( json )
            {
              feedback.add().progress()
            }
        })        
      }

      // go to customer profile
    , goTo: function( event )
      {
        var sku = event.currentTarget.dataset.sku

        Subbly.trigger( 'hash::change', 'products/' + sku )
      }

    , getRowHeight: function()
      {
        if( this._displayMode == 'list' )
          this._rowHeight = 70
        else
            this._rowHeight = 276
          , this._rowWidth  = 216 
      }

    , getToggleView: function()
      {
        this._displayMode = Subbly.getCookie( this._cookieName )

        this.getRowHeight()

        this.toggleView()
      }

      // override the method because grid mode needs 
      // to take count of window width
    , defineRowsLimit: function( _cb )
      {
        // standard calcul
        // Call parent `defineRowsLimit` method
        if( this._displayMode == 'list' )
        {
          SubblyViewList.prototype.defineRowsLimit.apply( this, arguments )
        }
        else
        {
          // Grid Mode
          if( !this._winHeight )
            this._winHeight = this._$nano.height()

          if( !this._winWidth )
            this._winWidth = this._$list.width()

          var perLine = ( this._winWidth / this._rowWidth )
            , limit   = Math.ceil( ( ( this._winHeight - this._headHeight ) / this._rowHeight ) * perLine )

          if( limit > this.collection.limit )
          {
            console.info('redefine query limit to '+ limit)
            this.collection.setPerPage( limit )          
          }

          if( _.isFunction( _cb ) )
            _cb()
        }
      }
      // override the method because grid mode needs 
      // to take count of window width
    , reDefineRowsLimit: function( event, viewport )
      {
        // standard calcul
        // Call parent `reDefineRowsLimit` method
        if( this._displayMode == 'list' )
        {
          SubblyViewList.prototype.reDefineRowsLimit.apply( this, arguments )
        }
        else
        {
          // Grid Mode
          var tmpH  = this._winHeight
            , tmpW  = this._winWidth
            , listW = this._$list.width()

          this._winHeight = viewport.height
          this._winWidth  = listW

          if( ( viewport.height > tmpH ) || ( listW > tmpW ) )
          {
            this._$nano.trigger( 'scrollend' )
          }
        }
      }


    , clickToggleView: function( event )
      {
        var tmp = event.currentTarget.dataset.view

        if( tmp == this._displayMode )
          return

        this._displayMode = tmp

        Subbly.setCookie( this._cookieName, this._displayMode )

        this.toggleView()

        $window.trigger('resize')
      }

    , toggleView: function()
      {
        if( this._displayMode == 'list' )
          this.displayList()
        else
          this.displayThumb()

        this._$btnViews.removeClass('active')

        this._$btnViews.filter('[data-view="' + this._displayMode + '"]').addClass('active')
      }

    , displayList: function()
      {
        this._$viewItems.addClass('pdt-list')
      }

    , displayThumb: function()
      {
        this._$viewItems.removeClass('pdt-list')
      }

    , addNew: function()
      {
        Subbly.trigger( 'hash::change', 'products/_new' )
      }
  }

  // REGISTER PLUGIN
  // --------------------------------


  Subbly.register( 'Subbly', 'Products', 
  {
      'ViewList:Products':     ProductsList
    , 'Controller:Products':   Products
  })
