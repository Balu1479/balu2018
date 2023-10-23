public class CacheManager {
    private Boolean cacheEnabled;
        
    public CacheManager() {
        cacheEnabled = true;
    }
    
    public Boolean toggleEnabled() { // Use for testing misses
        cacheEnabled = !cacheEnabled;
        return cacheEnabled;
    }

    public Object get(String key) {
        if (!cacheEnabled){
            return null;
        } 
        Object value = Cache.Session.get(key);
        if (value != null){
            System.debug(LoggingLevel.DEBUG, 'Hit for key ' + key);
            //return value;
        } 
        return value;
    }

    public void put(String key, Object value, Integer ttl) {
        if (!cacheEnabled) {
            return;
        }
        Cache.Session.put(key, value, ttl);
        // for redundancy, save to DB
        System.debug(LoggingLevel.DEBUG, 'put() for key ' + key);
    }

    public Boolean remove(String key) {
        if (!cacheEnabled){
            return false;
        } 
        Boolean removed = Cache.Session.remove(key);
        if (removed) { 
            System.debug(LoggingLevel.DEBUG, 'Removed key ' + key);
            return true;
        } else{
            return false;
        } 
    }
}