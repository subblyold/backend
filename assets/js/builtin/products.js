
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

        view.displayTpl()

        Subbly.fetch( Subbly.api('Subbly.Collection.Products'),
        {
            data:   {
                offset: 0
              , limit:  5
            }
          , success: function( collection, response )
            {
              view
                .setValue( 'collection', collection )
                .render()
            }
        }, this )
      }
  }


  // VIEWS
  // --------------------------------



  // Products List view
  var ProductsList = 
  {
      _viewName:     'Products'
    , _viewTpl:      TPL.products.list
    , _displayMode:  'grid'
    , _cookieName:   'SubblyProductsViewMode'
    , _listSelector: '#products-view-list'
    , _tplRow:        TPL.products.listrow

      // On view initialize
    , onInitialize: function()
      {
        // add view's event
        this.addEvents( {
            'click .js-tigger-goto':  'goTo'
          , 'click a.js-toggle-view': 'clickToggleView'
          , 'click a.js-trigger-new': 'addNew'
        })

        this._$window = $( window )
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
        
        this.getToggleView()

        var scope = this
        
        this.sortable = new sortable( this.$el.find('.sortable'), 
        {
            start: function( e, ui )
            {
              var $element = $( ui.item ).parent('ul').find('li.sortable-placeholder')

              $element.height( ui.helper.outerHeight() )
              $element.width( ui.helper.outerWidth() )
            }
          , update: function( e, ui )
            {
              var $sorted    = ui.item
                , $previous  = $sorted.prev()
                , moveType   = ( $previous.length > 0 )
                               ? 'moveAfter'
                               : 'moveBefore'
                , movedId    = ( $previous.length > 0 )
                               ? $previous.data('sku')
                               : $sorted.next().data('sku')

              var feedback = Subbly.feedback()

              feedback.add().progress()

              var promise = new xhrCall(
              {
                  url:     scope.collection.serviceName + '/sort' 
                , setAuth: true
                , type:    'POST'
                , data: 
                  {
                    products: 
                    {
                        type:     moveType
                      , movingId: $sorted.data('sku')
                      , movedId:  movedId
                    }
                  }
                , success: function( json )
                  {
                    feedback.progressEnd( 'success', 'Products updated' )
                  }
                , error: function( json )
                  {
                    feedback.progressEnd( 'success', 'Whoops, problem' )
                  }
              })
            }
        })        
      }

      // go to customer profile
    , goTo: function( event )
      {
        var sku = event.currentTarget.dataset.sku

        Subbly.trigger( 'hash::change', 'products/' + sku )
      }

    , getToggleView: function()
      {
        this._displayMode = Subbly.getCookie( this._cookieName )

        this.toggleView()
      }

    , clickToggleView: function( event )
      {
        this._displayMode = event.currentTarget.dataset.view

        Subbly.setCookie( this._cookieName, this._displayMode )

        this.toggleView()
      }

    , toggleView: function()
      {
        if( this._displayMode == 'list' )
          this.displayList()
        else
          this.displayThumb()

        this._$btnViews.removeClass('active')

        this._$btnViews.filter('[data-view="' + this._displayMode + '"]').addClass('active')

        this._$window.trigger('resize')
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
