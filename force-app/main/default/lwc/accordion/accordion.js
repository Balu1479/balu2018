import { LightningElement, track } from "lwc";
import Close from "@salesforce/label/c.Close";
import Cancel from "@salesforce/label/c.Cancel";
import Save from "@salesforce/label/c.Save";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const stateNames = [
  /* {
        name:'Select All',
        id:'IN'
    }, */
  {
    name: "Andra Pradesh",
    id: "IN"
  },
  {
    name: "Telangana",
    id: "IN"
  },
  {
    name: "Chogoku",
    id: "JA"
  },
  {
    name: "Chubu",
    id: "JA"
  },
  {
    name: "Altai Territory",
    id: "RU"
  },
  {
    name: "Amur Region",
    id: "RU"
  },
  {
    name: "Karnataka",
    id: "IN"
  }
];
const stuNames = [
  {
    name: "Bala",
    state: "Andra Pradesh",
    id: "IN"
  },
  {
    name: "Rjaee",
    state: "Karnataka",
    id: "IN"
  },
  {
    name: "Moksha",
    state: "Amur Region",
    id: "RU"
  },
  {
    name: "Meenakshi",
    state: "Chubu",
    id: "JA"
  }
];
const columns = [
  { label: "Student Name", fieldName: "name" },
  { label: "State", fieldName: "state" },
  { label: "Id", fieldName: "id" }
];

export default class Accordion extends LightningElement {
  /* activeSectionMessage = '';
    handleToggleSection(event) {
        this.activeSectionMessage =
            'Open section name:  ' + event.detail.openSections;
    }
    handleSetActiveSectionC() {
        const accordion = this.template.querySelector('.example-accordion');
        accordion.activeSectionName = 'C';
    } */
  label = {
    Close,
    Save,
    Cancel
  };
  columns = columns;
  @track states = [];
  @track students = [];
  isStatesAvailable = false;
  isCountriesAvailable = true;
  isShowModal = false;
  isRussiaStatesAvailable = false;
  //isCancel = false;
  connectedCallback() {
    /* this.countries = stateNames;
        console.log('countries',this.countries); */
  }
  handleIndiaChange(event) {
    let isChecked = event.detail.checked;
    if (isChecked) {
      this.isStatesAvailable = true;
      stateNames.forEach((each) => {
        if (each.id === "IN") {
          this.states.push(each);
        }
      });
      console.log("states 104", this.states);
    } else {
      this.isStatesAvailable = false;
      this.states = [];
    }
  }
  handleIndiaStatesChange(event) {
    this.isShowModal = true;
    let isChecked = event.detail.checked;
    let stateName = event.target.dataset.name;
    console.log("stateName", stateName);
    if (isChecked) {
      /* stuNames.forEach((each) =>{
                if( stateName === each.state){
                    this.students.push(each);
                }
            }); */
      // alternate way by using filter method
      this.students = stuNames.filter((element) => element.state === stateName);
      console.log("students", this.students.length);
      if (this.students.length === 0) {
        this.showToastMesage(
          "Records are not exist for selected state",
          "Records are not exist for selected state",
          "Info"
        );
        this.isShowModal = false;
      }
    } else {
      this.isShowModal = false;
      this.students = [];
    }
  }
  cancel(event) {
    this.isShowModal = false;
    this.students = [];
    let isSelected = this.template.querySelectorAll('[data-id="checkbox1"]');
    for (let each of isSelected) {
      each.checked = event.target.unchecked;
    }
  }
  handleAll(event) {
    this.isShowModal = true;
    let isChecked = event.target.checked;
    let isSelected = this.template.querySelectorAll('[data-id="checkbox1"]');
    let stateName = event.target.label;
    if (stateName && isChecked) {
      for (let each of isSelected) {
        each.checked = event.target.checked;
      }
      stuNames.forEach((studentName) => {
        if (studentName.id === "IN") {
          this.students.push(studentName);
        }
      });
    } else {
      this.isShowModal = false;
      this.students = [];
      for (let each of isSelected) {
        each.checked = event.target.unchecked;
      }
    }
  }
  showIndianRecords() {
    let isChecked = this.template.querySelectorAll('[data-id="checkbox1"]');
    for (let i = 0; i < isChecked.length(); i++) {
      console.log("i value", i);
    }
  }
  handleRussiaChange(event) {
    this.isRussiaStatesAvailable = true;
    let isChecked = event.target.checked;
    this.states = [];
    if (isChecked) {
      this.states = stateNames.filter((element) => element.id === "RU");
    } else {
      this.isRussiaStatesAvailable = false;
    }
  }
  showRussiaRecords() {
    //var contactsNewByAccounts = [];
    console.log("showRussiaRecords");
    const checkedBoxesIds = this.template
      .querySelectorAll("lightning-input")
      .filter((element) => element.checked);
    console.log("checkedBoxesIds", JSON.stringify(checkedBoxesIds));
    //.map(element => element.dataset.id);
    let map = new Map();
    checkedBoxesIds.forEach((value) => {
      map.set(value, "value" + value);
    });
    /* let contatsByMultipleAccounts = [];
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
                this.showToastMessage('Contacts are not available for this account', 'Info', 'Contacts are not available for this account');
            }
        } else {
            this.showToastMessage('Please select at least one account', 'Info', 'Please select at least one account');
            this.isContactsAvailable = false;
        } */
  }
  showToastMesage(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}