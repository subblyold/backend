
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
    , _displayData:    { includes: ['user', 'products'], order_by:{ id: 'DESC' } } 
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

    , sheet: function( uid ) 
      {
        this.getViewByPath( 'Subbly.View.Orders' ).setActiveRow( uid )

        var scope = this
          , order = Subbly.api('Subbly.Model.Order', { uid: uid })
          , view  = scope.getViewByPath( 'Subbly.View.OrderEntry' )

        view.showLoading()

        Subbly.fetch( order,
        {
            data: { includes: ['user', 'shipping_address', 'billing_address', 'products'] }
          , success: function( model, response )
            {
              view
                .setValue( 'model', model )
                .formatEntry()
            }
          , error: function( bbObj, response, opts )
            {
              view.serverError( new serverError( response ) )
            }
        }, this )
      }
  })


  // Order Entry view
  var OrderEntry = 
  {
      _viewName:     'OrderEntry'
    , _viewTpl:      TPL.orders.entry

    , onInitialize: function()
      {
        // add view's event
        this.addEvents({
            'click span.js-goto-customer': 'goToCustomer'
          , 'click .js-goto-product':      'goToProduct'
        })
      }

    , noResult: function()
      {
        this.$el.find('div.fetch-holder').removeClass('loading')
      }

    , noResults: function()
      {
        this.displayRendering()
      }

    , serverError: function( errorObj )
      {
        var $node = $( document.getElementById('entry-error-message') )

        $node.find('code').text( Subbly.i18n().get( 'errors.codeStatus', errorObj.status() ) )
        $node.find('p').text( errorObj.message() )

        this.displayRendering( 'error' )
      }

    , formatEntry: function()
      {
        var json = this.model.toJSON()
        json.listStatus   = [ 'draft', 'confirmed', 'refused', 'waiting', 'paid', 'sent' ]
        json.createdDate  = moment.utc( this.model.get('created_at') ).fromNow()

        json.userId  = Subbly.i18n().get( 'orderDetails.userId', json.user.id )
        json.orderId = Subbly.i18n().get( 'orderDetails.orderId', this.model.get('id') )

        json.statusTxt = __( 'orderDetails.status.' + this.model.get('status') )

        _.each( json.products, function( product )
        {
          product.total = ( product.sale_price != '0.00' )
                          ? parseFloat( product.sale_price ) * product.quantity
                          : parseFloat( product.price ) * product.quantity
        })

        this
          .displayTpl( json )
          .removeRendering()
      }

    , onDisplayTpl: function()
      {
        // this.$el.find('div.fetch-holder').removeClass('rendering').removeClass('loading')
      }

    , goToCustomer: function()
      {
        Subbly.trigger( 'hash::change', 'customers/' + this.model.get('user').uid )
      }

    , goToProduct: function( event )
      {
        Subbly.trigger( 'hash::change', 'products/' + event.currentTarget.dataset.sku )
      }
  }

  // List's row view 
  var OrderRow = 
  {
      tagName:   'li'
    , className: 'cln-lst-rw ordr-row js-trigger-goto list-row'
    , _viewName: 'CustomerRow'

    , render: function()
      {
        var qty = 0

        _.each( this.model.get('products'), function( product )
        {
          qty += ( 1 * product.quantity )
        })

        var html = this.tplRow({
            totalPrice:   this.model.get('total_price')
          , totalItems:   Subbly.i18n().choice( 'orders.items', qty ) 
          , orderStatus:  this.model.get('status')
          , customerName: this.model.get('user').displayName
          , createdDate:  moment.utc( this.model.get('created_at') ).fromNow()
        })

        this.$el.html( html )

        this.el.dataset.uid  = this.model.get('uid')

        return this
      }

    , goTo: function( event )
      {
        Subbly.trigger( 'hash::change', 'orders/' + this.model.get('uid') )
      }
  }

  // Orders controller work as Customers controler
  // so we extend it
  var OrdersList = $.extend( {}, CustomersList, 
  {
      _viewName:       'Orders'
    , _viewTpl:        TPL.orders.list
    , _classlist:      ['view-half-list']
    , _listSelector:   '#orders-list'
    , _viewRow:        'Subbly.View.OrderRow'
    , _viewSheet:      'Subbly.View.OrderEntry'
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
  })

  Subbly.register( 'Subbly', 'Orders', 
  {
      'ViewList:Orders':      OrdersList
    , 'ViewListRow:OrderRow': OrderRow
    , 'View:OrderEntry':      OrderEntry
    , 'Controller:Orders':    Orders
  })
