public class SessionPartitionController {
    private static final string PARTITION_NAME = 'local.CreditsCount';
    private static final string PARTITION_KEY = 'creditsCount';
    public static String addCacheToSession(){
        String creditsCount;
        Cache.SessionPartition sessionPart = Cache.Session.getPartition('local.UnRedeemedCredits');
        creditsCount = '10';
        sessionPart.put('UnRedeemedCredits', creditsCount);
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
    public static void getOrgCacheValues(){
        Integer creditsCount;
        try {
            Cache.OrgPartition orgPart = Cache.Org.getPartition(PARTITION_NAME);
            creditsCount = (Integer)orgPart.get(PARTITION_KEY);
            if(creditsCount != null){
                Integer unredemeedCount = 100;
                Cache.OrgPartition orgPartNew = Cache.Org.getPartition(PARTITION_NAME);
                orgPartNew.put(PARTITION_KEY, unredemeedCount);
            }
            system.debug('creditsCount--:'+creditsCount);
        } catch (Exception Ex){
            system.debug('Ex--:'+Ex);
        }
    }
}