
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
        this.thumbTpl = Handlebars.compile( TPL.products.thumb )

        this.$el.find('ul.sortable').sortable()

        // !! always set form after html render
        this.setForm({
            id:       'subbly-product-entry'
          , rules:    this.model.getRules()
          , skip:     false
        })

        //bind Uploader
        var $fileupload     = $( document.getElementById('subbly-product-img-upload') )
          , $uploadButton   = $( document.getElementById('js-trigger-loadimg') )
          , $imagesList     = $( document.getElementById('product-images-list') )
          , _feedback       = Subbly.feedback()
          , page            = this

        // Images upload
        // ---------------------

        // additional form data
        var formData = {
            sku:       ( this.model.isNew() ) ? false : this.model.get('sku')
          , file_type: 'product_image'
        }

        // upload callbacks
        var done = function( e, data )
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

        var add = function( e, data )
        {
          // Call parent `add` method
          Uploader.prototype.add.apply( this, arguments )

          _feedback.add()

          //this.thumbTpl
        }

        var progress = function( e, data )
        {
          var progress = parseInt( data.loaded / data.total * 100, 10 )

          _feedback.setProgress( progress )
        }

        // bind upload
        this.uploader = new Uploader( $fileupload, {
            $dropZone: $uploadButton
          , done:      done
          , add:       add
          , progress:  progress
          , formData:  formData
          , url:       Subbly.apiUrl('uploader') //Subbly.apiUrl('products/' + this.model.get('sku') + '/images')
        })  

        // allow to sort images
        this.sortable = new sortable( this.$el.find('ul.sortable') )
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
              new sortable( $modal.find('ul.sortable') )
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
