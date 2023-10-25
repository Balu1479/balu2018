public with sharing class CustomLookupController {
    @AuraEnabled(cacheable =true)
    public static list<Sobject> searchLookupData(string searchKey, string sObjectApiName){
        List<sObject> returnList = new List<sObject>();
        String searchKeyWord = '%'+ searchKey + '%';
        String sQuery = 'Select id,name From '+sObjectApiName + ' Where name like :searchKeyWord order by createddate desc limit 5';
        //String sQuery = 'Select id,name From Account';
        //String whereClause = 'name like :searchKeyWord';
        //String whereClause = 'name like \'%'+searchKey+'%\' ';
        //tring orderByClause = 'order by createddate desc limit 5';
        try {
            for(sObject obj: Database.query(sQuery)){
                returnList.add(obj);
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return returnList;
    }
    @AuraEnabled
    public static sObject searchDefaultRecord(String recordId, String sObjectApiName){
        String recordIdvalue = recordId;
        String sQuery = 'Select id,name from '+sObjectApiName+ ' Where Id =: recordIdvalue limit 1';
        System.debug('query--:'+sQuery);
        for(sObject obj : Database.query(sQuery)){
            return obj;
        }
        return null;
    }
}