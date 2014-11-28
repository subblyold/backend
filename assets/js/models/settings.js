
// Subbly's Backbone base model

Components.Subbly.Model.Settings = Backbone.Model.extend(
{
    serviceName:  'settings'

  , url: function()
    {
      return subbly.apiUrl( this.serviceName )
    }

  , credentials: function() 
    {
      return subbly.getCredentials()
    }

  , parse: function ( response ) 
    {
      return response.response[ this.serviceName ]
    }
})
