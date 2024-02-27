import { LightningElement, track, wire } from "lwc";
import getAccountAndContacts from "@salesforce/apex/AccountController.getAccountAndContacts";
import deleteAccounts from "@salesforce/apex/AccountController.deleteAccounts";
import deleteAccountRecords from "@salesforce/apex/AccountController.deleteAccountRecords";
import createAccountRecord from "@salesforce/apex/AccountController.createAccountRecord";
import updateAccountRecords from "@salesforce/apex/AccountController.updateAccountRecords";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import WEBSITE_FIELD from "@salesforce/schema/Account.Website";
import AccountAndContact from "@salesforce/label/c.AccountAndContacts";
import ShowDeatails from "@salesforce/label/c.ShowDeatails";
import Delete from "@salesforce/label/c.Delete";
import ShowMultipleContacts from "@salesforce/label/c.ShowMultipleContacts";
import ShowContacts from "@salesforce/label/c.ShowContacts";
import Close from "@salesforce/label/c.Close";
import Cancel from "@salesforce/label/c.Cancel";
import Save from "@salesforce/label/c.Save";
import Update from "@salesforce/label/c.Update";
import { refreshApex } from "@salesforce/apex";
import { showToastMessage } from 'c/showToastMessage';

const columns = [
  {
    label: "First Name",
    fieldName: "firstName"
  },
  {
    label: "Last Name",
    fieldName: "lastName"
  }
];
export default class AccountAndContacts extends LightningElement {
  label = {
    AccountAndContact,
    ShowDeatails,
    Delete,
    ShowMultipleContacts,
    ShowContacts,
    Close,
    Save,
    Cancel,
    Update
  };
  columns = columns;
  accountObject = ACCOUNT_OBJECT;
  myFields = [NAME_FIELD, WEBSITE_FIELD];
  @track accounts = [];
  @track contacts = [];
  @track contactsByAccountId = [];
  @track contatsByMultipleAccountsNew = [];
  @track initialAccountRecords = [];
  @track wiredAccounts = [];
  //@track contactsNew = [];
  @track accObj = {};
  @track accountToUpdateRecords = {};
  isContactsAvailable = false;
  isMultipleContactsAvailable = false;
  selectedContactsCount;
  error;
  isShowModal = false;
  isAccountModal = false;
  isAccountCreate = false;
  isAccountUpdate = false;
  nameToUpdate;
  snoUpBool;
  snoDWBool;
  nameUpBool;
  nameDWBool;
  phoneUpBool;
  phoneDWBool;
  sortedDirection = "asc";
  formattedLabelText;
  @track accountRecordsToDisplay;
  totalrecords;
  pageNumber = 1;
  pageSize = 7;
  totalpages;
  disableFirstButton = true;
  disableLastButton = false;
  disablePreviousButton = true;
  disableNextButton = false;
  connectedCallback() {
    //this.fectchAccounts();
    const tooltip =
      "Access to the Incident Dashboard requires an HPE Support Service Agreement.";
    const labelArr = tooltip.split(" ");
    //console.log("labelArr", labelArr);
    const midIndex = Math.floor(labelArr.length / 1.5);
    /* console.log("midIndex", midIndex);
    console.log("slice", [...labelArr.slice(0, midIndex)]);
    console.log("slice", [...labelArr.slice(midIndex)].join(" ")); */
    const formattedLabel = [
      ...labelArr.slice(0, midIndex),
      "<br>",
      ...labelArr.slice(midIndex)
    ].join(" ");
    //console.log("formattedLabel", formattedLabel);
    this.formattedLabelText = formattedLabel;
    //return formattedLabel;
  }
  /* fectchAccounts() { // Imparative method
    getAccountAndContacts()
      .then((result) => {
        this.accounts = JSON.parse(result);
        this.initialAccountRecords = JSON.parse(result);
        this.error = undefined;
        for (let key in this.accounts) {
          if (this.accounts[key].contacts.length !== 0) {
            this.contacts.push(this.accounts[key].contacts);
          }
        }
      })
      .catch((error) => {
        this.error = error;
        this.accounts = undefined;
      });
  } */
  @wire(getAccountAndContacts)
  accountsRecords(result) {
    this.wiredAccounts = result;
    if (result.data) {
      this.accounts = JSON.parse(result.data);
      this.initialAccountRecords = JSON.parse(result.data);
      this.totalrecords = this.accounts.length;
      this.error = undefined;
      for (let key in this.accounts) {
        if (this.accounts[key].contacts.length !== 0) {
          this.contacts.push(this.accounts[key].contacts);
        }
      }
      this.paginationHelper();
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
      this.accounts = [];
    }
  }
  showContacts(event) {
    let accountId = event.target.dataset.id;
    //console.log('Contacts', JSON.stringify(this.contacts));
    var contactsNew = [];
    //var contactsNewValues = [];
    for (let i = 0; i < this.contacts.length; i++) {
      contactsNew = contactsNew.concat(this.contacts[i]);
    }
    /* for (let each of contactsNew) {
            if (each.accountId === accountId) {
                contactsNewValues.push(each);
            }
        } */
    let contactsNewValues = contactsNew.filter(
      (element) => element.accountId === accountId
    );
    //console.log('contactsNewValues', JSON.stringify(contactsNewValues));
    if (contactsNewValues.length > 0) {
      this.isContactsAvailable = true;
      this.contactsByAccountId = contactsNewValues;
      this.selectedContactsCount = this.contactsByAccountId.length;
    } else {
      showToastMessage(
        "The contacts are not available for selected account",
        "Info",
        "The contacts are not available for selected account"
      );
    }
  }
  cancel() {
    this.isContactsAvailable = false;
    this.isMultipleContactsAvailable = false;
    this.isShowModal = false;
    this.isAccountModal = false;
    this.isAccountCreate = false;
    this.isAccountUpdate = false;
  }
  showDeatails() {
    let contactValues = [
      [
        {
          lastName: "Levy",
          id: "0030o00002b0PoxAAE",
          firstName: "Babara",
          accountId: "0010o00002BmlYFAAZ"
        },
        {
          lastName: "Davis",
          id: "0030o00002b0PoyAAE",
          firstName: "Josh",
          accountId: "0010o00002BmlYFAAZ"
        }
      ]
    ];
    var newArr = [];
    for (let i = 0; i < contactValues.length; i++) {
      newArr = newArr.concat(contactValues[i]);
    }
  }
  showAllContacts() {
    var contactsNewByAccounts = [];
    const checkedBoxesIds = [
      ...this.template.querySelectorAll("lightning-input")
    ]
      .filter((element) => element.checked)
      .map((element) => element.dataset.id);
    let map = new Map();
    checkedBoxesIds.forEach((value) => {
      map.set(value, "value" + value);
    });
    let contatsByMultipleAccounts = [];
    for (let i = 0; i < this.contacts.length; i++) {
      contactsNewByAccounts = contactsNewByAccounts.concat(this.contacts[i]);
    }
    if (map.size > 0) {
      this.isContactsAvailable = true;
      for (let each of contactsNewByAccounts) {
        if (map.has(each.accountId)) {
          contatsByMultipleAccounts.push(each);
        }
      }
      this.contactsByAccountId = contatsByMultipleAccounts;
      if (this.contactsByAccountId.length > 0) {
        this.selectedContactsCount = this.contactsByAccountId.length;
      } else {
        showToastMessage(
          "Contacts are not available for this account",
          "Info",
          "Contacts are not available for this account"
        );
      }
    } else {
      showToastMessage(
        "Please select at least one account",
        "Info",
        "Please select at least one account"
      );
      this.isContactsAvailable = false;
    }
  }
  mapDetails() {
    const keyAndValueArray = [
      {
        key: 1,
        value: "Bala"
      },
      {
        key: 2,
        value: "Rajee"
      },
      {
        key: 3,
        value: "Moksha"
      },
      {
        key: 4,
        value: "Lavanya"
      }
    ];
    let namesMap = new Map();
    for (let each of keyAndValueArray) {
      //console.log('value',value);
      namesMap.set(each.key, each.value);
    }
  }
  /* showToastMessage(title, variant, message) {
    const event = new ShowToastEvent({
      title: title,
      variant: variant,
      message: message
    });
    this.dispatchEvent(event);
  } */
  deleteRecords() {
    let accountId = [];
    let deleteId = [...this.template.querySelectorAll("lightning-input")]
      .filter((element) => element.checked)
      .map((element) => element.dataset.id);
    if (deleteId.length >= 1) {
      deleteId.forEach((each) => {
        accountId.push(each);
      });
      deleteAccounts({
        toDeleteId: accountId
      })
        .then((result) => {
          console.log("result", result);
          refreshApex(this.wiredAccounts);
          showToastMessage(
            "Account records has been deleted successfully",
            "Success",
            "Account record(s) has been deleted successfully"
          );
        })
        .catch((error) => {
          this.error = error;
        });
    } else {
      showToastMessage(
        "Please select one account record to delete",
        "Info",
        "Please select atleast one account record to delete"
      );
    }
  }
  craeteAccountRecordByForm() {
    this.isAccountModal = true;
    this.isShowModal = true;
    //this.showToastMessage('Account record is created successfully', 'Success', 'Account record is created successfully');
    //this.isShowModal = false;
  }
  craeteAccountRecord() {
    createAccountRecord({ accountObj: JSON.stringify(this.accObj) })
      .then((result) => {
        console.log("result", result);
        showToastMessage(
          "Account record has been created",
          "Success",
          "Account record has beed created successfully"
        );
        this.isAccountCreate = false;
        refreshApex(this.wiredAccounts);
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        showToastMessage(
          "The account not created",
          "Success",
          `The selected account not created by the reason ${this.error.body.message}`
        );
      });
  }
  openAccountForm() {
    this.isAccountCreate = true;
  }
  handleChange(event) {
    let name = event.target.value;
    this.accObj.name = name;
  }
  sortRecs(event) {
    this.snoUpBool = false;
    this.snoDWBool = false;
    this.nameUpBool = false;
    this.nameDWBool = false;
    this.phoneDWBool = false;
    this.phoneUpBool = false;
    let colName = event.target.name;
    if (colName) {
      this.sortedColumn = colName;
    } else {
      colName = this.sortedColumn;
    }
    if (this.sortedColumn === colName) {
      this.sortedDirection = this.sortedDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortedDirection = "asc";
    }
    let isReverse = this.sortedDirection === "asc" ? 1 : -1;
    switch (colName) {
      case "Name":
        if (this.sortedDirection === "asc") {
          this.nameUpBool = true;
        } else {
          this.nameDWBool = true;
        }
        break;
      case "Phone":
        if (this.sortedDirection === "asc") {
          this.phoneUpBool = true;
        } else {
          this.phoneDWBool = true;
        }
        break;
      case "S.No":
        if (this.sortedDirection === "asc") {
          this.snoUpBool = true;
        } else {
          this.snoDWBool = true;
        }
        break;
      default:
    }
    // sort the data
    const accountsRecords = JSON.parse(
      JSON.stringify(this.initialAccountRecords)
    ).sort((a, b) => {
      if (colName === "Phone") {
        a = a[colName] ? a[colName] : "";
        b = b[colName] ? b[colName] : "";
      } else {
        a = a[colName] ? a[colName].toLowerCase() : ""; // Handle null values
        b = b[colName] ? b[colName].toLowerCase() : "";
      }
      return a > b ? 1 * isReverse : -1 * isReverse;
    });
    this.accounts = accountsRecords;
  }
  deleteSingleRecord() {
    let accountId;
    let deleteId = [...this.template.querySelectorAll("lightning-input")]
      .filter((element) => element.checked)
      .map((element) => element.dataset.id);
    if (deleteId.length === 1) {
      deleteId.forEach((eachId) => {
        accountId = eachId;
      });
      deleteAccountRecords({ toDeleteId: accountId })
        .then((result) => {
          console.log("result", result);
          refreshApex(this.wiredAccounts);
          showToastMessage(
            "Account record has been deleted successfully",
            "success",
            "Account record has been deleted successfully"
          );
          this.error = undefined;
        })
        .catch((error) => {
          this.error = error;
          showToastMessage(
            "The record is not deleted",
            "Info",
            `The record is not deleted due to the ${this.error}`
          );
        });
    } else {
      showToastMessage(
        "Atleast select one account record to delete",
        "Info",
        "Please select account record to delete"
      );
    }
  }
  openAccountToUpdate() {
    this.isAccountUpdate = true;
    let accountId = [...this.template.querySelectorAll("lightning-input")]
      .filter((element) => element.checked)
      .map((element) => element.dataset.id);
    let accountRecords = this.accounts.find(
      (element) => element.id === accountId[0]
    );
    this.nameToUpdate = accountRecords.name;
    this.accountToUpdateRecords.id = accountId[0];
  }
  handleUpdateChange(event) {
    let name = event.target.value;
    this.accountToUpdateRecords.name = name;
  }
  updateAccountRecord() {
    updateAccountRecords({
      accountToUpdate: JSON.stringify(this.accountToUpdateRecords)
    })
      .then((result) => {
        console.log("result", result);
        showToastMessage(
          "The account has been updated",
          "Success",
          "The selected account has been successfully"
        );
      })
      .catch((error) => {
        this.error = error;
        showToastMessage(
          "The account not updated",
          "Success",
          `The selected account not updated by the reason ${this.error.body.message}`
        );
      });
  }
  firstPage() {
    this.pageNumber = 1;
    this.paginationHelper();
    this.disableFirstButton = true;
    this.disablePreviousButton = true;
    this.disableLastButton = false;
    this.disableNextButton = false;
  }
  lastPage() {
    this.pageNumber = this.totalpages;
    this.paginationHelper();
    this.disableFirstButton = false;
    this.disablePreviousButton = false;
    if (this.pageNumber === this.totalpages) {
      this.disableLastButton = true;
      this.disableNextButton = true;
    } else {
      this.disableLastButton = false;
    }
  }
  nextPage() {
    this.pageNumber = this.pageNumber + 1;
    this.paginationHelper();
    this.disableFirstButton = false;
    this.disablePreviousButton = false;
    if (this.pageNumber === this.totalpages) {
      this.disableNextButton = true;
      this.disableLastButton = true;
    } else {
      this.disableNextButton = false;
      this.disableLastButton = false;
    }
  }
  previousPage() {
    this.pageNumber = this.pageNumber - 1;
    this.paginationHelper();
    this.disableNextButton = false;
    if (this.pageNumber === 1) {
      this.disablePreviousButton = true;
      this.disableFirstButton = true;
    } else {
      this.disablePreviousButton = false;
      this.disableFirstButton = false;
      this.disableLastButton = false;
    }
  }
  paginationHelper() {
    this.accountRecordsToDisplay = [];
    this.totalpages = Math.ceil(this.totalrecords / this.pageSize);
    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
    } else if (this.pageNumber >= this.totalpages) {
      this.pageNumber = this.totalpages;
    }
    for (
      let i = (this.pageNumber - 1) * this.pageSize;
      i < this.pageNumber * this.pageSize;
      i++
    ) {
      if (i === this.totalrecords) {
        break;
      }
      this.accountRecordsToDisplay.push(this.initialAccountRecords[i]);
    }
  }
}