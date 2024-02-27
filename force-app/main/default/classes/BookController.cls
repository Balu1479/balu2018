public with sharing class BookController {
  public class BookRecordsWrapper {
    @AuraEnabled
    public string category { get; set; }
    @AuraEnabled
    public string id { get; set; }
    @AuraEnabled
    public string name { get; set; }
    @AuraEnabled
    public Decimal price { get; set; }
    @AuraEnabled
    public Decimal count { get; set; }
    @AuraEnabled
    public string createdByName { get; set; }
    @AuraEnabled
    public string publishtype { get; set; }
  }
  @AuraEnabled(cacheable=true)
  public static string retrieveBookRecords() {
    list<BookRecordsWrapper> listBooks = new List<BookRecordsWrapper>();
    try {
      for (Book__c each : [
        SELECT
          ID,
          Name,
          Author__c,
          Category__c,
          Count__c,
          Price__c,
          CreatedBy.name,
          Publish_Type__c
        FROM Book__c
        WITH SECURITY_ENFORCED
      ]) {
        BookRecordsWrapper bookRecord = new BookRecordsWrapper();
        bookRecord.category = each.Category__c;
        bookRecord.name = each.Name;
        bookRecord.id = each.ID;
        bookRecord.price = each.Price__c;
        bookRecord.count = each.Count__c;
        bookRecord.createdByName = each.CreatedBy.name;
        bookRecord.publishtype = each.Publish_Type__c;
        listBooks.add(bookRecord);
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    system.debug('listBooks--:' + listBooks);
    return JSON.serialize(listBooks);
  }
  @AuraEnabled
  public static string /*list<bookRecordsWrapper>*/ getBookRecords(
    String searchKey
  ) {
    list<BookRecordsWrapper> listBooks = new List<BookRecordsWrapper>();
    String key = '%' + searchKey + '%';
    try {
      for (Book__c each : [
        SELECT
          ID,
          Name,
          Author__c,
          Category__c,
          Count__c,
          Price__c,
          CreatedBy.name,
          Publish_Type__c
        FROM Book__c
        WHERE Name LIKE :key
        WITH SECURITY_ENFORCED
      ]) {
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
    system.debug('listBooks--:' + listBooks);
    return JSON.serialize(listBooks);
    //return listBooks;
  }
  @AuraEnabled
  public static Book__c createBook(Book__c bk) {
    try {
      if (bk != null) {
        insert bk;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    system.debug('bk--:' + bk);
    return bk;
  }
  @AuraEnabled
  public static Book__c deleteBookRecord(string bk) {
    system.debug('bk---:' + bk);
    try {
      Book__c book = [SELECT id FROM Book__c WHERE id = :bk];
      system.debug('book--:' + book);
      if (book != null) {
        delete book;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return null;
  }
  @AuraEnabled
  public static void updateBookRecord(String books) {
    try {
      map<string, Object> bookRecs = (Map<String, Object>) JSON.deserializeUntyped(
        books
      );
      system.debug('bookRecs---:' + bookRecs);
      //Book__c bk = [Select Id,Name,Author__c,Category__c,Count__c,CreatedBy.name,Price__c FROM Book__c where ID =: bookId];
      //update bk;
      string name = string.valueof(bookRecs.get('name'));
      system.debug('name--:' + name);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static list<Book__c> searchBooks(String searchKey) {
    String textkey = '%' + searchKey + '%';
    list<Book__c> bookList = new List<Book__c>();
    try {
      for (Book__c bc : [
        SELECT
          ID,
          Name,
          Author__c,
          Category__c,
          Count__c,
          CreatedBy.name,
          Price__c,
          Publish_Type__c
        FROM Book__c
        WHERE Name LIKE :textkey
      ]) {
        bookList.add(bc);
      }
      if (bookList.size() == 0) {
        throw new AuraHandledException('No Record Found..');
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return bookList;
  }
  /*@AuraEnabled
      public static list<string> getPickListValues(){
        List<String> options= new List<String>();
        try {
            Schema.DescribeFieldResult fieldResult = Book__c.Publish_Type__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for( Schema.PicklistEntry pickListVal : ple){
                options.add(pickListVal.getLabel());
            }     
		return options;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
      }*/
  @AuraEnabled(cacheable=true)
  public static List<CustomValueWrapper> getPickListValues(
    sObject customObjInfo,
    string selectPicklistApi
  ) {
    Schema.DescribeSObjectResult objDescribe = customObjInfo.getSObjectType()
      .getDescribe();
    map<String, Schema.SObjectField> customFieldMap = objDescribe.fields.getMap();
    list<Schema.PicklistEntry> custPickValues = customFieldMap.get(
        selectPicklistApi
      )
      .getDescribe()
      .getPickListValues();
    list<CustomValueWrapper> customObjWrapper = new List<CustomValueWrapper>();
    for (Schema.PicklistEntry myCustPick : custPickValues) {
      CustomValueWrapper selectOptionValueWrapper = new CustomValueWrapper();
      selectOptionValueWrapper.custFldlabel = myCustPick.getLabel();
      selectOptionValueWrapper.custFldvalue = myCustPick.getValue();
      customObjWrapper.add(selectOptionValueWrapper);
    }

    return customObjWrapper;
  }
  // wrapper class
  public with sharing class CustomValueWrapper {
    @auraEnabled
    public string custFldlabel { get; set; }
    @auraEnabled
    public string custFldvalue { get; set; }
  }
  @AuraEnabled(Cacheable=true)
  public static List<Book__c> getBooks() {
    return [
      SELECT Id, Category__c, Count__c, Price__c, Delivery_Time__c, US_Price__c
      FROM Book__c
      WHERE Category__c != NULL AND Count__c != NULL
      WITH SECURITY_ENFORCED
      ORDER BY CreatedDate
      LIMIT 20
    ];
  }
}