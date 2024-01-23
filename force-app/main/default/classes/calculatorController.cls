public with sharing class CalculatorController {
    @AuraEnabled
    public static decimal addMethod(decimal x, decimal y){
        try {
            decimal result = x + y ;
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static decimal devideMethod(decimal x, decimal y){
        try {
            decimal result = x / y ;
            system.debug(result);
            return result;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getCreditsCount(){
        CalculatorWrapper creditsWrapper = new CalculatorWrapper();
        try {
            creditsWrapper.unredeemedCount = '2';
            creditsWrapper.criticalExpiringCount = '5';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return JSON.serialize(creditsWrapper);
    }
    public class CalculatorWrapper{
        public string unredeemedCount{get;set;}
        public string criticalExpiringCount{get;set;}
    }
}