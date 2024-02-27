public with sharing class MobileController {
    @AuraEnabled (cacheable = true)
    public static list<Mobile__c> getMobileRecords(){
        list<Mobile__c> mobileList = new list<Mobile__c>();
        try {
            mobileList = [Select id,Name, Mobile_Price__c, Mobile_Rank__c from Mobile__c WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return mobileList;
    }
}