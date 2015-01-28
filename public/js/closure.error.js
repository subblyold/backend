
  // Global error handler for backbone.js ajax requests
  // http://stackoverflow.com/a/6154922
  $document.ajaxError( function( e, xhr, options )
  {
    var isJson     = ( xhr.responseJSON )
      , response = false
      , message  = false

    if( isJson )
    {
      response = ( xhr.responseJSON.response )
                 ? xhr.responseJSON.response
                 : false

      message = ( response && response.error )  
                ? response.error 
                : false
    }

    // request was aborted
    // no need to log this
    if( 
        xhr.status === 0 
        && xhr.statusText === 'abort' 
      )
    {
      console.info( 'Aborted request' )
      return
    }

    console.group('Ajax Error')
    console.log( xhr )
    console.log( xhr.status )
    console.log( xhr.responseJSON )
    console.log( ( message ) ? message : 'no error message' )
    console.groupEnd()

    if( xhr.status === 401 )
    {
      Subbly.trigger( 'user::logout', message )
      return 
    }

    // if( xhr.status === 418 )
    //   return 
  })
