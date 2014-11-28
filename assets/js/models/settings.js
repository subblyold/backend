
// Subbly's Backbone base model

Components.Subbly.Model.Settings = Backbone.Model.extend(
{
    serviceName:  'settings'
  , singleResult: 'settings'

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

  , getAsObject: function()
    {
      var settings = {
          siteStatusList: subbly.getConfig('siteStatus')
        , backendLocales: subbly.getConfig('locales')
      }

      _.each( this.attributes, function( value, key )
      {
        Helpers.setNested( settings, key, value )
      })
      
      return settings
    }
})
