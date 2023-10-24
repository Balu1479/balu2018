public class ServiceCatelogBatch implements database.Batchable<string>,Database.Stateful{
    list<Service_Catelogue__c> catelogListOld = new list<Service_Catelogue__c>();
    map<string,Service_Catelogue__c> scMap = new map<string,Service_Catelogue__c>();
    map<string,Service_Catelogue__c> scMapNew = new map<string,Service_Catelogue__c>();
    map<string,ServiceCateloguePrerequisitMapping__c> scpMap = new map<string,ServiceCateloguePrerequisitMapping__c>();
    //map<string,ServiceCatelogueRegionCode__c> scrcMap = new map<string,ServiceCatelogueRegionCode__c>();
    map<string,ServiceCreditRegionMapping__c> scrcRegioMapping = new map<string,ServiceCreditRegionMapping__c>();
    public ServiceCatelogBatch(){
        for(Service_Catelogue__c each : [Select id,name,ServiceId__c,Status__c from Service_Catelogue__c]){
            scMap.put(each.ServiceId__c, each);
            catelogListOld.add(each);
        }
        for(ServiceCateloguePrerequisitMapping__c each : [Select id,ServiceCatelogueId__c,PrerequisitID__c,IdPrerequisitIdUnique__c from ServiceCateloguePrerequisitMapping__c]){
            scpMap.put(each.IdPrerequisitIdUnique__c, each);
        }
        /* for(ServiceCatelogueRegionCode__c each : [Select id,RegionCode__c,RegionName__c from ServiceCatelogueRegionCode__c]){
            scrcMap.put(each.RegionCode__c, each);
        } */
        for(ServiceCreditRegionMapping__c each : [Select id,RegionID__c,ServiceCatelogueID__c,ServiceCatelogueID__r.ServiceId__c,RegionID__r.RegionCode__c,Service_Catelogue_Region_Code__c	 from ServiceCreditRegionMapping__c]){
            scrcRegioMapping.put(each.Service_Catelogue_Region_Code__c, each);
        }
    }
    
    public string[] start(Database.BatchableContext bc) {
        //String jsonText = '{"payload":{"services":[{"domainKey":1,"domainName":"Custom","subDomainKey":1,"subDomainName":"Custom","scopeOfWorkDescription":"TBD,","prerequisiteItems":null,"regionCodes":["01","02"],"startDate":"1386333005907","endDate":null,"localeCode":"en","afterHourLowCode":"PSCSMEASOFF","afterHourCredits":75,"stdHourLowCode":"PSCSMEASSTD","stdHourCredits":50,"customServiceProduct":false,"scheduleLeadTimeQuantity":1,"scheduleLeadTimeUnit":" ","rescheduleLeadTimeQuantity":1,"rescheduleLeadTimeUnit":" ","cancelLeadTimeQuantity":1,"cancelLeadTimeUnit":" ","id":"PS221WW","serviceName":"HP CloudSystem Matrix Expert Assistance Service","description":"TBD text,"},{"domainKey":2,"domainName":"Environment","subDomainKey":6,"subDomainName":"Power & Cooling","scopeOfWorkDescription":"HP or authorized partner.","prerequisiteItems":null,"regionCodes":["02","01","03"],"startDate":"1323177734862","endDate":null,"localeCode":"en","afterHourLowCode":"PSIRSHOOFF","afterHourCredits":22.5,"stdHourLowCode":"PSIRSHOOSTD","stdHourCredits":15,"customServiceProduct":false,"scheduleLeadTimeQuantity":14,"scheduleLeadTimeUnit":"d","rescheduleLeadTimeQuantity":5,"rescheduleLeadTimeUnit":"d","cancelLeadTimeQuantity":7,"cancelLeadTimeUnit":"d","id":"PS24WW","serviceName":"Insight Remote Support Advanced Discovery and Activation for HP-UX and OpenVMS","description":"Discovers and activates eight HP-UX or OpenVMS servers for monitoring by HP Insight Remote Support-Advanced"}]}}'; 
        //String jsonText = '{"payload":{"services":[{"domainKey":1,"domainName":"Custom","subDomainKey":1,"subDomainName":"Custom","scopeOfWorkDescription":"TBD,","prerequisiteItems":null,"regionCodes":["01","03","02"],"startDate":"1386333005907","endDate":null,"localeCode":"en","afterHourLowCode":"PSCSMEASOFF","afterHourCredits":75,"stdHourLowCode":"PSCSMEASSTD","stdHourCredits":50,"customServiceProduct":false,"scheduleLeadTimeQuantity":1,"scheduleLeadTimeUnit":" ","rescheduleLeadTimeQuantity":1,"rescheduleLeadTimeUnit":" ","cancelLeadTimeQuantity":1,"cancelLeadTimeUnit":" ","id":"PS221WW","serviceName":"HP CloudSystem Matrix Expert Assistance Service","description":"TBD text,"},{"domainKey":1,"domainName":"Custom","subDomainKey":1,"subDomainName":"Custom","scopeOfWorkDescription":"TBD,","prerequisiteItems":null,"regionCodes":["01","03","02"],"startDate":"1386333005907","endDate":null,"localeCode":"en","afterHourLowCode":"PSCSMEASOFF","afterHourCredits":75,"stdHourLowCode":"PSCSMEASSTD","stdHourCredits":50,"customServiceProduct":false,"scheduleLeadTimeQuantity":1,"scheduleLeadTimeUnit":" ","rescheduleLeadTimeQuantity":1,"rescheduleLeadTimeUnit":" ","cancelLeadTimeQuantity":1,"cancelLeadTimeUnit":" ","id":"PS119WW","serviceName":"HP CloudSystem Matrix Expert Assistance Service","description":"TBD text,"},{"domainKey":2,"domainName":"Environment","subDomainKey":6,"subDomainName":"Power & Cooling","scopeOfWorkDescription":"HP or authorized partner.","prerequisiteItems":"PS119WW","regionCodes":["02","01","03"],"startDate":"1323177734862","endDate":null,"localeCode":"en","afterHourLowCode":"PSIRSHOOFF","afterHourCredits":22.5,"stdHourLowCode":"PSIRSHOOSTD","stdHourCredits":15,"customServiceProduct":false,"scheduleLeadTimeQuantity":14,"scheduleLeadTimeUnit":"d","rescheduleLeadTimeQuantity":5,"rescheduleLeadTimeUnit":"d","cancelLeadTimeQuantity":7,"cancelLeadTimeUnit":"d","id":"PS24WW","serviceName":"Insight Remote Support Advanced Discovery and Activation for HP-UX and OpenVMS","description":"Discovers and activates eight HP-UX or OpenVMS servers for monitoring by HP Insight Remote Support-Advanced"}]}}';
        String jsonText = '{"payload":{"services":[{"domainKey":1,"domainName":"Custom","subDomainKey":1,"subDomainName":"Custom","scopeOfWorkDescription":"TBD,","prerequisiteItems":"PS221WW and (PS24WW or PS119WW)","regionCodes":["01","03","02"],"startDate":"1386333005907","endDate":null,"localeCode":"en","afterHourLowCode":"PSCSMEASOFF","afterHourCredits":75,"stdHourLowCode":"PSCSMEASSTD","stdHourCredits":50,"customServiceProduct":false,"scheduleLeadTimeQuantity":1,"scheduleLeadTimeUnit":" ","rescheduleLeadTimeQuantity":1,"rescheduleLeadTimeUnit":" ","cancelLeadTimeQuantity":1,"cancelLeadTimeUnit":" ","id":"PS221WW","serviceName":"HP CloudSystem Matrix Expert Assistance Service","description":"TBD text,"},{"domainKey":1,"domainName":"Custom","subDomainKey":1,"subDomainName":"Custom","scopeOfWorkDescription":"TBD,","prerequisiteItems":null,"regionCodes":["01","03","02"],"startDate":"1386333005907","endDate":null,"localeCode":"en","afterHourLowCode":"PSCSMEASOFF","afterHourCredits":75,"stdHourLowCode":"PSCSMEASSTD","stdHourCredits":50,"customServiceProduct":false,"scheduleLeadTimeQuantity":1,"scheduleLeadTimeUnit":" ","rescheduleLeadTimeQuantity":1,"rescheduleLeadTimeUnit":" ","cancelLeadTimeQuantity":1,"cancelLeadTimeUnit":" ","id":"PS119WW","serviceName":"HP CloudSystem Matrix Expert Assistance Service","description":"TBD text,"},{"domainKey":2,"domainName":"Environment","subDomainKey":6,"subDomainName":"Power & Cooling","scopeOfWorkDescription":"HP or authorized partner.","prerequisiteItems":null,"regionCodes":["02","01","03"],"startDate":"1323177734862","endDate":null,"localeCode":"en","afterHourLowCode":"PSIRSHOOFF","afterHourCredits":22.5,"stdHourLowCode":"PSIRSHOOSTD","stdHourCredits":15,"customServiceProduct":false,"scheduleLeadTimeQuantity":14,"scheduleLeadTimeUnit":"d","rescheduleLeadTimeQuantity":5,"rescheduleLeadTimeUnit":"d","cancelLeadTimeQuantity":7,"cancelLeadTimeUnit":"d","id":"PS24WW","serviceName":"Insight Remote Support Advanced Discovery and Activation for HP-UX and OpenVMS","description":"Discovers and activates eight HP-UX or OpenVMS servers for monitoring by HP Insight Remote Support-Advanced"}]}}';
        list<String> sbsResponseList = new list<String>();
        Map<String,Object> cObjMap = (Map<String,Object>) JSON.deserializeUntyped(jsonText);
        String cObjJson = JSON.serialize(cObjMap.get('payload'));
        map<string,Object> newObjMap =  (map<string,Object>) JSON.deserializeUntyped(cObjJson);
        String cObjJsoNew = JSON.serialize(newObjMap.get('services'));
        list<Object> cObjMapFurious = (list<Object>) JSON.deserializeUntyped(cObjJsoNew);
        String cObjJsonDrunk = JSON.serialize(cObjMapFurious);
        sbsResponseList.add(cObjJsonDrunk);
        return sbsResponseList;
    }
    public void execute(Database.BatchableContext bc, List<string> records){
        try
        {
            if(records[0] != null){
                list<SBSWrapper> sbsresponse = (list<SBSWrapper>)JSON.deserialize(records[0], list<SBSWrapper>.class);
                list<Service_Catelogue__c> catelogList = ServiceCatelogHelper.getServiceCatalogueRecords(sbsresponse,scMap);
                ServiceCatelogHelper.upsertServiceCatalogueRecords(catelogList);
                for(Service_Catelogue__c each :[Select id,ServiceId__c FROM Service_Catelogue__c]){
                    scMapNew.put(each.ServiceId__c, each);
                }
                list<ServiceCateloguePrerequisitMapping__c> serviceCataloguePrerequisiteRecords = ServiceCatelogHelper.serviceCataloguePrerequisiteRecords(sbsresponse,scpMap,scMapNew);
                ServiceCatelogRegionHelper.insertserviceCataloguePrerequisiteRecords(serviceCataloguePrerequisiteRecords);
                ServiceCatelogHelper.deletePrerequisiteRecords(scpMap);
                list<ServiceCreditRegionMapping__c> scrpList = ServiceCatelogRegionHelper.getServiceCatalogueRegionRelationRecords(sbsresponse,scrcRegioMapping,scMap);
                ServiceCatelogRegionHelper.insertServiceRegionRelationRecords(scrpList);
                ServiceCatelogRegionHelper.deleteServiceCatalogueRegionRelationRecords(scrcRegioMapping);
            }
        }
        catch(Exception ex){
            System.debug('Exception'+ex.getMessage() +':'+ ex.getTypeName() +':'+ ex.getLineNumber() +':'+ ex.getStackTraceString());
        }
    }
    public void finish(Database.BatchableContext bc){
        system.debug('finish Method');
    }
    public class SBSWrapper{
        public string servicename{get;set;}
        public string id{get;set;}
        public string prerequisiteItems{get;set;}
        public list<string> regionCodes{get;set;}
        public string domainName{get;set;}
        public string subDomainName{get;set;}
    }
}