import { LightningElement, track, api } from "lwc";

export default class Sorting extends LightningElement {
  @track allMobiles = [];
  sortedDirection = "asc";
  sortedColumn;
  //fieldUpBool;
  //fieldDWBool;
  connectedCallback() {
    this.allmobiles();
  }
  allmobiles() {
    const mobiles = [
      {
        name: "OnePlus",
        id: 3,
        price: 600000
      },
      {
        name: "Xiomi",
        id: 4,
        price: 650000
      },
      {
        name: "Apple",
        id: 1,
        price: 900000
      },
      {
        name: "Samsung",
        id: 2,
        price: 800000
      }
    ];
    this.allMobiles = mobiles;
    //return this.allMobiles;
  }
  sortingMobiles() {
    const sortMobiles = this.allMobiles.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    this.allMobiles = sortMobiles;
  }
  sortingMobilePrice() {
    const sortMobiles = this.allMobiles.sort(function (a, b) {
      return String(a.price).localeCompare(String(b.price));
    });
    this.allMobiles = sortMobiles;
  }
  sortingMobilesRank() {
    const sortMobiles = this.allMobiles.sort(function (a, b) {
      return String(a.id).localeCompare(String(b.id));
    });
    this.allMobiles = sortMobiles;
  }
  sortRecs(event) {
    var colName = event.target.name;
    console.log("colName 121", colName);
    let sortedMobiles = this.sortRecords(
      colName,
      this.allMobiles,
      false,
      false
    );
    this.allMobiles = sortedMobiles;
    console.log("allMobiles 123", this.allMobiles);
  }
  @api
  sortRecords(colName, records, fieldUpBool, fieldDWBool) {
    let sortedColumn;
    //this.fieldUpBool = false;
    //this.fieldDWBool = false;
    let fieldUpBoolNew = fieldUpBool;
    let fieldDWBoolNew = fieldDWBool;
    //console.log("colName 192", colName);
    if (colName) {
      sortedColumn = colName;
    } else {
      colName = sortedColumn;
    }
    if (sortedColumn === colName) {
      this.sortedDirection = this.sortedDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortedDirection = "asc";
    }
    let isReverse = this.sortedDirection === "asc" ? 1 : -1;
    switch (colName) {
      case colName:
        if (this.sortedDirection === "asc") {
          fieldUpBoolNew = true;
          fieldDWBoolNew = false;
        } else {
          fieldDWBoolNew = true;
          fieldUpBoolNew = false;
        }
        break;
      default:
    }
    console.log(fieldUpBoolNew, fieldDWBoolNew);
    // sort the data
    const sortedRecords = JSON.parse(JSON.stringify(records)).sort((a, b) => {
      /* console.log("colName 154", typeof a[colName]);
      console.log("colName 155", a[colName]);
      console.log("colName 156", typeof b[colName]);
      console.log("colName 157", b[colName]); */
      if (typeof a[colName] === "number" || typeof b[colName] === "number") {
        a = a[colName] ? a[colName] : "";
        b = b[colName] ? b[colName] : "";
      } else {
        a = a[colName] ? a[colName].toLowerCase() : ""; // Handle null values
        b = b[colName] ? b[colName].toLowerCase() : "";
      }
      return a > b ? 1 * isReverse : -1 * isReverse;
    });
    records = sortedRecords;
    //console.log("records 167", records);
    return records;
  }
  @api
  childMethod() {
    console.log("Calling from parent compoent");
  }
}