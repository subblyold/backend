
Components.Subbly.View.Modal = Backbone.View.extend(
{
    el:       '#modal'
  , defaults: 
    {
        title:   false
      , message: 'One fine body…'
      , onSubmit: function(){}
      , onCancel: function(){}
      , onShow:   false
      , onShown:  false
      , onHide:   false
      , onHidden: false
    }

  , initialize: function( options )
    {
      this.defaults.cancel  = __('label.cancel')
      this.defaults.success = __('label.save')

      this.settings = $.extend( {}, this.defaults, options || {} )

      this.settings.tpl = this.settings.tpl || TPL.layout.modal

      var tpl  = Handlebars.compile( this.settings.tpl )
        , html = tpl( this.settings )

      if( _.isFunction( this.settings.onShow ) )
        this.$el.on( 'show.bs.modal', this.settings.onShow )

      if( _.isFunction( this.settings.onShown ) )
        this.$el.on( 'shown.bs.modal', this.settings.onShown )

      if( _.isFunction( this.settings.onHide ) )
        this.$el.on( 'hide.bs.modal', this.settings.onHide )

      if( _.isFunction( this.settings.onHidden ) )
        this.$el.on( 'hidden.bs.modal', this.settings.onHidden )

      this.$el.html( html ).modal('show')

      if( _.isFunction( this.settings.setUp ) )
        this.settings.setUp()
    }

  , events: {
        'click button.btn-success': 'onSuccess'
      , 'click button.btn-default': 'onDefault'
    }

  , onSuccess: function()
    {
      if( _.isFunction( this.settings.onSubmit ) )
        this.settings.onSubmit()

      this.$el.modal('hide')
    }

  , onDefault: function()
    {
      if( _.isFunction( this.settings.onCancel ) )
        this.settings.onCancel()
    }

  , close: function()
    {
      if ( this.onClose )
        this.onClose()

      this.$el.html('')
      this.$el.unbind()
      this.unbind()
      this.undelegateEvents()
    }
})
