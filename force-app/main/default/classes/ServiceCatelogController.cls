public with sharing class ServiceCatelogController {
    @AuraEnabled
    public static string getServiceCatelogRecords(){
        list<ServiceCatelogWrapper> listWrapper = new list<ServiceCatelogWrapper>();
        for( Service_Catelogue__c each : [Select id, name, ServiceId__c, Status__c,Domain_Name__c,Sub_Domain_Name__c,(Select id, ServiceCatelogueId__c,ServiceCatelogueId__r.Name, ServiceCatelogueId__r.ServiceId__c, PrerequisitID__c, PrerequisitID__r.ServiceId__c,PrerequisitID__r.Name, IdPrerequisitIdUnique__c from Service_Catelogue_Prerequisit_Mappings__r) from Service_Catelogue__c WITH SECURITY_ENFORCED LIMIT 2]){
            ServiceCatelogWrapper eachSCW = new ServiceCatelogWrapper();
            list<PrerequisiteCatelogWrapper> preWrapList = new list<PrerequisiteCatelogWrapper>();
            eachSCW.name = each.name;
            eachSCW.id = each.id;
            eachSCW.serviceId = each.ServiceId__c;
            eachSCW.domainName = each.Domain_Name__c;
            eachSCW.subDomainName = each.Sub_Domain_Name__c;
            for(ServiceCateloguePrerequisitMapping__c eachPre : each.Service_Catelogue_Prerequisit_Mappings__r){
                system.debug('preServiceId---:'+eachPre.PrerequisitID__r.ServiceId__c);
                system.debug('serviceId---:'+eachPre.ServiceCatelogueId__r.ServiceId__c);
                PrerequisiteCatelogWrapper preWrap = new PrerequisiteCatelogWrapper();
                preWrap.name = eachPre.PrerequisitID__r.Name;
                preWrap.id = eachPre.id;
                preWrap.preServiceId = eachPre.PrerequisitID__r.ServiceId__c;
                preWrap.serviceId = eachPre.ServiceCatelogueId__r.ServiceId__c;
                preWrapList.add(preWrap);
            }
            eachSCW.obj = preWrapList;
            listWrapper.add(eachSCW);
            system.debug('preWrapList---:'+preWrapList.size());
            system.debug('preWrapList---:'+preWrapList);
        }
        system.debug('listWrapper---:'+listWrapper);
        return JSON.serialize(listWrapper);
    }
    @AuraEnabled
    public static String preRequisiteRecords(String serviceId){
        list<PrerequisiteCatelogWrapper> preRequisiteList = new list<PrerequisiteCatelogWrapper>();
        try {
            for(ServiceCateloguePrerequisitMapping__c preRequisite : [Select id, ServiceCatelogueId__r.ServiceId__c,
                                                                      PrerequisitID__c, PrerequisitID__r.ServiceId__c,PrerequisitID__r.Name from ServiceCateloguePrerequisitMapping__c WHERE ServiceCatelogueId__r.ServiceId__c =: serviceId WITH SECURITY_ENFORCED]){
                                                                          PrerequisiteCatelogWrapper each = new PrerequisiteCatelogWrapper();
                                                                          each.preServiceId = preRequisite.PrerequisitID__r.ServiceId__c;
                                                                          each.name = preRequisite.PrerequisitID__r.Name;
                                                                          each.id = preRequisite.id;
                                                                          each.serviceId = preRequisite.ServiceCatelogueId__r.ServiceId__c;
                                                                          preRequisiteList.add(each);
                                                                      }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return JSON.serialize(preRequisiteList);
    }
    public class ServiceCatelogWrapper{
        public string id{get;set;}
        public string name{get;set;}
        public string serviceId{get;set;}
        public string domainName{get;set;}
        public string subDomainName{get;set;}
        list<PrerequisiteCatelogWrapper> obj{get;set;}
    }
    public class PrerequisiteCatelogWrapper{
        public string name{get;set;}
        public string id{get;set;}
        public string preServiceId{get;set;}
        public string serviceId{get;set;}
    }
}