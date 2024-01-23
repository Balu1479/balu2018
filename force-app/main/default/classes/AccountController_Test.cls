@isTest
public class AccountController_Test {
    @isTest
    public static void insertTriggerRecsTest(){
       list<Account> listAccs = TestDataFactory.createAccountRecs();
        insert listAccs;
        System.assertNotEquals('', listAccs[0].id, 'records are not empty' );
        try{
            test.startTest();
            AccountController.insertTriggerRecs(listAccs);
            AccountController.updateTriggerRecs(listAccs);
            test.stopTest();
        } catch (Exception Ex){
            system.debug(Ex);
        }
    }
}