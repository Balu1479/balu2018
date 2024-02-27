public with sharing class AccountController {
  @AuraEnabled(cacheable=true)
  public static string getAccountsRecords() {
    try {
      list<Account> listAccs = [
        SELECT id, name, industry, phone, Site, Is_Active__c,AnnualRevenue
        FROM Account
        WITH SECURITY_ENFORCED
        LIMIT 50
      ];
      return JSON.serialize(listAccs);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static void uppdateAccountRecords(string accId) {
    list<Account> accList = new List<Account>();
    try {
      for (Account ac : [
        SELECT Id, name, phone, industry
        FROM Account
        WHERE Id = :accId
        WITH SECURITY_ENFORCED
      ]) {
        Account acc = new Account();
        acc.phone = '9999999999';
        acc.Id = ac.Id;
        accList.add(acc);
      }
      if (!accList.isEmpty() && Schema.sObjectType.Account.isUpdateable()) {
        update accList;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static void deleteMultipleAccRecords(String ids) {
    list<Account> deleteAccList = new List<Account>();
    try {
      for (Account acc : [SELECT id, name FROM Account WHERE ID = :ids]) {
        deleteAccList.add(acc);
      }
      if (
        !deleteAccList.isEmpty() && Schema.sObjectType.Account.isDeletable()
      ) {
        delete deleteAccList;
      }
    } catch (Exception e) {
      throw new AuraHandledException('Unable to delete ' + e.getMessage());
    }
  }
  public static void upsertcontactRecords() {
    map<string, contact> mapContact = new Map<string, contact>();
    list<contact> conList = new List<contact>();
    for (Contact con : [
      SELECT id, AccountId, name
      FROM contact
      WHERE AccountId != NULL
      WITH SECURITY_ENFORCED
    ]) {
      mapContact.put(con.AccountId, con);
    }
    for (Account acc : [
      SELECT
        id,
        name,
        (SELECT id, AccountId, email, lastname, firstname FROM contacts)
      FROM Account
      WITH SECURITY_ENFORCED
    ]) {
      if (mapContact.containskey(acc.Id)) {
        contact cons = mapContact.get(acc.id);
        cons.email = 'Updatetoday@gmail.com';
        conList.add(cons);
      } else {
        contact c = new contact();
        c.firstname = 'Insert Today';
        c.lastName = acc.Name;
        c.email = 'inserttoday@gmail.com';
        c.AccountId = acc.Id;
        conList.add(c);
      }
    }
    if (!conList.isEmpty() && Schema.sObjectType.Account.IsAccessible()) {
      upsert conList;
    }
  }
  public static void insertingRecords() {
    list<Account> listAccs = new List<Account>();
    Account acc = new Account(name = 'testInsert today1');
    Account acc1 = new Account(name = 'testInsert today2');
    Account acc2 = new Account(name = 'testInsert today3');
    Account acc3 = new Account(name = 'testInsert today4');
    Account acc4 = new Account(name = 'testInsert today5');
    listAccs.add(acc);
    listAccs.add(acc1);
    listAccs.add(acc2);
    listAccs.add(acc3);
    listAccs.add(acc4);
    if (!listAccs.isEmpty() && Schema.sObjectType.Account.IsCreateable()) {
      insert listAccs;
    }
  }
  public static void updateRecordsAccs() {
    list<Account> listACCSUpdate = new List<Account>();
    list<Account> listACCS = [
      SELECT id, name, type, industry, phone
      FROM account
      WHERE name LIKE '%testInsert today%'
      WITH SECURITY_ENFORCED
    ];
    for (Account acc : listACCS) {
      Account ac = new Account();
      ac.Id = acc.Id;
      ac.Phone = '88888888';
      listACCSUpdate.add(ac);
    }
    update listACCSUpdate;
  }
  public static void deleteRecordsAccs() {
    //list<Account> listACCSUpdate = new list<Account>();
    list<Account> listACCS = [
      SELECT id, name, type, industry, phone
      FROM account
      WHERE name LIKE '%testInsert today%'
      WITH SECURITY_ENFORCED
    ];
    delete listACCS;
  }
  public static void insertTriggerRecs(List<Account> listAccs) {
    for (account acc : listAccs) {
      if (acc.type == 'Prospect') {
        acc.addError('these type of accounts are not allowed to insert..');
      }
    }
  }
  public static void updateTriggerRecs(List<Account> listAccs) {
    for (account acc : listAccs) {
      if (acc.type == 'other') {
        acc.addError('these type of accounts are not allowed to Update..');
      }
    }
  }
  public static void upsertcontactRecords(list<Account> listAccs) {
    list<string> accountIds = new List<string>();
    list<Contact> contactRecs = new List<Contact>();
    for (Account acc : listAccs) {
      accountIds.add(acc.Id);
    }
    contact con = new contact();
    con.lastName = 'TestAfter insert';
    con.Phone = '8888888888';
    con.AccountId = accountIds[0];
    contactRecs.add(con);
    contact con1 = new contact();
    con1.lastName = 'TestAfter insert1';
    con1.Phone = '99999999';
    con1.AccountId = accountIds[0];
    contactRecs.add(con1);
    if (!contactRecs.isEmpty() && Schema.sObjectType.Contact.IsCreateable()) {
      insert contactRecs;
    }
  }
  @AuraEnabled
  public static void saveAccountsLwc(List<account> records) {
    if (records.size() > 0 && records != null) {
      List<account> accs = new List<account>();
      for (integer i = 0; i < records.size(); i++) {
        account acc = new account();
        acc.Id = records[i].Id;
        acc.Industry = 'Energy';
        acc.Name = records[i].Name;
        acc.Site = records[i].Site;
        acc.Amount__c = records[i].Amount__c;
        accs.add(acc);
      }
      if (!accs.isEmpty() && Schema.sObjectType.Account.isAccessible()) {
        upsert accs;
      }
    }
  }
  @AuraEnabled
  public static List<Account> getAccounts() {
    return [
      SELECT Id, Name, Industry, Site, Amount__c
      FROM ACCOUNT
      WHERE Industry != NULL
      WITH SECURITY_ENFORCED
      ORDER BY createdDate DESC
      LIMIT 10
    ];
  }
  @AuraEnabled
  public static String deleteAccountRecords(String toDeleteId) {
    String status;
    List<account> acc = new List<Account>();
    Account a = new Account();
    a.Id = toDeleteId;
    acc.add(a);
    Database.DeleteResult[] drList = Database.delete(acc, false);
    List<String> deletedIds = new List<String>();
    List<String> errorMessages = new List<String>();
    for (Database.DeleteResult dr : drList) {
      if (dr.isSuccess()) {
        deletedIds.add(dr.getId());
      } else {
        for (Database.Error err : dr.getErrors()) {
          errorMessages.add(err.getMessage());
        }
      }
    }
    if (deletedIds.size() > 0) {
      status = 'success';
    } else {
      status = errorMessages[0];
    }
    return status;
  }
  @AuraEnabled
  public static List<string> getAccountIds() {
    List<string> accountIds = new List<string>();
    try {
      for (Account acc : [
        SELECT Id
        FROM Account
        WITH SECURITY_ENFORCED
        LIMIT 5
      ]) {
        accountIds.add(acc.Id);
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return accountIds;
  }
  @AuraEnabled
  public static list<Contact> getContactsByAccountId(String accountId) {
    List<Contact> contactList = new List<Contact>();
    try {
      contactList = [
        SELECT Id, firstname, lastname, AccountId
        FROM contact
        WHERE AccountId = :accountId
        WITH SECURITY_ENFORCED
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return contactList;
  }
  public class AccountWrapper {
    public String id { get; set; }
    public String name { get; set; }
    public String phone { get; set; }
    list<ContactsWrapper> contacts { get; set; }
  }
  public class ContactsWrapper {
    public String id { get; set; }
    public String firstName { get; set; }
    public String lastName { get; set; }
    public String accountId { get; set; }
  }
  @AuraEnabled(cacheable=true)
  public static string getAccountAndContacts() {
    List<AccountWrapper> accountWrapperList = new List<AccountWrapper>();
    try {
      for (Account accounts : [
        SELECT
          id,
          name,
          phone,
          (SELECT id, lastname, firstname, accountId FROM Contacts)
        FROM ACCOUNT
        WITH SECURITY_ENFORCED
        LIMIT 50
      ]) {
        List<ContactsWrapper> accountAndContactsList = new List<ContactsWrapper>();
        AccountWrapper accountWrapper = new AccountWrapper();
        accountWrapper.id = accounts.id;
        accountWrapper.name = accounts.name;
        accountWrapper.phone = accounts.phone;
        for (contact contacts : accounts.contacts) {
          ContactsWrapper accountAndContacts = new ContactsWrapper();
          accountAndContacts.id = contacts.id;
          accountAndContacts.firstName = contacts.firstname;
          accountAndContacts.lastName = contacts.lastname;
          accountAndContacts.accountId = contacts.accountId;
          accountAndContactsList.add(accountAndContacts);
        }
        accountWrapper.contacts = accountAndContactsList;
        accountWrapperList.add(accountWrapper);
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return JSON.serialize(accountWrapperList);
  }
  @AuraEnabled
  public static String deleteAccounts(list<String> toDeleteId) {
    String status;
    List<account> acc = new List<Account>();
    Database.DeleteResult[] drList = Database.delete(toDeleteId, false);
    List<String> deletedIds = new List<String>();
    List<String> errorMessages = new List<String>();
    for (Database.DeleteResult dr : drList) {
      if (dr.isSuccess()) {
        deletedIds.add(dr.getId());
      } else {
        for (Database.Error err : dr.getErrors()) {
          errorMessages.add(err.getMessage());
        }
      }
    }
    if (deletedIds.size() > 0) {
      status = 'success';
    } else {
      status = errorMessages[0];
    }
    return status;
  }
  @AuraEnabled
  public static void createAccountRecord(String accountObj){
    Map<String,Object> accountObjMap = (Map<String,Object>) JSON.deserializeUntyped(accountObj);
    Account accountCreate = new Account();
    try {
        accountCreate.Name = (String)accountObjMap.get('name');
        insert accountCreate;  
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static void updateAccountRecords(String accountToUpdate){
    Map<String,Object> accToUpdate = (Map<String,Object>) JSON.deserializeUntyped(accountToUpdate);
      system.debug('accToUpdate:'+accToUpdate);
      system.debug('accToUpdate:'+(String)accToUpdate.get('name'));
      system.debug('accToUpdate:'+(String)accToUpdate.get('id'));
    Account accountUpdate = new Account();
    try {
      accountUpdate.Name = (String)accToUpdate.get('name');
      accountUpdate.Id = (String)accToUpdate.get('id');
      update accountUpdate;  
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}