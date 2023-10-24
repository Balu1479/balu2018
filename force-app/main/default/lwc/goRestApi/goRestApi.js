import SystemModstamp from "@salesforce/schema/Account.SystemModstamp";
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
  data = [];
  columns = column;
  initialRecords = [];
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
        //console.log(this.data);
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
      { label: "All", value: "All" },
      { label: "Inactive", value: "inactive" },
      { label: "Active", value: "active" },
      { label: "Male", value: "male" },
      { label: "Female", value: "female" }
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
}