
Components.Subbly.Model.Product = SubblyModel.extend(
{
    idAttribute:  'sku'
  , serviceName:  'products'
  , singleResult: 'product'

  , getImages: function()
    {
      if( this.get('images') )
      {
        return this.get('images')
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
