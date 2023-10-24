public with sharing class goRestCalloutBatch implements Database.Batchable<sObject>,Database.AllowsCallouts{
    map<string,Gorest_User__c> userMap = new map<string,Gorest_User__c>();
    map<string,Gorest_User__c> userMapIds = new map<string,Gorest_User__c>();
    public goRestCalloutBatch() {
        for(Gorest_User__c eachOld : [SELECT ID,Email__c,External_Id__c,Gender__c,Name,Status__c from Gorest_User__c]){
            userMap.put(eachOld.Name, eachOld);
            userMapIds.put(eachOld.Id, eachOld);
        }
    }
    public Database.QueryLocator start(Database.BatchableContext bc) {
        //String query = 'SELECT ID,Email__c,External_Id__c,Gender__c,Name,Status__c from Gorest_User__c limit 1';
        string str;
         Http http = new Http();
                HttpRequest req = new HttpRequest();
                req.setEndPoint('https://gorest.co.in/public/v2/users');
                req.setMethod('GET');
                HttpResponse response = http.send(req);
                if(response.getStatusCode() == 200) {
                    system.debug('start method response---:'+ response.getBody());
                    str = response.getBody();
                }
        String className = 'goRestCalloutBatch%';
        String query = 'SELECT Id,Name FROM ApexClass WHERE Name like :className limit 1';
        //return Database.getQueryLocator(query);
        return Database.getQueryLocator(str);
    }
    public void execute(Database.BatchableContext bc, List<ApexClass> records){
        list<GorestChild__c> gorestChilds = new list<GorestChild__c> ();
        List<Gorest_User__c> guserListUpsert = new List<Gorest_User__c>();
        list<GorestWrapper> guserList = new list<GorestWrapper>();
        for(integer i = 0; i<= records.size();i++){
            try {
                Http http = new Http();
                HttpRequest req = new HttpRequest();
                req.setEndPoint('https://gorest.co.in/public/v2/users');
                req.setMethod('GET');
                HttpResponse response = http.send(req);
                if(response.getStatusCode() == 200) {
                    system.debug('response---:'+ response.getBody());
                    //list<object> results = (list<object>) JSON.deserializeUntyped(response.getBody());
                    list<GorestWrapper> results = (list<GorestWrapper>) JSON.deserialize(response.getBody(),list<GorestWrapper>.class);
                    for(GorestWrapper each: results) {
                        Gorest_User__c guserOld = userMap.containsKey(each.name) ? userMap.get(each.name) : new Gorest_User__c();
                        guserOld.Email__c = each.email;
                        guserOld.Name = each.name;
                        guserOld.Gender__c = each.gender;
                        guserOld.Status__c = each.status;
                        guserListUpsert.add(guserOld);
                        /* if(userMap.containsKey(each.name)){
                            system.debug('entering main if part---');
                            Gorest_User__c eachUser = userMap.get(each.name);
                            system.debug('eachUser name ---'+eachUser.Name);
                            system.debug('eachUser Email__c ---'+eachUser.Email__c);
                            system.debug('eachUser Gender__c ---'+eachUser.Gender__c);
                            system.debug('eachUser Status__c ---'+eachUser.Status__c);
                            Gorest_User__c guserOld = new Gorest_User__c();
                            if(each.email != null && each.email == eachUser.Email__c){
                                guserOld.Email__c = eachUser.Email__c;
                            }else{
                                guserOld.Email__c = each.email;
                            }
                            if(each.gender != null && each.gender == eachUser.Gender__c){
                                guserOld.Gender__c = eachUser.Gender__c;
                            }else{
                                guserOld.Gender__c = each.gender;
                            }
                            if(each.status != null && each.status == eachUser.Status__c){
                                guserOld.Status__c = eachUser.Status__c;
                            }else{
                                guserOld.Status__c = each.status;
                            }
                            guserListUpsert.add(guserOld);
                        }else{
                            system.debug('entering main else part---');
                            Gorest_User__c guserNew = new Gorest_User__c();
                            guserNew.Name = each.name;
                            guserNew.Email__c = each.email;
                            guserNew.Status__c = each.status;
                            guserNew.Gender__c = each.gender;
                            guserListUpsert.add(guserNew);
                            
                        } */
                    }
                } 
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
        if(!guserListUpsert.isEmpty()){
            upsert guserListUpsert;
        }
        for(Gorest_User__c each : [SELECT ID,Email__c,External_Id__c,Gender__c,Name,Status__c from Gorest_User__c]){
            system.debug('each record--:'+each);
            GorestChild__c eachChild = new GorestChild__c();
            eachChild.Gorest_User__c = each.Id;
            gorestChilds.add(eachChild);
        }
        if(!gorestChilds.isEmpty()){
            insert gorestChilds;
        }
    }
    public void finish(Database.BatchableContext bc){
        system.debug('finish method');
    }
    public class GorestWrapper{
        public string name {get;set;}
        public string status {get;set;}
        public string email {get;set;}
        public string gender {get;set;}
    }
}