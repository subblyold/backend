
// Subbly's Backbone base collection

var SubblyCollection = Backbone.Collection.extend(
{
    parse: function ( response ) 
    {
      return response.response[ this.serviceName ]
    }

  , url: function()
    {
      return subbly.apiUrl( this.serviceName )
    }

  , credentials: function() 
    {
      return subbly.getCredentials()
    }

  , fetch: function( options ) 
    {
      options = options || {}

      var data = options.data || {}
      
      if( this.queryParams )
        options.data = $.extend( this.queryParams(), options.data )

      return Backbone.Collection.prototype.fetch.call( this, options )
    }

  , isEmpty: function()
    {
      if( !this.length )
        return true

      // special case
      // as we call API collection with '{}' as default args
      // the collection can not have zero model
      // but first model will never have `id` attribute
      // this is not reliable, cause we can create 
      // a new collection with a new model
      // but better than nothing
      return ( this.models[0] && _.isUndefined( this.models[0].get( this.models[0].idAttribute ) ) )
    }
})