<?

return array(
    'site' => [
        'status' => [
            'online'
          , 'offline'
        ]
    ]
  , 'locales' => [
        'list' => [
            'en' => 'English'
          , 'fr' => 'Français'
        ]
      , 'resources' => '/themes/backend/assets/locales/{{locale}}.json'
    ]
  , 'currencies' => [
        'USD'
      , 'EUR'
    ]
  , 'order' => array(
        'status' => [
            'draft'
          , 'active'
          , 'hidden'
          , 'sold_out'
          , 'coming_soon' 
        ]
    )
);