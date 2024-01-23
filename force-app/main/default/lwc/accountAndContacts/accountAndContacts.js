import { LightningElement, track } from "lwc";
import getAccountAndContacts from "@salesforce/apex/AccountController.getAccountAndContacts";
import deleteAccounts from "@salesforce/apex/AccountController.deleteAccounts";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import WEBSITE_FIELD from "@salesforce/schema/Account.Website";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import AccountAndContact from "@salesforce/label/c.AccountAndContacts";
import ShowDeatails from "@salesforce/label/c.ShowDeatails";
import Delete from "@salesforce/label/c.Delete";
import ShowMultipleContacts from "@salesforce/label/c.ShowMultipleContacts";
import ShowContacts from "@salesforce/label/c.ShowContacts";
import Close from "@salesforce/label/c.Close";
import Cancel from "@salesforce/label/c.Cancel";
import Save from "@salesforce/label/c.Save";
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
    Cancel
  };
  columns = columns;
  accountObject = ACCOUNT_OBJECT;
  myFields = [NAME_FIELD, WEBSITE_FIELD];
  @track accounts = [];
  @track contacts = [];
  @track contactsByAccountId = [];
  @track contatsByMultipleAccountsNew = [];
  @track initialAccountRecords = [];
  //@track contactsNew = [];
  isContactsAvailable = false;
  isMultipleContactsAvailable = false;
  selectedContactsCount;
  error;
  isShowModal = false;
  snoUpBool;
  snoDWBool;
  nameUpBool;
  nameDWBool;
  phoneUpBool;
  phoneDWBool;
  sortedDirection = 'asc';
  connectedCallback() {
    this.fectchAccounts();
  }
  fectchAccounts() {
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
      this.showToastMessage(
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
    /* for (let each in newArr) {
            console.log('each 83', newArr[each].id);

        } */
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
        this.showToastMessage(
          "Contacts are not available for this account",
          "Info",
          "Contacts are not available for this account"
        );
      }
    } else {
      this.showToastMessage(
        "Please select at least one account",
        "Info",
        "Please select at least one account"
      );
      this.isContactsAvailable = false;
    }
  }
  mapDetails() {
    const array1 = [1, 4, 7, 9];
    console.log("array1", array1);
    const map1 = array1.map((each) => each * 2);
    console.log("map1", map1);
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
    console.log("keyAndValueArray", keyAndValueArray);
    let namesMap = new Map();
    for (let each of keyAndValueArray) {
      console.log("each", each);
      //console.log('value',value);
      namesMap.set(each.key, each.value);
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
  /* removeDuplicates(arr) {
        console.log('arr',JSON.stringify(arr));
        return [...new set(arr)]
    } */
  deleteRecords() {
    let accountId;
    let deleteId = [...this.template.querySelectorAll("lightning-input")]
      .filter((element) => element.checked)
      .map((element) => element.dataset.id);
    if (deleteId.length === 1) {
      deleteId.forEach((each) => {
        accountId = each;
      });
      deleteAccounts({
        toDeleteId: accountId
      })
        .then((result) => {
          console.log('result',result);
          this.showToastMessage(
            "Account records has been deleted successfully",
            "Success",
            "Account records has been deleted successfully"
          );
        })
        .catch((error) => {
          this.error = error;
        });
    } else {
      console.log("For multiple records we use else part");
    }
  }
  craeteAccountRecord() {
    this.isShowModal = true;
    console.log("creating the account records");
    //this.showToastMessage('Account record is created successfully', 'Success', 'Account record is created successfully');
    //this.isShowModal = false;
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
        if ( this.sortedColumn === colName ) {
            this.sortedDirection = ( this.sortedDirection === 'asc' ? 'desc' : 'asc' );
        }
        else {
            this.sortedDirection = 'asc';
        }
        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
        switch (colName) {
            case "Name":
                if (this.sortedDirection === 'asc') {
                    this.nameUpBool = true
                } else {
                    this.nameDWBool = true;
                }
            break;
            case "Phone":
                if (this.sortedDirection === 'asc') {
                    this.phoneUpBool = true;
                } else {
                    this.phoneDWBool = true;
                }
            break;
          case "S.No":
                if (this.sortedDirection === 'asc') {
                    this.snoUpBool = true;
                } else {
                    this.snoDWBool = true;
                }
            break;
            default:
        }
        // sort the data
        const accountsRecords = JSON.parse(JSON.stringify(this.initialAccountRecords)).sort((a, b) => {
            console.log('column name 85', typeof (colName));
            if (colName === 'Phone') {
                a = a[ colName ] ? a[ colName ]:''; 
                b = b[ colName ] ? b[ colName ]: '';
            } else {
                a = a[ colName ] ? a[ colName ].toLowerCase() : ''; // Handle null values
                b = b[ colName ] ? b[ colName ].toLowerCase() : '';
            } 
            return a > b ? 1 * isReverse : -1 * isReverse;
        });
        this.accounts = accountsRecords;
    }
}