public with sharing class AccountController {
    public AccountController() {

    }
    @AuraEnabled
    public static string getAccountsRecords(){
        try {
            list<Account> ListAccs = [Select id,name,industry,phone from Account LIMIT 50];
            return  JSON.serialize(ListAccs);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void uppdateAccountRecords(string accId){
        system.debug('accid--:'+accId);
        list<Account> accList = new list<Account>();
        try {
            for(Account ac: [Select Id,name,phone,industry from Account Where Id =: accId]){
                Account acc = new Account();
                acc.phone = '9999999999';
                acc.Id = ac.Id;
                accList.add(acc);
            }
            system.debug('accList---:'+accList);
            if(!accList.isEmpty()){
                update accList;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void deleteMultipleAccRecords(String ids){
        /*list<string> strIds = new list<string>();
        for(string str :ids){
            strIds.add(str);
        }*/
        system.debug('ids--:'+ids);
        list<Account> deleteAccList = new list<Account>();
        try {
            for(Account acc:[Select id,name from Account Where ID =:ids]){
                deleteAccList.add(acc);
            }
            if(!deleteAccList.isEmpty()){
                delete deleteAccList;
            }
            
        } catch (Exception e) {
            throw new AuraHandledException('Unable to delete '+e.getMessage());
        }
    }
    public static void upsertcontactRecords(){
        map<string,contact> mapContact = new map<string,contact>();
        map<string,contact> UpdatemapContact = new map<string,contact>();
        list<contact> conList = new list<contact>();
        for(Contact con :[Select id,AccountId,name from contact where AccountId != null]){
            mapContact.put(con.AccountId,con);
        }
        system.debug('map size---:'+mapContact.size());
        for(Account acc :[select id,name,(select id,AccountId,email,lastname,firstname from contacts) from Account]){
                if(mapContact.containskey(acc.Id)){
                    system.debug('if condition--');
                    contact cons = mapContact.get(acc.id);
                    cons.email = 'Updatetoday@gmail.com';
                    conList.add(cons);
                }else{
                    system.debug('else condition--');
                    system.debug('else condition name--'+acc.name);
                    contact c = new contact();
                    c.firstname = 'Insert Today';
                    c.lastName = acc.Name;
                    c.email = 'inserttoday@gmail.com';
                    c.AccountId = acc.Id;
                    conList.add(c);
    
                }
        }
        system.debug('conList--:'+conList.size());
        system.debug('conList--:'+conList);
        if(!conList.isEmpty()){
            upsert conList;
        }
    }
    public static void insertingRecords(){
        list<Account> listAccs = new list<Account>();
        Account acc = new Account(name = 'testInsert today1');
         Account acc1 = new Account(name = 'testInsert today2');
         Account acc2 = new Account(name = 'testInsert today3');
         Account acc3 = new Account(name = 'testInsert today4');
         Account acc4 = new Account(name = 'testInsert today5');
        //acc.name = 'test Insert today'
        listAccs.add(acc);
         listAccs.add(acc1);
         listAccs.add(acc2);
         listAccs.add(acc3);
         listAccs.add(acc4);
        system.debug('listAccs---:'+listAccs);
        insert listAccs;        
    }
    public static void updateRecordsAccs(){
        list<Account> listACCSUpdate = new list<Account>();
        list<Account> listACCS = [select id,name,type,industry,phone from account where name like '%testInsert today%'];
        for(Account acc : listACCS){
            Account ac = new Account();
            ac.Id = acc.Id;
            ac.Phone = '88888888';
            listACCSUpdate.add(ac);
        }
        update listACCSUpdate;
    }
    public static void deleteRecordsAccs(){
        //list<Account> listACCSUpdate = new list<Account>();
        list<Account> listACCS = [select id,name,type,industry,phone from account where name like '%testInsert today%'];
        delete listACCS;
    }
    public static void insertTriggerRecs(List<Account> ListAccs){
        for(account acc: ListAccs){
            if(acc.type == 'Prospect'){
                acc.addError('these type of accounts are not allowed to insert..');
            }
            
        }
        
    }
    public static void UpdateTriggerRecs(List<Account> ListAccs){
        for(account acc: ListAccs){
            if(acc.type == 'other'){
                acc.addError('these type of accounts are not allowed to Update..');
            }
            
        }
    }
    public static void upsertcontactRecords(list<Account> listAccs){
        //map<string,Account> mapContact = new map<string,Account>();
        list<string> listStr = new list<string>();
        for(Account con :listAccs){
            listStr.add(con.Id);
        }
        contact con = new contact();
        con.lastName = 'TestAfter insert';
        con.Phone = '8888888888';
        con.AccountId = listStr[0];
        insert con;
    }
    @AuraEnabled
    public static void saveAccountsLwc(List<account> records){
        if(records.size()>0 && records != null){
            List<account> accs = new List<account>();
            
            for(integer i = 0; i < records.size(); i++) {
                account acc = new account();
                acc.Id = records[i].Id;
                acc.Industry = 'Energy';
                acc.Name = records[i].Name;
                acc.Site = records[i].Site;
                acc.Amount__c = records[i].Amount__c;
                accs.add(acc);
            }
            upsert accs;
        }
    }
    @AuraEnabled
    public static List<Account> getAccounts(){
        return [SELECT Id, Name, Industry, Site, Amount__c 
                from ACCOUNT 
                Where Industry != NULL ORDER BY createdDate DESC LIMIT 10];
    }
    @AuraEnabled
    public static String deleteAccounts(String toDeleteId){
        List<account> acc = new List<Account>();
        Account a = new Account();
        a.Id = toDeleteId;
        acc.add(a);
        Database.DeleteResult[] drList = Database.delete(acc, false);
		List<String> deletedIds = new List<String>();
        List<String> errorMessages = new List<String>();
        // Iterate through each returned result
        for(Database.DeleteResult dr : drList) {
            if (dr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                System.debug('Successfully deleted account with ID: ' + dr.getId());
                deletedIds.add(dr.getId());
                
            }
            else {
                // Operation failed, so get all errors                
                for(Database.Error err : dr.getErrors()) {
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Account fields that affected this error: ' + err.getFields());
                    errorMessages.add(err.getMessage());
                }
                
            }
        }
        if(deletedIds.size() > 0)
            return 'success';
        else
            return errorMessages[0];
    }
    @AuraEnabled
    public static List<string> getAccountIds(){
        List<string> accountIds = new List<string>();
        try {
            for(Account acc : [SELECT Id from Account WITH SECURITY_ENFORCED LIMIT 5 ]){
                accountIds.add(acc.Id);
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return accountIds;
    }
}