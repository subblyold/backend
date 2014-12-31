
Components.Subbly.View.Categories = Backbone.View.extend(
{
    el:                 '#modal'
  , parentCategory:     null

  , initialize: function( options )
    {
      // this.$el = $( document.getElementById('modal') )

      this.selectedIds = options.selectedIds || []

      // this.modelCategories = this.product.getCategoriesIds()

      // this.product = options.product

      var tpl  = Handlebars.compile( TPL.products.categoriesPopin )
        , html = tpl( {} )

      this.$el.on( 'shown.bs.modal',  _.bind( this.display, this ) )
      this.$el.on( 'hidden.bs.modal', _.bind( this.onClose, this ) )

      this.$el.html( html ).modal('show')

      return this
    }

  , events: {
        'click button.btn-success':                       'onSuccess'
      , 'click button.btn-default':                       'onDefault'
      , 'click ul.catgories-list li[data-parent="null"]': 'renderSubCategory'
      , 'blur li.js-new-item input':                      'blurInput'
      , 'keypress li.js-new-item input':                  'onEnter'
      , 'click a.js-add-category':                        'addCategory'
      , 'click a.js-add-subcategory':                     'addSubCategory'
      , 'click i.js-delete':                              'deleteCategory'
      , 'change input.js-manage-categories':              'manageCategory'
    }

  , showScroller: function()
    {
      this.$el.find('div.nano').nanoScroller()      
    }

  , scrollBottom: function( $holder )
    {
      $holder
        .find('div.nano')
        .nanoScroller({ scroll: 'bottom' })
    }

  , removeFocus: function()
    {
      this.$categoriesList.find('li').removeClass('active')
      this.$subCategoriesList.find('li').removeClass('active')
    }

  , display:  function()
    {
      this.showScroller()

      this.sortable = new sortable( this.$el.find('ul.sortable'), 
      {
          idAttribute: 'id'
        , url:         'categories/sort' 
        , onSuccess:   function( json )
          {
            // feedback.progressEnd()
          }
        , onError: function( json )
          {
            // feedback.progressEnd( 'error', 'Whoops, problem' )
          }
        , onUpdate: function( json )
          {
            // feedback.add().progress()
          }
      })   

      var categories = Subbly.api('Subbly.Collection.Categories')
        , scope      = this

      this.$categoriesList       = this.$el.find('div.modal-main-catgories')
      this.$subCategoriesList    = this.$el.find('div.modal-sub-catgories')
      this.$subCategoriesTrigger = this.$el.find('a.js-add-subcategory') 

      Subbly.fetch( categories, {
        success: function( collection, response )
        {
          scope.collection = collection

          scope.renderCategories( collection )

          scope.$subCategoriesList
            .find('div.fetch-holder')
            .addClass('rendering idle')
        }
      })
    }

  , renderCategories: function( collection )
    {
      this.fragment = document.createDocumentFragment()

      _.each( collection.getParent(), this.renderItem, this )

      this.$categoriesList
        .find('ul.sortable')
        .html( this.fragment )

      this.fragment = false

      this.$categoriesList
        .find('div.fetch-holder')
        .removeClass('rendering loading')
    }

  , renderSubCategory: function( event )
    {
      var target = event.currentTarget
        , id     = target.getAttribute('data-id')

      if( _.isNull( id ) )
        return

      var fetcher = this.$subCategoriesList.find('div.fetch-holder')

      fetcher.removeClass('rendering idle empty')

      fetcher.addClass('rendering loading')

      this.cleanSubCategories()
      target.classList.add('active')

      this.parentCategory = id

      var children = this.collection.getChildren( id )

      if( children.length )
      {
        this.fragment = document.createDocumentFragment()

        _.each( children, this.renderItem, this )

        this.$subCategoriesList
          .find('ul.sortable')
          .html( this.fragment )
        
        this.fragment = false
      }

      fetcher.removeClass('rendering loading')

      if( !children.length )
        fetcher.addClass('rendering empty')

      this.$subCategoriesTrigger
        .removeClass('dp-n')
    }

  , cleanSubCategories: function()
    {
      this.$subCategoriesList
        .find('ul.sortable')
        .html('')

      this.removeFocus()

      this.$subCategoriesTrigger
        .addClass('dp-n')
    }

  , renderItem: function( model )
    {
      // <li>
      //   <i class="icon icon-handler js-handle"></i>
      //   <label>
      //     <span class="input-checkbox-category"></span>
      //     <input type="checkbox" class="js-manage-categories">
      //   </label>
      //   Women
      //   <span class="badge">2</span>
      //   <i class="icon icon-trash"></i>
      // </li>

      var liItem     = document.createElement('li')
        , handler    = document.createElement('i')
        , checkLabel = document.createElement('label')
        , checkSpan  = document.createElement('span')
        , checkbox   = document.createElement('input')
        , trash      = document.createElement('i')
        , parent     = model.get('parent')


      handler.className = 'icon icon-handler js-handle'
      trash.className   = 'icon icon-trash js-delete'

      checkbox.type       = 'checkbox'
      checkbox.className  = 'js-manage-categories'
      checkbox.dataset.id = model.id

      if( this.belongToSeleted( model.id ) )
        checkbox.checked = true

      if( !_.isNull( parent ) )
        checkbox.dataset.parent = parent

      checkLabel.appendChild( checkbox )

      checkSpan.className = 'input-checkbox-category'
      checkLabel.appendChild( checkSpan )

      liItem.appendChild( handler )
      liItem.appendChild( checkLabel )
      liItem.appendChild( document.createTextNode( model.get('label') ) )

      if( _.isNull( parent ) )
      {
        var badge = document.createElement('span')

        var children = this.collection.getChildren( model.id )
          , selected = 0

        _.each( children, function( child )
        {
          if( this.belongToSeleted( child.id ) )
            ++selected
        }, this )

        badge.className         = 'badge'
        badge.dataset.selected  = selected
        badge.dataset.id        = model.id

        badge.appendChild( document.createTextNode( selected ) )
        
        liItem.dataset.parent   = 'null'

        liItem.appendChild( badge )
      }
      else
      {
        liItem.dataset.parent   = model.get('parent')
      }

      liItem.appendChild( trash )

      liItem.dataset.id = model.get('id')

      if( this.fragment )
        this.fragment.appendChild( liItem )
      else
        return liItem
    }

  , displayItemForm: function( $list, $holder )
    {
      var liItem = document.createElement('li')
        , input  = document.createElement('input') 

      input.type           = 'text'
      input.className      = 'input-label'
      input.placeholder    = __('labels.newCategory')
      input.dataset.list   = $holder[0].getAttribute('data-list')
      input.dataset.parent = 'null' 

      if( this.parentCategory )
        input.dataset.parent = this.parentCategory

      liItem.appendChild( input )

      liItem.className = 'js-new-item'

      $holder
        .find('ul.sortable')
        .append( liItem )

      this.scrollBottom( $holder )

      input.focus()
    }

  , addCategory: function()
    {
      this.displayItemForm( this.$categoriesList, this.$categoriesList )
      this.cleanSubCategories()
    }

  , addSubCategory: function()
    {
      this.$subCategoriesList
        .find('div.fetch-holder')
        .removeClass('rendering idle empty loading')

      this.displayItemForm( this.$categoriesList, this.$subCategoriesList )
    }

  , blurInput: function( event )
    {
      var target = event.target

      if( _.isBlank( target.value ) )
      {
        // $( target ).parents('li').remove()
      }
    }

  , onEnter: function( event )
    {
      if (event.keyCode != 13) 
        return

      var value = event.target.value

      if( _.isBlank( value ) )
        return

      // prevent bubbling
      event.stopPropagation()
      event.preventDefault()

      var newCategory = Subbly.api('Subbly.Model.Category')
        , $target     = $( event.target )
        , $list       = $( 'div.' + $target.attr('data-list') )
        , scope       = this
        , data        = {
              label:  value
            , slug:   _.slugify( value )
          }

      var parent = $target.attr('data-parent')

      if( parent != 'null' )
        data.parent = parent

      Subbly.store( 
          newCategory
        , data
        , {
            onSuccess: function( model, response, opts )
            {
              scope.collection.add( model )

              var html = scope.renderItem( model )

              $target
                .parents('li')
                .remove()

              $list
                .find('ul.sortable')
                .append( html )

              scope.scrollBottom( $list )
            }
        })
    }

  , deleteCategory: function( event )
    {
      // prevent bubbling
      event.stopPropagation()
      event.preventDefault()

      var $target = $( event.currentTarget ) 
        , id      = $target.parents('li').attr('data-id')
        , model   = this.collection.get( id )

      model.destroy()

      // this.xhr = $.ajax({
      //       url:  this.url
      //     , type: 'DELETE'
      //   })
    }

  , manageCategory: function( event )
    {
      var target  = event.currentTarget
        , catId   = target.getAttribute('data-id')
        , parent  = target.getAttribute('data-parent')
        , $parent = false

      if( parent )
        $parent = this.$el.find('li[data-id="' + parent + '"]')

      if( target.checked )
      {
        this.addToSeleted( catId )
      }
      else
      {
        this.removeFromSelected( catId )
      }

      if( $parent )
      {
        var $badge    = $parent.find('span.badge')
          , selected  = +$badge.attr('data-selected')
          , $checkbox = $parent.find('input.js-manage-categories')

        selected = ( target.checked ) ? ( selected + 1 ) : ( selected - 1 )

        $badge
          .attr('data-selected', selected )
          .html( selected ) 

        $checkbox.prop('checked', target.checked )

        $checkbox.trigger('change')
      }
    }

  , belongToSeleted: function( catId )
    {
      return ( this.selectedIds.indexOf( catId ) !== -1 )
    }

  , addToSeleted: function( catId )
    {
      if( !this.belongToSeleted( catId ) )
      {
        this.selectedIds.push( +catId )
      }
    }

  , removeFromSelected: function( catId )
    {
      this.selectedIds = _.reject( this.selectedIds, function( id )
      {
        return id == catId 
      })
    }

  , onClose: function()
    {
      var collection = Subbly.api('Subbly.Collection.Categories')

      _.each( this.selectedIds, function( modelId )
      {
        collection.add( this.collection.get( modelId ) )
      }, this)

      Subbly.trigger( 'categories::close', collection )

      this.$el.html('')
      this.$el.unbind()
      this.unbind()
      this.undelegateEvents()
    }

  , onSuccess: function()
    {
      this.$el.modal('hide')
    }

  , onCancel: function()
    {
console.log('categories modal onCancel')
      // scope.settings.onCancel()
      // scope.modal.close()
    }

  , onSubmit: function()
    {
console.log('categories modal onSubmit')
      // scope.callXhr()
    }
})
