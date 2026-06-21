function aftership_tracker(num, slug, refresh) {
  const url = 'https://api.aftership.com/tracking/2026-01/trackings';
  const apiKey = 'API'; 
  
  const payloadData = {
    "tracking_number": num,
    "slug": slug
  };
  
  const postOptions = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'as-api-key': apiKey
    },
    'payload': JSON.stringify(payloadData),
    'muteHttpExceptions': true 
  };
  
  try {
    const response = UrlFetchApp.fetch(url, postOptions);
    const parsedJson = JSON.parse(response.getContentText());
    
    if (parsedJson.meta && parsedJson.meta.code === 4003) {
      Logger.log("Tracking already exists. Fetching latest status via GET...");
      
      const getUrl = `https://api.aftership.com/tracking/2026-01/trackings?tracking_numbers=${encodeURIComponent(num)}&slug=${encodeURIComponent(slug)}`;
      
      const getOptions = {
        'method': 'get',
        'contentType': 'application/json',
        'headers': {
          'as-api-key': apiKey
        },
        'muteHttpExceptions': true
      };
      
      const getResponse = UrlFetchApp.fetch(getUrl, getOptions);
      const getParsedJson = JSON.parse(getResponse.getContentText());
      
      if (getParsedJson.data && getParsedJson.data.trackings && getParsedJson.data.trackings.length > 0) {
        const latestStatus = getParsedJson.data.trackings[0].subtag_message; 
        Logger.log('Latest Status (Existing): ' + latestStatus);
        return latestStatus;
      } else {
        Logger.log('Could not find tracking details in GET request.');
        return null;
      }
    }
    
    if (parsedJson.meta && (parsedJson.meta.code === 200 || parsedJson.meta.code === 201)) {
      const initialStatus = parsedJson.data.tracking.tag;
      Logger.log('Successfully created. Initial Status: ' + initialStatus);
      return initialStatus;
    }
    
    Logger.log('Unhandled API Response: ' + response.getContentText());
    return parsedJson;

  } catch (error) {
    Logger.log('Script Error: ' + error.toString());
    return null;
  }
}
