
var sortable = function( $el, options )
{
  var scope    = this
    , promise  = false
    , defaults = {
          helper:      'clone'
        , cursor:      'move'
        , idAttribute: 'id'
        // , handle:      '.js-handle'
        , containment: 'parent'
        , cursorAt:    { top:1 }
        // , appendTo:     document.body
        , placeholder: 'sortable-placeholder'
        , start:       function( e, ui )
          {
            // scope.$el.find('li.sortable-placeholder').height( ui.helper.outerHeight() )
            var $element = $( ui.item ).parent('ul').find('li.sortable-placeholder')

            $element.height( ui.helper.outerHeight() )
            $element.width( ui.helper.outerWidth() )
          }
        , stop:        function()
          {
            Subbly.trigger( 'form::changed' )
            Subbly.trigger( 'document::change' )
          }
        , update:      function( e, ui )
          {
            var $sorted    = ui.item
              , $previous  = $sorted.prev()
              , moveType   = ( $previous.length > 0 )
                             ? 'moveAfter'
                             : 'moveBefore'
              , movedId    = ( $previous.length > 0 )
                             ? $previous.data( scope.settings.idAttribute )
                             : $sorted.next().data( scope.settings.idAttribute )

            if( scope.settings.onUpdate && _.isFunction( scope.settings.onUpdate ) )
              scope.settings.onUpdate()

            promise = new xhrCall(
            {
                url:     scope.settings.url
              , setAuth: true
              , type:    'PUT'
              , data: 
                {
                  sortable: 
                  {
                      type:     moveType
                    , movingId: $sorted.data( scope.settings.idAttribute )
                    , movedId:  movedId
                  }
                }
              , success: function( json )
                {
                  if( scope.settings.onSuccess && _.isFunction( scope.settings.onSuccess ) )
                    scope.settings.onSuccess()
                }
              , error: function( json )
                {
                  if( scope.settings.onError && _.isFunction( scope.settings.onError ) )
                    scope.settings.onError()
                }
            })
          }
      }

  this.$el      = $el
  this.settings = $.extend( {}, defaults, options || {} )

  if( !this.settings.url )
    throw new Error( 'sortable need an URL' )

  this.$el.sortable( this.settings )

  return promise
}

sortable.prototype.destroy = function()
{
  this.$el.sortable( 'destroy' )
}
