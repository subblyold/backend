
var sortable = function( $el, options )
{
  var scope    = this
    , defaults = {
          helper:      'clone'
        , cursor:      'move'
        // , handle:      '.js-handle'
        , containment: 'parent'
        , cursorAt:    { top:1 }
        // , appendTo:     document.body
        , placeholder: 'sortable-placeholder'
        , start:       function( e, ui )
          {
            scope.$el.find('li.sortable-placeholder').height( ui.helper.outerHeight() )
          }
        , stop:        function()
          {
            Subbly.trigger( 'form::changed' )
            Subbly.trigger( 'document::change' )
          }
      }

  this.$el      = $el
  this.settings = $.extend( {}, defaults, options || {} )

  this.$el.sortable( this.settings )
}

sortable.prototype.destroy = function()
{
  this.$el.sortable( 'destroy' )
}
