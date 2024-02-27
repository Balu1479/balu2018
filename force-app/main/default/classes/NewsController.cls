public with sharing class NewsController {
  private static string newsApiUrl = 'https://newsapi.org/v2/everything?q=tesla&from=2024-01-21&sortBy=publishedAt&apiKey=9454c03728aa45848ac04584162361dd';
  @AuraEnabled
  public static Map<String, Object> retrieveNews() {
    HttpRequest httpRequest = new HttpRequest();
    httpRequest.setEndpoint(newsApiUrl);
    httpRequest.setMethod('GET');
    Map<String, Object> newsJsonData = new Map<String, Object>();
    String strResponse = null;
    try {
      Http http = new Http();
      HttpResponse httpResponse = http.send(httpRequest);
      system.debug('httpResponse' + httpResponse);
      system.debug('httpResponse' + httpResponse.getBody());
      if (httpResponse.getStatusCode() == 200) {
        system.debug('httpResponse' + httpResponse);
        strResponse = httpResponse.getBody();
      }
    } catch (Exception ex) {
      system.debug('httpResponse' + ex);
    }
    if (!String.isBlank(strResponse)) {
      newsJsonData = (Map<String, Object>) JSON.deserializeUntyped(strResponse);
    }
    if (!newsJsonData.isEmpty()) {
      system.debug('newsJsonData' + newsJsonData);
      return newsJsonData;
    } else {
      return null;
    }
  }
}