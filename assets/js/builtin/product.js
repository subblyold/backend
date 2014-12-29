
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
        this.addEvents( {'click a.js-trigger-categories':  'categoriesOpenPopup'} )
        
        this.thumbTpl = Handlebars.compile( TPL.products.thumb )
        Handlebars.registerPartial( 'productThumb', TPL.products.thumb )

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
          , url:       Subbly.apiUrl('uploader') //Subbly.apiUrl('products/' + this.model.get('sku') + '/images')
        })

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

    , categoriesOpenPopup: function()
      {
        this.modal = Subbly.api('Subbly.View.Categories', {
            product: this.model
          , selectedIds: this.model.getCategoriesIds()
          , view:    this
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

    , categoriesClosePopup: function( categories )
      {
        var productId       = this.model.get('id')
          , categoriesData  = []

        _.each( categories.models, function( category )
        {
          categoriesData.push( category.get('id') )

          return category
        })

        if( !categoriesData.length )
          return

        if( this.model.isNew() )
        {
          this.model.setAdditonalParams( 'product_category[]', categoriesData )
        }
        else
        {
console.log('POST new categories')
        }

console.log( this.model.getAdditonalParams())
      }

    , onClose: function()
      {
        Subbly.off( 'categories::close', this.categoriesClosePopup, this )
      }
  }



  // REGISTER PLUGIN
  // --------------------------------


  Subbly.register( 'Subbly', 'Products', 
  {
      'ViewForm:ProductEntry': ProductEntry
    , 'Controller:Product':    Product
  })
