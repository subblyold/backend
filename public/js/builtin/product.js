
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
        var isNew      = ( sku === '_new' )
          , opts       = ( isNew ) ? {} : { sku: sku }
          , product    = Subbly.api('Subbly.Model.Product', opts )
          , categories = Subbly.api('Subbly.Collection.Categories')
          , view       = this.getViewByPath( 'Subbly.View.ProductEntry' )
        
        view.displayTpl()

        // Handle AJAX sync exemple
        // we need to call product desc + categories list

        // product promise
        var deferredProduct = Subbly.fetch( product,
        {
            data: { includes: ['options', 'images', 'categories'] }
        }, this )

        // categories promise
        var deferredCategories = Subbly.fetch( categories )

        // when both are loaded
        $.when( deferredProduct, deferredCategories )
          .done(function ( productResponse, categoriesResponse ) 
          {
              var categories = Subbly.parsePromise( categoriesResponse )['categories']

              Subbly.parsePromise( productResponse, {
                success: function( response )
                {
                  product = Subbly.api('Subbly.Model.Product', response['product'] )

                  // TODO: get status list from config
                  var json = product.toJSON()

                  json.isNew      = isNew
                  json.statusList = [ 'draft', 'active', 'hidden', 'sold_out', 'coming_soon' ]

                  view
                    .setValue( {
                        'model':      product 
                      , 'categories': categories
                    })
                    .displayTpl( json )
                    .render()
                    .updateCategories()
                }
              })
          })
          .fail(function() // if one fail
          {
console.log( this )
          })
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
        this.addEvents( {
            'click a.js-trigger-categories':      'categoriesOpenPopup'
          , 'click a.js-remove-category-trigger': 'removeCategory'
        })
        
        // register sub-views
        this.thumbTpl = Handlebars.compile( TPL.products.thumb )
        this.catTpl   = Handlebars.compile( TPL.products.categoriesList )

        Handlebars.registerPartial( 'productThumb', TPL.products.thumb )
        Handlebars.registerPartial( 'categoriesList', TPL.products.categoriesList )

        Subbly.on( 'categories::close', this.categoriesClosePopup, this )
      }

    , onRenderAfter: function( tplData )
      {
        // !! always set form after html render
        this.setForm({
            id:       'subbly-product-entry'
          , rules:    this.model.getRules()
          , skip:     false
        })

        // Images upload
        // ---------------------
        this.initUploader()

        // Images sort
        // ---------------------
        this.initSortable()

        // Categories
        // ---------------------
        // this.$categoriesList = this.$el.find('ul.product-categories')

        this.model.on('change:categories', this.updateCategories, this )
      }

    , initUploader: function()
      {
        //bind Uploader
        var $fileupload     = $( document.getElementById('subbly-product-img-upload') )
          , $uploadButton   = $( document.getElementById('js-trigger-loadimg') )
          , $imagesList     = $( document.getElementById('product-images-list') )
          , _feedback       = Subbly.feedback()
          , page            = this

        // additional form data
        var formData = {
            sku:       ( this.model.isNew() ) ? false : this.model.get('sku')
          , file_type: 'product_image'
        }

        // bind upload and callbacks
        this.uploader = new Uploader( $fileupload, {
            $dropZone: $uploadButton
          , done:      function( e, data )
            {
              var response = data.jqXHR.responseJSON.response

              if( response.file )
              {
                if( response.file.sku == 'false' )
                {
                  page.model.setAdditonalParams( 'product_image[]', {
                    filename: response.file.filename
                  })
                }

                // TODO: find a solution to mix upload/data display
                var thumb = page.thumbTpl({
                  filename: response.file.file_path
                })

                $imagesList.append( thumb )

                $( document.getElementById('product-images') ).find('div.nano').nanoScroller({ scroll: 'bottom' })
              }

              // TODO: display image into list
              _feedback.progressEnd( 'success', 'Upload done' )
            }
          , add:       function( e, data )
            {
              // Call parent `add` method
              Uploader.prototype.add.apply( this, arguments )

              _feedback.add()

              //this.thumbTpl
            }
          , progress:  function( e, data )
            {
              var progress = parseInt( data.loaded / data.total * 100, 10 )

              _feedback.setProgress( progress )
            }
          , formData:  formData
          , url:       Subbly.apiUrl('uploader')
        })
      }

    , initSortable: function()
      {
        var _feedback       = Subbly.feedback()
          , page            = this

        // allow to sort images
        this.sortable = new sortable( this.$el.find('ul.sortable'), 
        {
            idAttribute: 'uid'
          , url:         this.model.serviceName + '/' +  this.model.get('sku') + '/images/sort' 
          , onSuccess:   function( json )
            {
              _feedback.progressEnd( 'success', 'Product images updated' )
            }
          , onError: function( json )
            {
              _feedback.progressEnd( 'success', 'Whoops, problem' )
            }
          , onUpdate: function( json )
            {
              _feedback.add().progress()
            }
        })
      }

    , loadCategories: function()
      {
        console.log( this.categories )
        console.log( this.model.getCategories() )

        var modelCatIds = this.model.getCategoriesIds()
          , categories  = []
          , isChildren  = []
          , hasChildren = []

        var modelCategories = _.filter( this.categories, function( category )
        {
          if( modelCatIds.indexOf( category.id ) === -1 )
            return false

          if( !_.isNull( category.parent ) )
          {
            if( !hasChildren[ category.parent ] )
              hasChildren[ category.parent ] = []

            hasChildren[ category.parent ].push( category.id )

            hasChildren.push( category.id )

            // isChildren.push( category.parent )
          }

          return category
        }, this)

        return _.filter( modelCategories, function( category )
        {
          category.asString = ''

          if( !_.isNull( category.parent ) )
          {
            var parentId = +category.parent
              , parent   = _.filter( this.categories, function( cat ) 
                {
                  return cat.id == parentId 
                })

            if( parent.length == 1 )
              category.asString = parent[0].label + ' > ' + category.label
            else
              return false
          }
          else
          {
            if( hasChildren.indexOf( category.id ) !== -1 )
              category.asString = category.label
            else
            {
console.log( 'exclude ' + category.label )
              return false
            }
          }

          return category
        }, this)

      }

    , categoriesOpenPopup: function()
      {
        this.modal = Subbly.api('Subbly.View.Categories', {
            selectedIds: this.model.getCategoriesIds()
          , view:    this
        })
      }

    , categoriesClosePopup: function( categories )
      {
        var productId        = this.model.get('id')
          , categoriesIds    = []
          , categoriesModels = []

        _.each( categories.models, function( category )
        {
          categoriesIds.push( category.get('id') )
          categoriesModels.push( category.toJSON() )

          return category
        })

        this.model.set( 'categories', categoriesModels )
        this.model.setAdditonalParams( 'product_category[]', categoriesIds )
      }

    , updateCategories: function()
      {
        var html = this.catTpl( { categories: this.loadCategories() })

        this.$el.find('ul.product-categories').html( html )
      }

    , removeCategory: function( event )
      {
        var target     = event.currentTarget
          , catId      = target.getAttribute('data-id')
          , categories = this.model.get('categories')

        categories = _.reject( categories, function( category )
        {
          return category.id === +catId 
        })

        this.model.set( 'categories', categories )
      }

      // Save form update
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

      // unbind events
    , onClose: function()
      {
        Subbly.off( 'categories::close', this.categoriesClosePopup, this )
        this.model.off('change:categories', this.updateCategories, this )
      }
  }



  // REGISTER PLUGIN
  // --------------------------------


  Subbly.register( 'Subbly', 'Products', 
  {
      'ViewForm:ProductEntry': ProductEntry
    , 'Controller:Product':    Product
  })
