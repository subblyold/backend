
var Uploader = function( $fileupload, options )
{
  var noop     = function(){}
    , defaults = 
      {
          $dropZone:              false
        , $trigger:               false // click element
        , $progress:              false // progress bar
        , singleFileUploads:      true
        , limitMultiFileUploads:  5
        , limitConcurrentUploads: 2
        , acceptFileTypes:        /(\.|\/)(gif|jpe?g|png)$/i
        , drop:                   noop
        , progressall:            noop
        , done:                   noop
        , always:                 this.always
        , processfail:            noop
        , dragover:               noop
        , submit:                 this.submit
        , formData:               {}
      }

  this.$fileupload = $fileupload
  
  var settings = this.settings = $.extend( {}, defaults, options || {} )

  if( settings.$trigger )
  {
    settings.$trigger.click( function()
    {
      $fileupload.click()
    })    
  }

  $fileupload.fileupload({
      dataType:               'json'
    , url:                    settings.url
    , singleFileUploads:      settings.singleFileUploads
    , limitMultiFileUploads:  settings.limitMultiFileUploads
    , limitConcurrentUploads: settings.limitConcurrentUploads
    , dropZone:               settings.$dropZone
    , replaceFileInput:       false
    , add:                    this.add
    , drop:                   settings.drop
    , progressall:            settings.progressall
    , done:                   settings.done
    , always:                 settings.always
    , processfail:            settings.processfail
    , submit:                 settings.submit
    , formData:               settings.formData
    , maxFileSize:            Subbly.getConfig('subbly.maxFileSize')
  })

  $document.on( 'dragover', settings.dragover )
}

Uploader.prototype.add = function( e, data )
{
  var valid       = true
    , maxFileSize = Subbly.getConfig('upload.maxFileSize')
    , maxSize     = Helpers.bytesToSize( maxFileSize )

  $.each( data.originalFiles, function( index,file )
  {
      console.info( file.name, file.size )

      if( file.size && file.size > maxFileSize )
      {
        valid = false
        console.warn( 'File "' + file.name + '" is too large ( ' + file.size + ' on max size: ' + maxSize + ')' )
      }
  })

  if( valid )
    data.submit()

}

Uploader.prototype.submit = function( )
{
  Subbly.trigger( 'loader::show' )
}

Uploader.prototype.always = function( e, data )
{
  Subbly.trigger( 'loader::hide' )

  var valid = true 

  $.each( data.result, function( index, file )
  {
    if( file.error ) 
    {
      valid = false
      App.feedback.add( 'warning', file.error )
    }
  })

  if( valid )
  {
    console.log( 'success', 'file(s) uplopaded' )
  }
}

Uploader.prototype.destroy = function( )
{
  this.$fileupload.fileupload('destroy')

  $document.off( 'dragover', this.settings.dragover )
}
