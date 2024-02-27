import { LightningElement, wire, track } from "lwc";
import retrieveStudentRecords from "@salesforce/apex/StudentController.retrieveStudentRecords";

export default class Student extends LightningElement {
  @track studentsRecords = [];
  @track studentsRecordsSort = [];
  error;
  sortedColumn;
  sortedDirection = "asc";
  nameUpBool;
  nameDWBool;
  marksUpBool;
  marksDWBool;
  upBool;
  dwBool;
  //rowtextColor = 'rowcolor';
  connectedCallback() {
    let marks = [12, 25, 31, 23, 75, 81, 100];
 
    // Print Before sorting array 
    /* console.log("Original Array");
    console.log(marks); */
    
    // Sort elements using compare method 
    marks.sort(function (a, b) { return a - b });
    
    console.log("After sorting in Ascending order");
    
    // Print sorted Numeric array 
    console.log(marks);
  }
  
  @wire(retrieveStudentRecords)
  getStudentRecords({ data, error }) {
    if (data) {
      this.studentsRecords = data.map(item => {
        //let rowColor = item.Name === 'Moksha' ? 'greencolor' : 'rowcolor';
        let rowColor = item.Total_Marks__c > 500 ? 'greencolor' : 'rowcolor';
        return { ...item, 'rowColor':rowColor}
      })
      this.studentsRecordsSort = data;
      this.error = undefined;
    } else {
      console.log('error',error);
      this.error = error;
      this.studentsRecords = undefined;
    }
  }
  sortingFruits() {
    var i = 2;
    const fruits = ["Banana", "Mango", "Orange", "Apple"];
    console.log("fruits", fruits);
    fruits.sort();
    console.log("fruits", fruits);
    const mobiles = [
      {
        name: "OnePlus",
        id: 3
      },
      {
        name: "Xiomi",
        id: 4
      },
      {
        name: "Apple",
        id: 1
      },
      {
        name: "Samsung",
        id: 2
      }
    ];
    console.log("mobiles 43", mobiles);
    const sortMobiles = mobiles.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    console.log("sortMobiles 47", sortMobiles);
    for (i; i < fruits.length; i++) {
      console.log("i value", i);
    }
    for (let j = 0; j < fruits.length; j++) {
      console.log("j+ value", j);
    }
  }
  sortingStudents() {
    const sortStudentsRecords = JSON.parse(
      JSON.stringify(this.studentsRecords)
    );
    this.studentsRecords = sortStudentsRecords.sort((a, b) => {
      return a.Name.localeCompare(b.Name);
    }); 
  }
  sortingStudentsByMarks() {
    const sortStudentsRecords = JSON.parse(
      JSON.stringify(this.studentsRecords)
    );
    this.studentsRecords = sortStudentsRecords.sort(function (a, b) { return a.Total_Marks__c - b.Total_Marks__c });
    console.log("sortStudents 65", this.studentsRecords);
  }
  sortRecs(event) {
    let colName = event.target.name;
    const sortedRecords = this.template
      .querySelector("c-sorting")
      .sortRecords(colName, this.studentsRecords);
    this.studentsRecords = sortedRecords;
  }
  childMethod() {
    console.log('this is the child method');
    //this.template.querySelector("c-child-component").childMethod('Bala Gongolla');
    this.template
      .querySelector("c-child-component")
      .childMethod(this.searchValue);
    //console.log('childMethodValue',childMethodValue);
  }
  testChildButton() {
    this.template.querySelector("c-child-component").childMethod();
  }
}