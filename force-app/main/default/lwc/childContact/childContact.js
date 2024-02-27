import { LightningElement, api } from "lwc";

export default class ChildContact extends LightningElement {
  @api contactsFromParent;
  @api accountsAndContacts;
  /* get accountRecords() {
    this.accounRecords = contactsFromParent;
    return this.accounRecords;
  } */
  @api
  showContacts(event) {
    let accountId = event.target.dataset.id;
    console.log("account id is", accountId);
    const eventNew = new CustomEvent("buttonclick", {
      detail: accountId
    });
    this.dispatchEvent(eventNew);
  }
  @api showAccount(event) {
    console.log("this is the show account method");
    let accountId = event.target.dataset.id;
    console.log("account id is 22", accountId);
    const eventAccountId = new CustomEvent("showaccount", {
      detail: accountId
    });
    this.dispatchEvent(eventAccountId);
  }
}