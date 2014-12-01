
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
        var scope   = this
          , isNew   = ( sku === '_new' )
          , opts    = ( isNew ) ? {} : { sku: sku }
          , product = subbly.api('Subbly.Model.Product', opts )

        subbly.fetch( product,
        {
            data: { includes: ['options', 'images', 'categories'] }
          , success: function( model, response )
            {
              // TODO: get status list from config
              var json = model.toJSON()
              
              json.isNew      = isNew
              json.statusList = [ 'draft', 'active', 'hidden', 'sold_out', 'coming_soon' ]

              scope.getViewByPath( 'Subbly.View.ProductEntry' )
                .setValue( 'model', model )
                .displayTpl( json )
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

    , onDisplayTpl: function( tplData )
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

        this.modal = subbly.api('Subbly.View.Modal', 
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
        subbly.store( this.model, this.getFormValues(), 
        {
          onSuccess: function( model, response )
          {
            subbly.trigger( 'hash::change', 'products' )
          }
        })
      }
  }



  // REGISTER PLUGIN
  // --------------------------------


  subbly.register( 'Subbly', 'Products', 
  {
      'ViewForm:ProductEntry': ProductEntry
    , 'Controller:Product':    Product
  })
