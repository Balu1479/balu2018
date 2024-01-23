public with sharing class AccountWrapper {
    public String id {get;set;}
    public String name{get;set;}
    public String phone{get;set;}
    public list<ContactsWrapper> contacts{get;set;}
    public class ContactsWrapper{
        public String id{get;set;}
        public String firstName{get;set;}
        public String lastName{get;set;}
        public String accountId{get;set;}
    }
}