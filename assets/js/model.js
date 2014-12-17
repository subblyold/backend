
// Subbly's Backbone base model

var SubblyModel = Backbone.Model.extend(
{
    additonalParams: {}

  , url: function()
    {
      var baseUrl = Subbly.apiUrl( this.serviceName )

      if( this.isNew() )
        return baseUrl

      return baseUrl + '/' + this.id
    }

  , credentials: function() 
    {
      return Subbly.getCredentials()
    }

  , parse: function ( response ) 
    {
      // single item api call 
      if( response.response )
          return response.response[ this.singleResult ]

      // collection fetch
      return response
    }

  , setAdditonalParams: function( key, value )
    {
      var isArray = ( key.indexOf( '[]', key.length - 2 ) !== -1 )
        , scope   = this

      if( isArray )
      {
        key = key.substring( 0, key.length - 2 )

        if( _.isUndefined( this.additonalParams[ key ] ) )
          this.additonalParams[ key ] = []
      }

      if( isArray )
      {
        this.additonalParams[ key ].push( value )
      }
      else
      {
        this.additonalParams[ key ] = value
      }
    }

  , getAdditonalParams: function()
    {
      return this.additonalParams || {}
    }

  , getNested: function( property, defaults )
    {
      return Helpers.getNested( this.attributes, property, defaults || false )
    }
})