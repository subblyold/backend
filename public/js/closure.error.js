
  var serverError = function( xhr )
  {
    var isJson    = ( xhr.responseJSON )
    
    this._response   = false
    this._message    = false
    this._status     = xhr.status
    this._statusText = xhr.statusText

    if( isJson )
    {
      this._response = ( xhr.responseJSON.response )
                      ? xhr.responseJSON.response
                      : false

      this._message  = ( this._response && this._response.error )  
                      ? this._response.error 
                      : false
    }
  }

  // Generic method to get property
  //
  //      @params  {string}  property name
  //      @return  {mixed}
  //
  serverError.prototype.getProperty = function( property, defaults )
  {
    if( _.isUndefined( this[ property ] ) )
      return false

    return ( this[ property ] ) 
           ? this[ property ]
           : defaults || false
  }

  // Get error message
  //
  //      @return  {string}
  //
  serverError.prototype.message = function()
  {
    return this.getProperty( '_message', 'no error message' )
  }

  // Get error status code
  //
  //      @return  {string}
  //
  serverError.prototype.status = function()
  {
    return this.getProperty( '_status' )
  }

  // Get error status text
  //
  //      @return  {string}
  //
  serverError.prototype.statusText = function()
  {
    return this.getProperty( '_statusText' )
  }




  // Global error handler for backbone.js ajax requests
  // http://stackoverflow.com/a/6154922
  // 
  $document.ajaxError( function( e, xhr, options )
  {
    var error = new serverError( xhr )

    // request was aborted
    // no need to log this
    if( 
        error.status() === 0 
        && error.statusText() === 'abort' 
      )
    {
      console.info( 'Aborted request' )
      return
    }

    console.group('Ajax Error')
    console.log( error.status() )
    console.log( error.statusText() )
    console.log( error.message() )
    console.groupEnd()

    if( error.status() === 401 )
    {
      Subbly.trigger( 'user::logout', message )
      return 
    }

    // if( xhr.status === 418 )
    //   return 
  })
