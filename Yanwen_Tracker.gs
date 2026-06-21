function trackYanwen(trackingNumber, refresh) {
  if (!trackingNumber || trackingNumber.toString().trim() === "") {
    return "Error: Tracking number is required.";
  }

  const url = `https://track.yw56.com.cn/en/querydel?nums=${trackingNumber.toString().trim()}&cyp=c848270ab278fa84fd223d6975410ea0`;
  
  const options = {
    method: "get",
    muteHttpExceptions: true,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5"
    }
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const html = response.getContentText();
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      return `Error: HTTP Request failed with code ${responseCode}`;
    }

    const regex = /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*\[GMT[+-]\d+\]\s*[^<]+)/i;
    const statusMatch = html.match(regex);
    
    if (statusMatch && statusMatch[1]) {
      let statusText = statusMatch[1].trim().slice(0, -2);
      return statusText;
    } else {
      return "Status not found. The date format may have changed.";
    }    
  } catch (error) {
    return `Error fetching tracking data: ${error.message}`;
  }
}
