public with sharing class ServiceCatelogRegionHelper {
    public static map<string,ServiceCreditRegionMapping__c> scrcRegioMappingNew;
    public static map<string,ServiceCatelogueRegionCode__c> serviceCreditRegionMap;
    public static void insertserviceCataloguePrerequisiteRecords(list<ServiceCateloguePrerequisitMapping__c> serviceCataloguePrerequisiteRecords){
        if(!serviceCataloguePrerequisiteRecords.isEmpty()){
            Database.SaveResult[] srscpmList = Database.insert(serviceCataloguePrerequisiteRecords,false);
            for(Database.SaveResult each :srscpmList){
                if (each.isSuccess()) {
                    System.debug('Successfully inserted ServiceCateloguePrerequisitMapping__c Id: ' + each.getId());
                }else {
                    for(Database.Error err : each.getErrors()) {
                        System.debug('The following error has occurred.');                    
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('Account fields that affected this error: ' + err.getFields());
                    }
                    
                }
            }
        }
    }
    public static list<ServiceCreditRegionMapping__c> getServiceCatalogueRegionRelationRecords(list<ServiceCatelogBatch.SBSWrapper> sbsresponse,map<string,ServiceCreditRegionMapping__c> scrcRegioMapping,map<string,Service_Catelogue__c> serviceCatalogueMap){
        scrcRegioMappingNew = new map<string,ServiceCreditRegionMapping__c>();
        list<ServiceCreditRegionMapping__c> scrpList = new list<ServiceCreditRegionMapping__c>();
        serviceCreditRegionMap = new map<string,ServiceCatelogueRegionCode__c>();
        for(ServiceCatelogueRegionCode__c scrRec : [Select id,RegionCode__c,RegionName__c from ServiceCatelogueRegionCode__c WITH SECURITY_ENFORCED]){
            serviceCreditRegionMap.put(scrRec.RegionCode__c, scrRec);
        }
        for(ServiceCatelogBatch.SBSWrapper each :sbsresponse){
            for(string eachStr : each.regionCodes){
                String eachStrCode = each.id + eachStr;
                if(!scrcRegioMapping.containsKey(eachStrCode)){
                    ServiceCreditRegionMapping__c eachSCRM = new ServiceCreditRegionMapping__c();
                    Service_Catelogue__c eachSC = serviceCatalogueMap.get(each.id);
                    ServiceCatelogueRegionCode__c eachSCRC = serviceCreditRegionMap.get(eachStr);
                    eachSCRM.ServiceCatelogueID__c = eachSC.id;
                    eachSCRM.RegionID__c = eachSCRC.id;
                    scrpList.add(eachSCRM);
                }else{
                    ServiceCreditRegionMapping__c eachSCRM = scrcRegioMapping.get(eachStrCode);
                    scrcRegioMappingNew.put(eachSCRM.Service_Catelogue_Region_Code__c, eachSCRM);
                }
            }
        }
        return scrpList;
    }
    public static void insertServiceRegionRelationRecords(list<ServiceCreditRegionMapping__c> scrpList){
        if(!scrpList.isEmpty()){
            Database.SaveResult[] srscrpList = Database.insert(scrpList,false);
            for(Database.SaveResult each :srscrpList){
                if (each.isSuccess()) {
                    System.debug('Successfully inserted ServiceCreditRegionMapping__c Id: ' + each.getId());
                }else {
                    for(Database.Error err : each.getErrors()) {
                        System.debug('The following error has occurred.');                    
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('Account fields that affected this erro r: ' + err.getFields());
                    }
                }
            }
        }
    }
    public static void deleteServiceCatalogueRegionRelationRecords(map<string,ServiceCreditRegionMapping__c> scrcRegioMapping){
        list<ServiceCreditRegionMapping__c> scrmListDelete = new list<ServiceCreditRegionMapping__c>();
        List<String> scrmList = new List<String>();
        for(String each : scrcRegioMapping.keySet()){
            if(!scrcRegioMappingNew.containsKey(each)){
                ServiceCreditRegionMapping__c eachSCRM = scrcRegioMapping.get(each);
                //scrmList.add(eachSCRM.Service_Catelogue_Region_Code__c);
                scrmListDelete.add(eachSCRM);
            }
        }
        /* for(ServiceCreditRegionMapping__c each :[Select id,Service_Catelogue_Region_Code__c  from  ServiceCreditRegionMapping__c Where Service_Catelogue_Region_Code__c IN :scrmList  WITH SECURITY_ENFORCED]){
            scrmListDelete.add(each);
        } */
        if(!scrmListDelete.isEmpty() && ServiceCreditRegionMapping__c.SObjectType.getDescribe().isDeletable()){
            Delete scrmListDelete;
        }
    }
}