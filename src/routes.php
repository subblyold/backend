<?php

/*
 * Register Backend routes before public routes.
 */

Route::group(array(
    'prefix' => Config::get( 'subbly.backendUri', '/backend' )
), function() {

    $displayBackend = function()
    {
      return View::make('backend::backend')->with( 'environment', App::environment() );
    };

    Route::get( '/' ,     $displayBackend );
    Route::get( '{url}' , $displayBackend )->where('url', '.*');
});

/*
 * Return empty response.
 * Allow natural autocomplete on ajax form
 */

Route::any('/void', function()
{
    $response = Response::make( array(), 204 );

    $response->header('Content-Type', 'json');

    return $response;
});

/*
 * Return JSON of all the Backend templates
 */

Route::get('/static/templates', function()
{
  $path = __DIR__ . '/views/tpl/';
  
  $files = File::allFiles( $path );
  $arr = array();

  foreach( $files as $file )
  {
    $filename    = str_replace( $path, '',  str_replace('.tpl', '', (string) $file ) );
    $tmp         = array_filter( explode( '/', $filename ) );
    $content     = File::get( (string) $file, '' );
    $html        = trim( preg_replace('/\s+/', ' ',preg_replace('/<!-- (.*)-->/Uis', '', $content) ) );
    $dotpath     = implode( '.', $tmp );

    array_set( $arr, $dotpath, $html );
  }

  $contents = 'var TPL = ' . json_encode( $arr );

  $response = Response::make($contents, 200 );
  $response->header('Content-Type', 'application/javascript');
  return $response;
});
