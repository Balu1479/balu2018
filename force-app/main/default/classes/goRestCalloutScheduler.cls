public class goRestCalloutScheduler implements schedulable{
    public void execute(SchedulableContext sc){
        goRestCalloutBatch bc = new goRestCalloutBatch();
            database.executeBatch(bc);
    }

}