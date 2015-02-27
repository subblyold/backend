
  // CONTROLLER
  // --------------------------------

  // Orders controller work as Customers controler
  // so we extend it

  var Orders = $.extend( {}, Customers, 
  {
      _tplStructure:   'half' // full|half|third
    , _viewsNames:     [ 'Subbly.View.Orders', 'Subbly.View.OrderEntry' ]
    , _controllerName: 'orders'
    , _listDisplayed:  false  
    , _collectionPath: 'Subbly.Collection.Orders'
    , _displayData:    { includes: ['user', 'products'] } 
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

      // Routes
      //-------------------------------

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
  })


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

  // Orders controller work as Customers controler
  // so we extend it
  // TODO: finish merge
  var OrdersList = $.extend( {}, CustomersList, 
  {
      _viewName:       'Orders'
    , _viewTpl:        TPL.orders.list
    , _classlist:      ['view-half-list']
    , _listSelector:   '#orders-list'
    , _tplRow:         TPL.orders.listrow
    , _rowHeight:      100
    , _headerSelector: 'div.nano-content > div:first-child'

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
  })

  Subbly.register( 'Subbly', 'Orders', 
  {
      'ViewList:Orders':   OrdersList
    , 'View:OrderEntry':   OrderEntry
    , 'Controller:Orders': Orders
  })
