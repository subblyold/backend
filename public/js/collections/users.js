
Components.Subbly.Collection.Users = Components.Subbly.Collection.List.extend(
{
    model:       Components.Subbly.Model.User
  , serviceName: 'users'

  , comparator: function( model )
    {
      // prevent initiale sort
      // see `collection.js` for more details
      if( !_.isUndefined( model.get('lastname') ) )
      {
        var lastname  = model.get('lastname')
          , firstname = model.get('firstname') 
        return [ lastname.charAt(0).toLowerCase(), firstname.charAt(0).toLowerCase() ]
      }
    }
})