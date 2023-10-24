public with sharing class ServiceCatelogHelper {
    public static map<string,ServiceCateloguePrerequisitMapping__c> scpMapNew;
    public static map<String, set<String>> servicePreRequsitItemsMap;
    public static list<Service_Catelogue__c> getServiceCatalogueRecords(list<ServiceCatelogBatch.SBSWrapper> sbsresponse,map<string,Service_Catelogue__c> serviceCatalogueMap){
        map<string,Service_Catelogue__c> serviceCatalogueFinalMap = new map<string,Service_Catelogue__c>();
        for(ServiceCatelogBatch.SBSWrapper each :sbsresponse){
            Service_Catelogue__c eachOld = serviceCatalogueMap.containsKey(each.id) ? serviceCatalogueMap.get(each.id) : new Service_Catelogue__c();
            eachOld.ServiceId__c = each.id;
            eachOld.Status__c = 'Active';
            eachOld.Name = each.servicename;
            eachOld.Domain_Name__c = each.domainName;
            eachOld.Sub_Domain_Name__c = each.subDomainName;
            serviceCatalogueFinalMap.put(eachOld.ServiceId__c,eachOld);
        }
        serviceCatalogueFinalMap = inactiveServiceCatalogueRecords(serviceCatalogueMap,serviceCatalogueFinalMap);
        return serviceCatalogueFinalMap.values();
    }
    public static void upsertServiceCatalogueRecords(list<Service_Catelogue__c> catelogList){
        if(!catelogList.isEmpty()){
            Database.UpsertResult[] srList = Database.Upsert(catelogList, false);
            for (Database.UpsertResult sr : srList) {
                if (sr.isSuccess()) {
                    System.debug('Successfully upsertted Service catelog Id: ' + sr.getId());
                }
                else {
                    for(Database.Error err : sr.getErrors()) {
                        System.debug('The following error has occurred.');                    
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('Service catelog fields that affected this error: ' + err.getFields());
                    }
                }
            }
        }
    }
    public static map<String, set<String>> getServicePreRequsites(list<ServiceCatelogBatch.SBSWrapper> sbsresponse){
        list<String> preRequsitItemsList = new list<String>();
        servicePreRequsitItemsMap = new map<String, set<String>>();
        for(ServiceCatelogBatch.SBSWrapper sbsRes :sbsresponse){
            set<String> preRequsiteItemsSet = new set<String>();
            if(sbsRes.prerequisiteItems != null){
                String returnprerequisiteItems = sbsRes.prerequisiteItems.replaceAll('[\\p{Ps}\\p{Pe}]', '');
                String regex = 'and|or';
                if(returnprerequisiteItems.containsAny('and') || returnprerequisiteItems.containsAny('or')){
                    preRequsitItemsList = returnprerequisiteItems.split(regex);
                    for(String preReqItem : preRequsitItemsList){
                        preRequsiteItemsSet.add(preReqItem);
                    }
                    servicePreRequsitItemsMap.put(sbsRes.id, preRequsiteItemsSet);
                }else{
                    preRequsiteItemsSet.add(sbsRes.prerequisiteItems);
                    servicePreRequsitItemsMap.put(sbsRes.id, preRequsiteItemsSet);
                }
            }
        }
        return servicePreRequsitItemsMap;
    }
    public static list<ServiceCateloguePrerequisitMapping__c> serviceCataloguePrerequisiteRecords(list<ServiceCatelogBatch.SBSWrapper> sbsresponse,map<string,ServiceCateloguePrerequisitMapping__c> scpMap,map<string,Service_Catelogue__c> scMapNew){
        List<ServiceCateloguePrerequisitMapping__c> scpmList = new list<ServiceCateloguePrerequisitMapping__c>();
        scpMapNew = new map<string,ServiceCateloguePrerequisitMapping__c>();
        servicePreRequsitItemsMap = getServicePreRequsites(sbsresponse);
        for(ServiceCatelogBatch.SBSWrapper each :sbsresponse){
            if(servicePreRequsitItemsMap.containsKey(each.id)){
                set<string> preReqList = servicePreRequsitItemsMap.get(each.id);
                for(String eachPre : preReqList){
                    String eachPreSc1 =eachPre.replaceAll( '\\s+', '');
                    String eachSerPre = each.id+eachPreSc1;
                    if(!scpMap.containsKey(eachSerPre)){
                        ServiceCateloguePrerequisitMapping__c eachSCPM = new ServiceCateloguePrerequisitMapping__c();
                        Service_Catelogue__c eachSer = scMapNew.get(each.id);
                        Service_Catelogue__c eachPreSc = scMapNew.get(eachPreSc1);
                        eachSCPM.ServiceCatelogueId__c = eachSer.Id;
                        eachSCPM.PrerequisitID__c = eachPreSc.Id;
                        scpmList.add(eachSCPM);
                    }else{
                        ServiceCateloguePrerequisitMapping__c eachSCPM = scpMap.get(eachSerPre);
                        scpMapNew.put(eachSCPM.IdPrerequisitIdUnique__c, eachSCPM);
                    }
                }
            }
            
        }
        return scpmList;
    }
    public static map<string,Service_Catelogue__c> inactiveServiceCatalogueRecords(map<string,Service_Catelogue__c> serviceCatalogueMap,map<string,Service_Catelogue__c> serviceCatalogueFinalMap){
        for(string each :serviceCatalogueMap.keySet()){
            if(!serviceCatalogueFinalMap.containsKey(each)){
                Service_Catelogue__c eachService = serviceCatalogueMap.get(each);
                eachService.Status__c = 'InActive';
                eachService.Id = eachService.Id;
                serviceCatalogueFinalMap.put(eachService.ServiceId__c,eachService);
            }
        }
        return serviceCatalogueFinalMap;
    }
    public static void deletePrerequisiteRecords(map<string,ServiceCateloguePrerequisitMapping__c> scpMap){
        List<ServiceCateloguePrerequisitMapping__c> scpmListDelete = new list<ServiceCateloguePrerequisitMapping__c>();
        for(String each : scpMap.keySet()){
            if(!scpMapNew.containsKey(each)){
                ServiceCateloguePrerequisitMapping__c eachSCP = scpMap.get(each);
                scpmListDelete.add(eachSCP);
            }
        }
        if(!scpmListDelete.isEmpty() && ServiceCateloguePrerequisitMapping__c.SObjectType.getDescribe().isDeletable()){
            delete scpmListDelete; 
        }
    }
}