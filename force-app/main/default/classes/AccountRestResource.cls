@RestResource(urlMapping='/cases/*')
global with sharing class AccountRestResource {
    @HttpGet
    global static list<case> getCaseRecords() {
        list<Case> result =  [SELECT CaseNumber,Subject,Status,Origin,Priority
                              FROM Case WITH SECURITY_ENFORCED Limit 10];
        return result;
    }
    @HttpPost
    global static ID createCase(String subject, String status, String origin, String priority) {
        Case thisCase = new Case(
            Subject=subject,
            Status=status,
            Origin=origin,
            Priority=priority);
        insert thisCase;
        return thisCase.Id;
    }   
    @HttpDelete
    global static void deleteCase() {
        RestRequest request = RestContext.request;
        String caseId = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1);
        Case thisCase = [SELECT Id FROM Case WHERE Id = :caseId WITH SECURITY_ENFORCED];
        delete thisCase;
    }     
    @HttpPut
    global static ID upsertCase(String subject, String status,String origin, String priority, String id) {
        Case thisCase = new Case(
            Id=id,
            Subject=subject,
            Status=status,
            Origin=origin,
            Priority=priority);
        upsert thisCase;
        return thisCase.Id;
    }
    @HttpPatch
    global static ID updateCaseFields() {
        RestRequest request = RestContext.request;
        String caseId = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1);
        Case thisCase = [SELECT Id FROM Case WHERE Id = :caseId WITH SECURITY_ENFORCED];
        Map<String, Object> params = (Map<String, Object>)JSON.deserializeUntyped(request.requestbody.tostring());
        for(String fieldName : params.keySet()) {
            thisCase.put(fieldName, params.get(fieldName));
        }
        update thisCase;
        return thisCase.Id;
    }    
}