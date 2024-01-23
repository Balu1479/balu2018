public with sharing class ContactsController {
    @AuraEnabled(cacheable=true)
    public static list<contact> getContacts(){
        try {
            return [Select Id,Name,lastName,phone,email from Contact WITH SECURITY_ENFORCED limit 30];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}