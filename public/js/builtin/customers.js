
  // CONTROLLER
  // --------------------------------

  var Customers = 
  {
      _tplStructure:   'half'
    , _viewsNames:     [ 'Subbly.View.Customers', 'Subbly.View.CustomerSheet' ]
    , _controllerName: 'customers'
    , _listDisplayed:  false
    , _collectionPath: 'Subbly.Collection.Users'
    , _displayData:    { includes: ['orders'], order_by: { last_name: 'ASC', first_name: 'ASC' } } 
    , _mainNavRegister:
      {
          name:       'Customers'
        , order:      180
        , defaultUrl: 'customers'
      }

    , routes: {
          'customers':               'display'
        , 'customers/:uid':          'display'
        , 'customers/search/:query': 'search'
      }

    , onRemove: function()
      {
        this._listDisplayed = false
      }

      // Routes
      //-------------------------------

    , display: function( uid ) 
      {
        if( !this._listDisplayed )
        {
          var scope = this

          this.displayView( function()
          {
            if( !_.isNull( uid ) )
              scope.sheet( uid )
          })

          return
        }
        
        if( !_.isNull( uid ) )
          this.sheet( uid )
        else
          this.getViewByPath( this._viewsNames[0] ) // 'Subbly.View.Customers'
            .onInitialRender()
      }

    , search: function( query ) 
      {
        var scope      = this
          , view       = this.getViewByPath( this._viewsNames[0] ) // 'Subbly.View.Customers'
          , collection = Subbly.api( this._collectionPath )

        // call sub-view display
        this.getViewByPath( this._viewsNames[1] ) // 'Subbly.View.CustomerSheet' 
          .displayTpl()

        view.displayTpl()
          .doSearch( query )

      }

    , displayView: function( sheetCB )
      {
        var scope      = this
          , view       = this.getViewByPath( this._viewsNames[0] ) // 'Subbly.View.Customers'
          , collection = Subbly.api( this._collectionPath, this._displayData )

        this._listDisplayed = true

        Subbly.once( 'view::tplDisplayed', function()
        {
          Subbly.fetch( collection,
          {
              data:   scope._displayData
            , success: function( collection, response )
              {
                scope._listDisplayed = true

                view.render()

                if( _.isFunction( sheetCB ) )
                  sheetCB()
              }
          }, this )
        } )

        view
          .setValue( 'collection', collection )
          .displayTpl()

        // call sub-view display
        this.getViewByPath( this._viewsNames[1] ) // 'Subbly.View.CustomerSheet'
          .displayTpl()
      }

    , sheet: function(  uid ) 
      {
        this.getViewByPath( 'Subbly.View.Customers' ).setActiveRow( uid )

        var scope = this
          , user  = Subbly.api('Subbly.Model.User', { uid: uid })
          , view  = this.getViewByPath( 'Subbly.View.CustomerSheet' )

        view.showLoading()
        
        Subbly.fetch( user,
        {
            data: { includes: ['addresses', 'orders'] }
          , success: function( model, response )
            {
              var json = model.toJSON()

              if( !_.isUndefined( model.get('last_login') ) )
                json.lastLogin = moment.utc( model.get('last_login') ).fromNow()

              view
                .setValue( 'model', model )
                .displayTpl( json )
                .removeRendering()
            }
        }, this )
      }

    , searching: function()
      {
        this.getViewByPath( this._viewsNames[1] ).noResults()
      }

    , noResults: function()
      {
        this.getViewByPath( this._viewsNames[0] ).noResults()
        this.getViewByPath( this._viewsNames[1] ).noResults()
      }

    , resetSearch: function()
      {
        this._listDisplayed = false

        var listView = this.getViewByPath( this._viewsNames[0]  )

        listView
          .resetList()

        this.displayView( function()
        {
          listView
            .onInitialRender()
        })
      }
  }


  // VIEWS
  // --------------------------------


  // List's row view (optional)
  // use it if you need to have 
  // full control on model (delete, etc.)
  var CustomersRow = 
  {
      tagName:   'li'
    , className: 'cln-lst-rw cust-row js-trigger-goto list-row'
    , _viewName: 'CustomerRow'

    , render: function()
      {
        var html = this.tplRow({
            displayName: this.model.get('displayName')
          , totalOrders: Subbly.i18n().choice( 'customers.orders', this.model.get('orders').length ) 
          , createdDate: moment.utc( this.model.get('created_at') ).fromNow()
        })

        this.$el.html( html )

        this.el.dataset.uid  = this.model.get('uid')

        return this
      }

    , goTo: function( event )
      {
        Subbly.trigger( 'hash::change', 'customers/' + this.model.get('uid') )
      }
  }

  // Customers List view
  var CustomersList = 
  {
      _viewName:       'Customers'
    , _viewTpl:        TPL.customers.list
    , _classlist:      ['view-half-list']
    , _listSelector:   '#customers-list'
    , _tplRow:         TPL.customers.listrow
    , _viewRow:        'Subbly.View.CustomerRow'
    , _viewSheet:      'Subbly.View.CustomerSheet'
    , _rowHeight:      100
    , _headerSelector: 'div.nano-content > div:first-child'

      // Call on list first render
    , onInitialRender: function()
      {
        var $firstRow = this.getListEl().children(':first')
          , uid       = $firstRow.attr('data-uid')

        this.callController( 'sheet', uid )
      }

    , onDisplayTpl: function()
      {
        // Bind search form
        this._searchForm = Subbly.api('Subbly.View.Search', {
            collection:  'Subbly.Collection.Users'
          , element:     '#customers-search'
          , pathContext: 'customers'
          , includes:    ['orders']
          , context:     this
        })
      }

    , onDetailIsEmpty: function()
      {
        this._controller.getViewByPath( this._viewSheet ).noResults()
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
    , setActiveRow: function( uid )
      {
        var $listRows  = this.getListRows()
          , $activeRow = $listRows.filter('[data-uid="' + uid + '"]')

        $listRows.removeClass('active')
        $activeRow.addClass('active')
      }
  }

  // Customers Sheet view
  var CustomerSheet = 
  {
      _viewName:     'CustomerSheet'
    , _viewTpl:      TPL.customers.sheet

      // On view initialize
    , onInitialize: function()
      {
        // add view's event
        this.addEvents( {
            'click ul.customer-nav a': 'switchTab'
          , 'click li.js-order-goto':  'goToOrder'
        })
      }

    , noResults: function()
      {
        this.displayRendering()
      }

    , serverError: function()
      {
        this.displayRendering( 'error' )
      }

    , onDisplayTpl: function()
      {
        this._$tabsLinks = this.$el.find('ul.customer-nav a')
        this._$tabs      = this.$el.find('div.customer-tab')
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

    , goToOrder: function( event )
      {
        Subbly.trigger( 'hash::change', 'orders/' + event.currentTarget.getAttribute('data-uid') )
      }
  }


  // REGISTER PLUGIN
  // --------------------------------


  Subbly.register( 'Subbly', 'Customers', 
  {
      'ViewList:Customers':      CustomersList
    , 'ViewListRow:CustomerRow': CustomersRow
    , 'View:CustomerSheet':      CustomerSheet
    , 'Controller:Customers':    Customers
  })

