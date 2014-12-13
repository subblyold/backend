
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

      // On view initialize
    , onInitialize: function()
      {
        // add view's event
        this.addEvents( {
            'click .js-tigger-goto':  'goTo'
          , 'click a.js-toggle-view': 'toggleView'
          , 'click a.js-trigger-new': 'addNew'
        })
        
        this.tplList  = Handlebars.compile( TPL.products.listrow )
        this.tplGrid  = Handlebars.compile( TPL.products.listgrid )
        this._$window = $(window)
      }

    , onDisplayTpl: function()
      {
        this._$list = $( document.getElementById('products-view-list') )
        this._$grid = $( document.getElementById('products-view-grid') )

        this._$viewItems = this._$list.add( this._$grid )
        this._$triggers  = this.$el.find('a.js-toggle-view')

        // this.render()

        return this
      }

      // Render list's row
    , render: function()
      {
        if( !this.collection )
          return
        
        if( this.collection.isEmpty() )
        {
          this._$fetchView.addClass('rendering').addClass('empty').removeClass('loading')
          return
        }

        this._$fetchView.removeClass('rendering').removeClass('loading')

        // fetch flag
        this._isLoadingMore = false

        // var $loader = $( document.getElementById( 'list-pagination-loader') )

        // if( $loader.length )
        //   $loader.remove()

        // if( !this.collection.length && this._inviteTxt )
        // {
        //   Subbly.trigger( 'loader::hide' )
        //   this.displayInviteMsg()
        //   return
        // }

        this._fragmentGrid = ''
        this._fragmentList = ''

        this.collection.each( function( model )
        {
          var json = model.toJSON()

          this._fragmentGrid += this.tplGrid( json )
          this._fragmentList += this.tplList( json )

        }, this )

        if( this._fragmentGrid !== '' )
        {
          this._$list.append( this._fragmentList )
          this._$grid.append( this._fragmentGrid )

          this._$listItems = this._$list.find('li.pdt-lst-itm')
          this._$gridItems = this._$grid.find('a.list')

          if( !this._initialDisplay )
          {
            this._initialDisplay = true

            var viewMode = Subbly.getCookie( this._cookieName )

            if( !viewMode )
              viewMode = this._displayMode
            else
              this._displayMode = viewMode

            this._$triggers.filter('[data-view="' + viewMode + '"]').addClass('active')

            $( document.getElementById( 'products-view-' + viewMode ) ).removeClass('dp-n')

          }

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
                    url:     scope.collection.serviceName + '/' + $sorted.data('sku') + '/sort' 
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

          delete this._fragment
        }
      }

      // go to customer profile
    , goTo: function( event )
      {
        var sku = event.currentTarget.dataset.sku

        Subbly.trigger( 'hash::change', 'products/' + sku )
      }

    , toggleView: function( event )
      {
        this._displayMode = event.currentTarget.dataset.view

        Subbly.setCookie( this._cookieName, this._displayMode )

        this._$viewItems.addClass('dp-n')
        this._$triggers.removeClass('active')

        $( document.getElementById( 'products-view-' + this._displayMode ) ).removeClass('dp-n')

        $( event.currentTarget ).addClass('active')

        this._$window.trigger('resize')
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
