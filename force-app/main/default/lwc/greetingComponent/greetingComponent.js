import { LightningElement,wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Id from "@salesforce/user/Id";
import NAME_FIELD from '@salesforce/schema/User.Name';

export default class GreetingComponent extends LightningElement {
    userId = Id;
    isLogged = false;
    name;
    error;
    connectedCallback(){
        this.isLogged = true;
    }
    get greetingMessage(){
        return `Wecome to the application Dear user Id ${this.userId}`;
    }
    @wire(getRecord, {
        recordId:Id,
        fields:[NAME_FIELD]
    }) wireUser({error,data}){
        if(data){
            console.log('data',data);
            this.name = `Wecome to the application Dear user ${data.fields.Name.value}`
            console.log('data',this.name);
            this.error = undefined;
        } else if (error){
            this.error = error;
            this.name = undefined;
        }
    }
}