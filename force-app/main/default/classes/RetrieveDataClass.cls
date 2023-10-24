public class RetrieveDataClass {
    public static void getData(){
        list<mainWrapper> listWrapper = new list<mainWrapper>();
        list<childWrapper> listChildWrap = new list<childWrapper>();
        List<Service_Catelogue__c> listOfServices = [Select id, name, ServiceId__c, Status__c,(Select id, ServiceCatelogueId__c,ServiceCatelogueId__r.Name, ServiceCatelogueId__r.ServiceId__c, PrerequisitID__c, PrerequisitID__r.ServiceId__c,PrerequisitID__r.Name, IdPrerequisitIdUnique__c from Service_Catelogue_Prerequisit_Mappings__r) from Service_Catelogue__c];
        for(Service_Catelogue__c sc : listOfServices){
            System.debug('sc = > '+sc.name + '  '+ sc.ServiceId__c);
            //put all the required fields in main wrapper class
            mainWrapper mw = new mainWrapper();
            mw.name = sc.name;
            mw.serId = sc.ServiceId__c;
            //listWrapper.add(mw);
            for(ServiceCateloguePrerequisitMapping__c scp : sc.Service_Catelogue_Prerequisit_Mappings__r){
                System.debug('scp => '+scp.ServiceCatelogueId__r.Name);
                //put all required fields in a child wrapper class of main wrapper class
                childWrapper cw = new childWrapper();
                cw.name = scp.PrerequisitID__r.Name;
                cw.serId = scp.PrerequisitID__r.ServiceId__c;
                mw.obj = cw;
            }
            listWrapper.add(mw);
            system.debug('listWrapper---:'+listWrapper);
        }
    }
    
    //for main services
    public class mainWrapper{
        string name;
        string serId;
        childWrapper obj;
    }
    
    //for prerequisite services
    public class childWrapper{
        string name;
        string serId;
    }
}