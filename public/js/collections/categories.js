
Components.Subbly.Collection.Categories = SubblyCollection.extend(
{
    model:       Components.Subbly.Model.Category
  , serviceName: 'categories'

  , comparator: function( model )
    {
        return model.get('position')
    }

  , getParent: function()
    {
      return _.filter( this.models, function( category )
      {
        return ( _.isNull( category.get('parent') ) )
      })
    }

  , getChildren: function( id )
    {
      return _.filter( this.models, function( category )
      {
        return ( category.get('parent') == id )
      })
    }
})