import { LightningElement } from 'lwc';

export default class FlowFromLwc extends LightningElement {
    message;
    get inputVariables(){
        return [];
    }
    handleStatusChange(event){
        console.log('this is for test flow from lwc',JSON.stringify(event.detail));
        if(event.detail.status ==='FINISHED' && event.detail.outputVariables){
            this.message = event.detail;
        }
    }
    get messageFromFlow() {
        return this.message
            ? JSON.stringify(this.message, null, 2)
            : '';
    }
}