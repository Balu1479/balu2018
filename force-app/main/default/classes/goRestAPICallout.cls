public with sharing class goRestAPICallout {
    @AuraEnabled
    public static string getGoRestUsers(){
        List<Gorest_User__c> guserList = new List<Gorest_User__c>();
        try {
            Http http = new Http();
            HttpRequest req = new HttpRequest();
            req.setEndPoint('https://gorest.co.in/public/v2/users');
            req.setMethod('GET');
            HttpResponse response = http.send(req);
            if(response.getStatusCode() == 200) {
                list<Object> results = (list<Object>) JSON.deserializeUntyped(response.getBody());
                for(Object user: results) {
                    Map<String,Object> tempMap = (Map<String,Object>)user;
                    Gorest_User__c guser = new Gorest_User__c();
                    System.debug('email--:'+(String)tempMap.get('email'));
                    guser.Email__c = (String)tempMap.get('email');
                    guser.Gender__c = (String)tempMap.get('gender');
                    guser.Status__c = (String)tempMap.get('status');
                    guser.Name = (String)tempMap.get('name');
                    //String idValue = (String)tempMap.get('id');
                    //guser.External_Id__c = Integer.valueOf(idValue);
                    guserList.add(guser);
                }
            } 
            system.debug('response---:'+response.getBody());
            if(!guserList.isEmpty()){
                //insert guserList;
            } 
            return response.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string postGoRestUsers(String JsonString){
        system.debug('JsonString--:'+JsonString);
        try {
            Http http = new Http();
            HttpRequest req = new HttpRequest();
            req.setEndPoint('https://gorest.co.in/public/v2/users');
            req.setBody(JsonString);
            req.setHeader('Content-Type', 'application/json;charset=UTF-8');
            req.setHeader('Authorization', 'Bearer 7b95731a4a6394bc8b967fbb8a4ecf584324c4e390b1359b8c577d615eb8905c');
            req.setMethod('POST');
            system.debug('req--:'+req);
            HttpResponse response = http.send(req);
            system.debug('response--:'+response.getStatusCode());
            system.debug('response--:'+response.getBody());
            return response.getBody();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public static List<Gorest_User__c> GoRestUsersList(){
        List<Gorest_User__c> guserList = new List<Gorest_User__c>();
        try {
            Http http = new Http();
            HttpRequest req = new HttpRequest();
            req.setEndPoint('https://gorest.co.in/public/v2/users');
            req.setMethod('GET');
            HttpResponse response = http.send(req);
            if(response.getStatusCode() == 200) {
                list<Object> results = (list<Object>) JSON.deserializeUntyped(response.getBody());
                for(Object user: results) {
                    Map<String,Object> tempMap = (Map<String,Object>)user;
                    Gorest_User__c guser = new Gorest_User__c();
                    System.debug('email--:'+(String)tempMap.get('email'));
                    guser.Email__c = (String)tempMap.get('email');
                    guser.Gender__c = (String)tempMap.get('gender');
                    guser.Status__c = (String)tempMap.get('status');
                    guser.Name = (String)tempMap.get('name');
                    //String idValue = (String)tempMap.get('id');
                    //guser.External_Id__c = Integer.valueOf(idValue);
                    guserList.add(guser);
                }
            } 
            system.debug('response---:'+response.getBody());
            if(!guserList.isEmpty()){
                //insert guserList;
            } 
            return guserList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
 
}