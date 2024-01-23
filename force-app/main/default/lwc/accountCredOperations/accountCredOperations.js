import { LightningElement } from 'lwc';
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import WEBSITE_FIELD from "@salesforce/schema/Account.Website";
import INDUSTRY_FIELD from "@salesforce/schema/Account.Industry";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from 'lightning/uiRecordApi';
export default class AccountCredOperations extends LightningElement {
    accountObject = ACCOUNT_OBJECT;
    myFields = [NAME_FIELD, WEBSITE_FIELD, INDUSTRY_FIELD];
    accountName;
    website;
    accountId;
    isAvailableAccount = false;
    craeteAccountRecord() {
        console.log('Successfully Account record is created');
        this.showToastMessage('Account record is created successfully', 'Success', 'Account record is created successfully');
    }
    showToastMessage(title, variant, message) {
        const event = new ShowToastEvent({
            title: title,
            variant: variant,
            message: message
        });
        this.dispatchEvent(event);
    }
    handleChange(event) {
        this.accountId = undefined;
        if (event.target.label === 'Account Name') {
            this.accountName = event.target.value;
        }
        if (event.target.label === 'Website') {
            this.website = event.target.value;
        }
    }
    createAccount() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.accountName;
        fields[WEBSITE_FIELD.fieldApiName] = this.website;
        const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(account => {
                this.accountId = account.id;
                this.showToastMessage('Success', 'Success', 'Account created');
                //this.accountName = this.accountName;
                this.isAvailableAccount = true;
            })
            .catch(error => {
                this.showToastMessage('Error while creating record', 'error', error.body.message);
        });
    }
    cancilAccount() {
        this.accountName = '';
        this.website = '';
    }
}