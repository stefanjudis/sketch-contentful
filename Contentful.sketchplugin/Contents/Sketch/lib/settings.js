@import 'utils.js';

function openSettings( context ) {
  initContext( context );

  var window = createWindow( {
    spaceId : command.valueForKey_onDocument_forPluginIdentifier(
      'spaceId',
      docData,
      'contentful'
    ),
    cdaToken : command.valueForKey_onDocument_forPluginIdentifier(
      'cdaToken',
      docData,
      'contentful'
    )
  });

  var alert = window[ 0 ];
  var inputs = window[ 1 ];

  var response = alert.runModal();

  // save button was pressed
  if ( response === 1000 ) {
    command.setValue_forKey_onDocument_forPluginIdentifier(
      inputs[ 0 ].stringValue(),
      'spaceId',
      docData,
      'contentful'
    );

    command.setValue_forKey_onDocument_forPluginIdentifier(
      inputs[ 1 ].stringValue(),
      'cdaToken',
      docData,
      'contentful'
    );
  }
}
