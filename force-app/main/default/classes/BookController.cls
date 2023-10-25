public with sharing class BookController {
    public class BookRecordsWrapper{
        @AuraEnabled
        public string category{get;set;}
        @AuraEnabled
        public string id{get;set;}
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public Decimal price{get;set;}
        @AuraEnabled
        public Decimal count{get;set;}
        @AuraEnabled
        public string createdByName{get;set;}
        @AuraEnabled
        public string publishtype{get;set;}
    }
    @AuraEnabled
    public static string getBookRecords(String searchKey){
        list<BookRecordsWrapper> listBooks = new list<BookRecordsWrapper>();
        String key = '%' + searchKey + '%';
        try {
            
            for(Book__c each:[SELECT ID,Name,Author__c,Category__c,Count__c,
                              Price__c,CreatedBy.name,Publish_Type__c FROM Book__c where Name like :key WITH SECURITY_ENFORCED]){
                                  BookRecordsWrapper br = new BookRecordsWrapper();
                                  br.category = each.Category__c;
                                  br.name = each.Name;
                                  br.id = each.ID;
                                  br.price = each.Price__c;
                                  br.count = each.Count__c;
                                  br.createdByName = each.CreatedBy.name;
                                  br.publishtype = each.Publish_Type__c;
                                  listBooks.add(br);
                              }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return JSON.serialize(listBooks);
    }
    @AuraEnabled
    public static Book__c createBook(Book__c bk){
        try {
            if(bk != null && Schema.sObjectType.Book__c.isCreateable()){
                insert bk;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return bk;
    }
    @AuraEnabled
    public static Book__c deleteBookRecord(string bk){
        try {
            Book__c book = [select id from Book__c where id=:bk WITH SECURITY_ENFORCED];
            if(book != null && Schema.sObjectType.Book__c.isDeletable()){
                delete book;
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }
    @AuraEnabled
    public static void updateBookRecord(String books){
        try {
            map<string,Object> bookRecs = (Map<String,Object>)JSON.deserializeUntyped(books);
            string name = string.valueof(bookRecs.get('name'));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static list<Book__c> searchBooks(String searchKey){
        String textkey = '%' + searchKey + '%';
        list<Book__c> bookList = new list<Book__c>();
        try {
            
            for(Book__c bc:[SELECT ID,Name,Author__c,Category__c,Count__c,
                            CreatedBy.name,Price__c,Publish_Type__c FROM Book__c where Name like : textkey WITH SECURITY_ENFORCED]){
                                bookList.add(bc);            
                            } 
            if(bookList.size()==0){
                throw new AuraHandledException('No Record Found..'); 
            }                 
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return bookList;
    }
    @AuraEnabled(cacheable=true)
    public static List < CustomValueWrapper > getPickListValues(sObject customObjInfo, string selectPicklistApi) {
        Schema.DescribeSObjectResult objDescribe = customObjInfo.getSObjectType().getDescribe();     
        map < String, Schema.SObjectField > customFieldMap = objDescribe.fields.getMap();      
        list < Schema.PicklistEntry > custPickValues = customFieldMap.get(selectPicklistApi).getDescribe().getPickListValues();
        list < CustomValueWrapper > customObjWrapper = new list < CustomValueWrapper > ();
        for (Schema.PicklistEntry myCustPick: custPickValues) {
            CustomValueWrapper selectOptionValueWrapper = new CustomValueWrapper();
            selectOptionValueWrapper.custFldlabel = myCustPick.getLabel();
            selectOptionValueWrapper.custFldvalue = myCustPick.getValue();
            customObjWrapper.add(selectOptionValueWrapper);
        }
        
        return customObjWrapper;
        
    }
    public with sharing class CustomValueWrapper {
        @auraEnabled public string custFldlabel {get;set;}
        @auraEnabled public string custFldvalue {get;set;}
    }
    @AuraEnabled(Cacheable = true)
    public static List<Book__c> getBooks() {
        return [SELECT Id, Category__c, Count__c, Price__c,Delivery_Time__c,US_Price__c
                FROM Book__c 
                WHERE Category__c != null
                AND Count__c != null WITH SECURITY_ENFORCED
                ORDER BY CreatedDate limit 20];
    }
}