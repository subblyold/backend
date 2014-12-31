var SubblyCollectionSearch

Components.Subbly.Collection.Search = SubblyCollectionSearch = 
{
    url: function()
    {
      return Subbly.apiUrl( this.serviceName + '/search' )
    }
}
