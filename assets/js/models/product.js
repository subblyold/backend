
Components.Subbly.Model.Product = SubblyModel.extend(
{
    idAttribute:           'sku'
  , serviceName:           'products'
  , singleResult:          'product'
  , categoriesIds:         false
  , onCreateAddCategories: false

    // Product categories
    // ------------------------

  , getCategories: function()
    {
      var categories = this.get('categories')

      if( !categories || !categories.length )
        return false

      categories = _.each( categories, function( category )
      {
        category.asString = ''

        if( !_.isNull( category.parent ) )
        {
          var parentId = +category.parent
            , parent   = _.filter( categories, function( cat ) { return cat.id == parentId })

          if( parent.length == 1 )
          category.asString = parent[0].label + ' > '
        }

        category.asString += category.label
      })

      return categories
    }

  , getCategoriesIds: function()
    {
      var categories = this.getCategories()

      if( !categories )
        return false

      // set cache
      this.categoriesIds = _.pluck( categories, 'id')

      return this.categoriesIds
    }

  , belongToCategory: function( catId )
    {
      if( !this.categoriesIds )
        this.categoriesIds = this.getCategoriesIds()

      if( !this.categoriesIds )
      {
        this.categoriesIds = []
        return false
      }

      return ( this.categoriesIds.indexOf( catId ) !== -1 )
    }

    // Product images
    // ------------------------

  , getImages: function()
    {
      if( this.get('images') )
      {
        return _.sortBy( this.get('images'), function( image ){ return image.position })
      }

      return false
    }

  , getDefaultImage: function()
    {
      var imgs = this.getImages()

      if( imgs )
        return imgs[0]

      return false
    }

    // Product JSON
    // ------------------------

    // override native method and
    // add customs objects to Handelbars
  , toJSON: function()
    {
      // get the standard json for the object
      var json = Backbone.Model.prototype.toJSON.apply( this, arguments )

      // add methods
      json.getImages       = this.getImages()
      json.getDefaultImage = ( json.getImages ) ? json.getImages[0] : false
      json.getCategories   = this.getCategories()

      // send it all back
      return json
    }

  // Rules
  // -------------------

  , getRules: function()
    {
      return [
          {
              name:    'status'
            , rules:   'required'
          }
        , {
              name:    'sku'
            , rules:   'required'
          }
        , {
              name:    'name'
            , rules:   'required'
          }
        , {
              name:    'description'
            , rules:   'required'
          }
        , {
              name:    'price'
            , rules:   'required|numeric'
          }
        , {
              name:    'sale_place'
            , rules:   'numeric'
          }
        , {
              name:    'quantity'
            , rules:   'required|numeric'
          }
      ]
    }
})
