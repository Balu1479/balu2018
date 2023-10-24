public class SessionPartitionController {
    public static String addCacheToSession(){
        String creditsCount;
        Cache.SessionPartition sessionPart = Cache.Session.getPartition('local.UnRedeemedCredits');
        /*if (sessionPart.contains('UnRedeemedCredits')) {
            creditsCount = '10';
            sessionPart.put('UnRedeemedCredits', creditsCount);
            system.debug('if sessionPart--:'+sessionPart);
          }*/
        creditsCount = '10';
        sessionPart.put('UnRedeemedCredits', creditsCount);
        system.debug('if sessionPart--:'+sessionPart);
        system.debug('sessionPart--:'+sessionPart);
        return creditsCount;
    }
    public static Boolean getSessionCache(String creditsCount){
        Cache.SessionPartition sessionPart = Cache.Session.getPartition('local.UnRedeemedCredits');
        // Add cache value to the partition
        if (!sessionPart.contains('UnRedeemedCredits')) {
            Boolean falg = true;
            sessionPart.put('UnRedeemedCredits', falg);
        }
        // Retrieve cache value from the partition
        system.debug('UnRedeemedCredits--:'+(Boolean)sessionPart.get('UnRedeemedCredits'));
        return (Boolean)sessionPart.get('UnRedeemedCredits');
    }
    
}