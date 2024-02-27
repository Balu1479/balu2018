import { LightningElement, track, wire } from "lwc";
import getAccountsRecords from "@salesforce/apex/AccountController.getAccountsRecords";
import getAccountAndContacts from "@salesforce/apex/AccountController.getAccountAndContacts";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const columns = [
  { label: "Name", fieldName: "name" },
  { label: "Phone", fieldName: "phone", type: "phone" }
];
export default class ParentAccount extends LightningElement {
  columns = columns;
  @track accountRecords = [];
  error;
  @track accountsAndContacts = [];
  @track contactsOld = [];
  @track contacts = [];
  @track initialContactRecords = [];
  isAccountAvailable = false;
  accountRecord;
  @wire(getAccountsRecords)
  accounts({ data, error }) {
    if (data) {
      this.accountRecords = JSON.parse(data);
      this.error = undefined;
    } else if (error) {
      console.log("error", error);
      this.error = error;
      this.accountRecords = undefined;
    }
  }
  @wire(getAccountAndContacts)
  accountsNew({ data, error }) {
    var contactsNew = [];
    if (data) {
      this.accountsAndContacts = JSON.parse(data);
      for (let key in this.accountsAndContacts) {
        if (this.accountsAndContacts[key].contacts.length !== 0) {
          this.contactsOld.push(this.accountsAndContacts[key].contacts);
        }
      }
      for (let i = 0; i < this.contactsOld.length; i++) {
        contactsNew = contactsNew.concat(this.contactsOld[i]);
      }
      this.contacts = contactsNew;
      this.initialContactRecords = contactsNew;
      this.error = undefined;
    } else if (error) {
      console.log("error", error);
      this.error = error;
      this.accountsAndContacts = undefined;
    }
  }
  showContacts(event) {
    var contactsByAccountId = [];
    this.contacts = [];
    console.log("account id is", event.detail);
    this.initialContactRecords.forEach((eachContact) => {
      if (eachContact.accountId === event.detail) {
        contactsByAccountId.push(eachContact);
      }
    });
    console.log("contactsByAccountId", contactsByAccountId);
    //this.contacts = contactsByAccountId;
    if (contactsByAccountId.length > 0) {
      this.contacts = contactsByAccountId;
      this.showToastMessage(
        `There are ${this.contacts.length} records associated with selected account`,
        "SUCCESS",
        `There are ${this.contacts.length} records associated with selected account`
      );
    } else {
      //this.contacts = [];
      this.showToastMessage(
        "There are no records associated with selected account",
        "Info",
        "There are no records associated with selected account"
      );
    }
  }
  showToastMessage(title, variant, message) {
    const event = new ShowToastEvent({
      title: title,
      variant: variant,
      message: message
    });
    this.dispatchEvent(event);
  }
  showAccount(event) {
    console.log("account id", event.detail);
    const accountNew = this.accountsAndContacts.find(
      (element) => element.id === event.detail
    );
    console.log("account new", accountNew);
    if (accountNew) {
      this.isAccountAvailable = true;
      this.accountRecord = accountNew;
      this.accountRecord = JSON.parse(JSON.stringify(accountNew));
      console.log("type", typeof this.accountRecord);
      console.log("account new", this.accountRecord);
    }
  }
  cancil() {
    this.isAccountAvailable = false;
  }
}