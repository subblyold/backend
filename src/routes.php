<?php

/*
 * Register Backend routes before public routes.
 */

Route::group(array(
    'prefix' => '/backend'
), function() {

    $displayBackend = function()
    {
      return View::make('backend')->with( 'environment', App::environment() );
    };

    Route::get( '/' ,     $displayBackend );
    Route::get( '{url}' , $displayBackend )->where('url', '.*');
});
