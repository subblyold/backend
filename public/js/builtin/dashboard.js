
  var dashboard = 
  {
      _controllerName: 'dashboard'
    , _viewsNames:     'Subbly.View.DashboardView'
    , _mainNavRegister:
      {
          name:       'Dashboard'
        , order:      200
        , defaultUrl: 'dashboard'
      }

    , onInitialize: function()
      {
  // console.log( 'onInitialize Dashboard')
      }

    , routes: {
          'dashboard': 'list'
      }

      // Routes
      //-------------------------------

    , list: function() 
      {
        var data = {
            todaySales:     499.12
          , basketAverage:  69.00
          , totalOrders:    2880
          , totalCustomers: 3421
        }

        this
          .getViewByPath( this._viewsNames )
          .displayTpl( data )
      }
  }

  var DashboardView = 
  {
      _viewName: 'Dashboard'
    , _viewTpl:  TPL.dashboard.index

      // On view initialize
    , onInitialize: function()
      {
        // add view's event
        this.addEvents( {
            'click a.js-trigger-new-product': 'addNew'
        })
      }

    , addNew: function()
      {
        Subbly.trigger( 'hash::change', 'products/_new' )
      }
  }

  Subbly.register('Subbly', 'Dashboard', {
      'View:DashboardView':   DashboardView
    , 'Controller:dashboard': dashboard
  })
