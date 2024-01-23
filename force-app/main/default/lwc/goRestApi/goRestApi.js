import { LightningElement, track } from "lwc";
const column = [
  { label: "Name", fieldName: "name"},
  {
    label: "Email",
    fieldName: "email",
    type: "email"/* ,
    initialWidth: 300 ,wrapText:'wrap-text-min-lines'*/
  },
  { label: "Gender", fieldName: "gender", type: "text"/* , initialWidth: 300 */ },
  { label: "Status", fieldName: "status", type: "text"/* , initialWidth: 500  */}
];
export default class GoRestApi extends LightningElement {
  @track data = [];
  columns = column;
  @track initialRecords = [];
  @track selectedUserRecords = [];
  showMultipleOptions = false;
  isSelected = false;
  connectedCallback() {
    this.fetchUserData();
  }
  fetchUserData() {
    const callBackURL = "https://gorest.co.in/public/v2/users";
    fetch(callBackURL, { method: "GET" })
      .then(response => response.json())
      .then(repos => {
        //console.log(repos);
        this.data = repos;
        this.initialRecords = repos;
        //console.log('data',this.data);
      });
  }
  handleUpload(event) {
    alert("enter into handle upload");
    console.log(event.detail.lname);
    console.log(event.detail.fname);
  }
  handleChange(event) {
    this.selectedValue = event.detail.value;
    if (this.selectedValue === "All") this.data = this.initialRecords;
    else this.filter();
  }
  get options() {
    return [
      { label: "All", value: "All",Id:"1" },
      { label: "Inactive", value: "inactive" ,Id:"2"},
      { label: "Active", value: "active",Id:"3"},
      { label: "Male", value: "male" ,Id:"4"},
      { label: "Female", value: "female",Id:"5" }
    ];
  }
  filter() {
    if (this.selectedValue) {
      this.data = this.initialRecords;
      if (this.data) {
        let filterRecords = [];
        for (let rec of this.data) {
          if (
            rec.status === this.selectedValue ||
            rec.gender === this.selectedValue
          ) {
            filterRecords.push(rec);
          }
        }
        this.data = filterRecords;
      }
    } else {
      this.data = this.initialRecords;
    }
  }
  handleSearch(event) {
    //const searchKey = event.target.value.toLowerCase();
    const searchKey = event.detail.toLowerCase();
    console.log("searchKey", searchKey);
    if (searchKey) {
      this.data = this.initialRecords;
      if (this.data) {
        let recsSearch = [];
        for (let rec of this.data) {
          let valuesArray = Object.values(rec);
          for (let val of valuesArray) {
            let strVal = String(val);
            if (strVal) {
              if (strVal.toLowerCase().includes(searchKey)) {
                recsSearch.push(rec);
                break;
              }
            }
          }
        }
        this.data = recsSearch;
      }
    } else {
      this.data = this.initialRecords;
    }
  }
  handleSelection(event) {
    this.isSelected = true;
    const isChecked = event.target.checked;
    const selectedStatus = event.target.value;
    for (let eachStatus of this.data) {
        console.log('eachStatus', JSON.stringify(eachStatus));
      //if(isChecked){
        if (eachStatus.status === selectedStatus || eachStatus.gender === selectedStatus) {
          this.selectedUserRecords.push(eachStatus);
        }
      //}
    }
    this.data = this.selectedUserRecords;
  }
  handleMultipleChange(){
    this.showMultipleOptions = true;
  }
  showUserRecords() {
    console.log('selectedUserRecords',this.selectedUserRecords);
    this.data = this.selectedUserRecords;
  }
}