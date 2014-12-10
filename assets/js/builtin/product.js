
  // CONTROLLER
  // --------------------------------

  var Product = 
  {
      _tplStructure:   'full'
    , _viewsNames:     'Subbly.View.ProductEntry'
    , _controllerName: 'product'
    , _mainNavRegister:
      {
        defaultUrl: 'products'
      }

    , routes: {
          'products/_new': 'display'
        , 'products/:sku': 'display'
      }

      // Routes
      //-------------------------------

    , display: function( sku ) 
      {
        var isNew   = ( sku === '_new' )
          , opts    = ( isNew ) ? {} : { sku: sku }
          , product = Subbly.api('Subbly.Model.Product', opts )
          , view    = this.getViewByPath( 'Subbly.View.ProductEntry' )
        
        view.displayTpl()

        Subbly.fetch( product,
        {
            data: { includes: ['options', 'images', 'categories'] }
          , success: function( model, response )
            {
              // TODO: get status list from config
              var json = model.toJSON()
              
              json.isNew      = isNew
              json.statusList = [ 'draft', 'active', 'hidden', 'sold_out', 'coming_soon' ]

              view
                .setValue( 'model', model )
                .displayTpl( json )
                .render()
            }
        }, this )
      }
  }


  // VIEWS
  // --------------------------------

  // Product sheet view
  var ProductEntry = 
  {
      _viewName:     'ProductEntry'
    , _viewTpl:      TPL.products.entry

    , onInitialize: function()
      {
        // add view's event
        this.addEvents( {'click a.js-trigger-categories':  'categoriesPopupOpen'} )
      }

    , onRenderAfter: function( tplData )
      {
        this.$el.find('ul.sortable').sortable()

        // !! always set form after html render
        this.setForm({
            id:       'subbly-product-entry'
          , rules:    this.model.getRules()
          , skip:     false
        })
      }

    , categoriesPopupOpen: function()
      {
        var scope  = this
          , $modal = $( document.getElementById('modal') )

        this.modal = Subbly.api('Subbly.View.Modal', 
        {
            message:  'xhr.responseJSON.message'
          , tpl:      TPL.products.categories
          , onShown:  function()
            {
              $modal.find('div.nano').nanoScroller()
              $modal.find('ul.sortable').sortable({
                  handle: '.js-handle'
                , items:  'li'
              })
            }
          , onCancel: function()
            {
              // scope.settings.onCancel()
              scope.modal.close()
            }
          , onSubmit: function()
            {
              // scope.callXhr()
            }
        })
      }

    , onSubmit: function()
      {
        Subbly.store( this.model, this.getFormValues(), 
        {
          onSuccess: function( model, response )
          {
            Subbly.trigger( 'hash::change', 'products' )
          }
        })
      }
  }



  // REGISTER PLUGIN
  // --------------------------------


  Subbly.register( 'Subbly', 'Products', 
  {
      'ViewForm:ProductEntry': ProductEntry
    , 'Controller:Product':    Product
  })
