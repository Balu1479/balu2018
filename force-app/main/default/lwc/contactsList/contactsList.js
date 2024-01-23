import { LightningElement,wire, track } from 'lwc';
import getListContact from '@salesforce/apex/ContactController.getListContact';

export default class ContactsList extends LightningElement {
    contactList = [];
    error;
    connectedCallback(){
        const x = 5; // bad pracice -- non descriptive name
        const itemCount = 5 // good practice - descriptive name
        console.log('x',x);
        console.log('itemCount',itemCount);
    }
 /* @wire(getListContact)
 contacts; */
 @wire(getListContact)
 wiredContacts({error, data}){
    console.log('data',data);
    if(data){
        this.contactList = data;
        this.error = undefined;
    } else if(error){
        this.error = error;
        this.contactList = undefined;
    }
 }
 
}