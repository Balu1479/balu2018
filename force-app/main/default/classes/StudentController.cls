public with sharing class StudentController {
    @AuraEnabled(cacheable =true)
    public static List<Student__c> retrieveStudentRecords(){
        list<Student__c> studentRecotds = new list<Student__c>();
        try {
            studentRecotds = [Select id, Name,Total_marks__c from Student__c WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return studentRecotds;
    }
}