
  // CONTROLLER
  // --------------------------------

  var Orders = 
  {
      _tplStructure:   'half' // full|half|third
    , _viewsNames:     [ 'Subbly.View.Orders', 'Subbly.View.OrderEntry' ]
    , _controllerName: 'orders'
    , _listDisplayed:  false  
    , _mainNavRegister:
      {
          name:       'Orders'
        , order:      190
        , defaultUrl: 'orders'
      }
      
    , routes: {
          'orders':                 'display'
        , 'orders/:id':             'display'
        , 'orders/search/:query': 'search'
      }

    , onRemove: function()
      {
        this._listDisplayed = false
      }

      // Routes
      //-------------------------------

    , display: function( id ) 
      {
        if( !this._listDisplayed )
        {
          var scope = this

          this.displayView( function()
          {
            if( !_.isNull( id ) )
              scope.sheet( id )
          })

          return
        }
        
        if( !_.isNull( id ) )
          this.sheet( id )
        else
          this.getViewByPath( 'Subbly.View.Orders' )
            .onInitialRender()
      }

    , search: function( query ) 
      {
        var scope      = this
          , view       = this.getViewByPath( 'Subbly.View.Orders' )
          , collection = Subbly.api('Subbly.Collection.Orders')

        // call sub-view display
        this.getViewByPath( 'Subbly.View.OrderEntry' )
          .displayTpl()

        view.displayTpl()
          .doSearch( query )

      }

    , displayView: function( sheetCB )
      {
        var scope      = this
          , view       = this.getViewByPath( 'Subbly.View.Orders' )
          , collection = Subbly.api('Subbly.Collection.Orders')
        
        this._listDisplayed = true

        Subbly.once( 'view::tplDisplayed', function()
        {
          Subbly.fetch( collection,
          {
              data:   {
                includes: ['user', 'products']
              }
            , success: function( collection, response )
              {
                scope._listDisplayed = true

                view
                  .render()

                if( _.isFunction( sheetCB ) )
                  sheetCB()
              }
          }, this )
        } )

        view
          .setValue( 'collection', collection )
          .displayTpl()

        // call sub-view display
        this.getViewByPath( 'Subbly.View.OrderEntry' )
          .displayTpl()
      }

    , sheet: function(  id ) 
      {
        this.getViewByPath( 'Subbly.View.Orders' ).setActiveRow( id )

        var scope = this
          , order = Subbly.api('Subbly.Model.Order', { id: id })
          , view  = scope.getViewByPath( 'Subbly.View.OrderEntry' )

        view.showLoading()

        Subbly.fetch( order,
        {
            data: { includes: ['user', 'shipping_address', 'billing_address', 'products'] }
          , success: function( model, response )
            {
              var json = model.toJSON()
              json.listStatus   = [ 'draft', 'confirmed', 'refused', 'waiting', 'paid', 'sent' ]
              json.customerName = 'Fake Name'
              json.createdDate  = moment.utc( model.get('created_at') ).fromNow()

              view
                .setValue( 'model', model )
                .displayTpl( json )
                .removeRendering()
            }
        }, this )
      }

    , searching: function()
      {
        this.getViewByPath( 'Subbly.View.OrderEntry' ).noResults()
      }

    , noResults: function()
      {
        this.getViewByPath( 'Subbly.View.Orders' ).noResults()
        this.getViewByPath( 'Subbly.View.OrderEntry' ).noResults()
      }

    , resetSearch: function()
      {
        this._listDisplayed = false

        var listView = this.getViewByPath( 'Subbly.View.Orders' )

        listView
          .resetList()

        this.displayView( function()
        {
          listView
            .onInitialRender()
        })
      }
  }


  // Order Entry view
  var OrderEntry = 
  {
      _viewName:     'OrderEntry'
    , _viewTpl:      TPL.orders.entry

    , noResult: function()
      {
        this.$el.find('div.fetch-holder').removeClass('loading')
      }

    , noResults: function()
      {
        this.displayRendering()
      }

    , onDisplayTpl: function()
      {
        // this.$el.find('div.fetch-holder').removeClass('rendering').removeClass('loading')
      }
  }

  var OrdersList = 
  {
      _viewName:       'Orders'
    , _viewTpl:        TPL.orders.list
    , _classlist:      ['view-half-list']
    , _listSelector:   '#orders-list'
    , _tplRow:         TPL.orders.listrow
    , _rowHeight:      100
    , _headerSelector: 'div.nano-content > div:first-child'

      // On view initialize
    , onInitialize: function()
      {
        // add view's event
        this.addEvents( {'click li.js-trigger-goto':  'goTo'} )
      }

      // Call on list first render
    , onInitialRender: function()
      {
        var $firstRow = this.getListEl().children(':first')
          , id       = $firstRow.attr('data-id')

        this.callController( 'sheet', id )
      }

    , onDisplayTpl: function()
      {
        // Bind search form
        this._searchForm = Subbly.api('Subbly.View.Search', {
            collection:  'Subbly.Collection.Orders'
          , element:     '#orders-search'
          , pathContext: 'orders'
          , context:     this
        })
      }

      // Build single list's row
    , displayRow: function( model )
      {
        var html = this._tplRowCompiled({
            id:           model.get('id')
          , totalPrice:   model.get('total_price')
          // , totalItems:   model.get('orders').length
          , orderStatus:  model.get('status')
          , customerName: 'toto Name'
          , createdDate:  moment.utc( model.get('created_at') ).fromNow()
        })

        return html
      }

    , onDetailIsEmpty: function()
      {
        this._controller.getViewByPath( 'Subbly.View.OrderEntry' ).noResults()
      }

    , doSearch: function( query )
      {
        this._searchForm.preFill( query )
      }

    , noResults: function()
      {
        this.showSearch()
      }

      // Higthligth active row
    , setActiveRow: function( id )
      {
        var $listRows  = this.getListRows()
          , $activeRow = $listRows.filter('[data-id="' + id + '"]')

        $listRows.removeClass('active')
        $activeRow.addClass('active')
      }

      // go to customer profile
    , goTo: function( event )
      {
        var id = event.currentTarget.dataset.id

        Subbly.trigger( 'hash::change', 'orders/' + id )
      }
  }

  Subbly.register( 'Subbly', 'Orders', 
  {
      'ViewList:Orders':   OrdersList
    , 'View:OrderEntry':   OrderEntry
    , 'Controller:Orders': Orders
  })
