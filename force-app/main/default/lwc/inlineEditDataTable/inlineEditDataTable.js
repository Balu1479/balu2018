import { LightningElement,track,wire } from 'lwc';
import getBooks from '@salesforce/apex/BookController.getBooks';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

// columns
const columns = [
    {
        label: 'Category',
        fieldName: 'Category__c',
        type: 'text',
    }, {
        label: 'Count',
        fieldName: 'Count__c',
        type: 'Number',
        editable: true,
    }, {
        label: 'Price',
        fieldName: 'Price__c',
        type: 'Number',
        editable: true,
    }, {
        label: 'Delivery Time',
        fieldName: 'Delivery_Time__c',
        type: 'Time',
        editable: true,
    }, {
        label: 'US Price',
        fieldName: 'US_Price__c',
        type: 'Currency',
        editable: true,
    }
];

export default class InlineEditDataTable extends LightningElement {
    columns = columns;
    @track contacts;
    saveDraftValues = [];
 
    @wire(getBooks)
    contactData(result) {
        this.contacts = result;
        if (result.error) {
            this.contacts = undefined;
        }
    };
 
    handleSave(event) {
        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        // Updateing the records using the UiRecordAPi
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.ShowToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.saveDraftValues = [];
            return this.refresh();
        }).catch(error => {
            console.log('error',error);
            this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }
 
    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
                title: title,
                message:message,
                variant: variant,
                mode: mode
            });
            this.dispatchEvent(evt);
    }
 
    // This function is used to refresh the table once data updated
    async refresh() {
        await refreshApex(this.contacts);
    }
}