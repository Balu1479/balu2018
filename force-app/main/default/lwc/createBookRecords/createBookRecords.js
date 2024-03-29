import { LightningElement, track, wire } from "lwc";
import getBookRecords from "@salesforce/apex/BookController.getBookRecords";
import createBook from "@salesforce/apex/BookController.createBook";
import updateBookRecord from "@salesforce/apex/BookController.updateBookRecord";
import retrieveBookRecords from "@salesforce/apex/BookController.retrieveBookRecords";
import CATEGORY_FIELD from "@salesforce/schema/Book__c.Category__c";
import NAME_FIELD from "@salesforce/schema/Book__c.Name";
import Price_Field from "@salesforce/schema/Book__c.Price__c";
import Count_Field from "@salesforce/schema/Book__c.Count__c";
import PUBLISH_TYPE from "@salesforce/schema/Book__c.Publish_Type__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import getPickListValues from "@salesforce/apex/BookController.getPickListValues";
import { refreshApex } from "@salesforce/apex";
export default class CreateBookRecords extends NavigationMixin(
  LightningElement
) {
  @track bookList = [];
  @track error;
  @track isShowModal = false;
  @track isEditModal = false;
  @track category = CATEGORY_FIELD;
  @track price = Price_Field;
  @track count = Count_Field;
  @track name = NAME_FIELD;
  @track publishtype = PUBLISH_TYPE;
  @track recordId;
  @track bookRow = {};
  searchKey = "";
  @track records = [];
  @track recordsToDisplay = [];
  @track wiredBookRecords = [];
  sortedColumn;
  sortedDirection = "asc";
  nameUpBool;
  nameDWBool;
  @track isFirstPage;
  @track isLastPage;
  @track pickListOptions = [];
  totalrecordscb;
  totalpagescb;
  pagenumbercb;
  pageSize = 5;
  pageNumber = 1;
  disableLastButton = false;
  disableNextButton = false;
  disablePreviousButton = true;
  disableFirstButton = true;

  @track
  rec = {
    Category__c: this.category,
    Price__c: this.price,
    Count__c: this.count,
    Name: this.name,
    Publish_Type__c: this.publishtype
  };
  @track bookRecords = {};
  @track bookRecordsStr = {};
  errorValues = {
    Name: "Please enter name field",
    Category: "Please enter category field",
    Count: "Please enter Count field",
    Price: "Please enter Price field"
  };

  connectedCallback() {
    this.fetchbookRecords();
    this.getPickListOptions();
  }
  get rowColor() {
    const colors = this.this.recordsToDisplay.map(records => {
        return records.publishtype === "Salesforce" ? "rowcolor" : "#A52A2A";
    });
    return colors;
  }
  /* searchKeyword(event) {
    this.searchKey = event.target.value.toLowerCase();
  } */
  @wire(retrieveBookRecords)
  getBooks({ data, error }) {
    this.wiredBookRecords = data;
    if (data) {
      this.recordsToDisplay = JSON.parse(data);
      //console.log('recordsToDisplay',this.recordsToDisplay);
      setTimeout(() => {
        this.paginationHelper();
      }, 1000);
      //this.paginationHelper();
    } else if (error) {
      this.error = error;
    }
  }
  fetchbookRecords() {
    getBookRecords({ searchKey: this.searchKey })
      //searchBooks({searchKey:this.searchKey})
      .then((result) => {
        this.bookList = result;
        this.records = [...JSON.parse(result)];
        this.totalrecordscb = this.records.length;
        this.error = undefined;
      })
      .catch((error) => {
         console.log('error',error);
        this.error = error;
        this.records = undefined;
      });
  }
  paginationHelper() {
    let recordsToDisplayPage = [];
    this.recordsToDisplay = [];
    // calculate total pages
    this.totalpagescb = Math.ceil(this.totalrecordscb / this.pageSize);
    // set page number
    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
    } else if (this.pageNumber >= this.totalpagescb) {
      this.pageNumber = this.totalpagescb;
    }
    // set records to display on current page
    for (
      let i = (this.pageNumber - 1) * this.pageSize;
      i < this.pageNumber * this.pageSize;
      i++
    ) {
      if (i === this.totalrecordscb) {
        break;
      }
      recordsToDisplayPage.push(this.records[i]);
    }
    this.recordsToDisplay = recordsToDisplayPage;
    //console.log('this.recordsToDisplay 123',JSON.stringify(this.recordsToDisplay));
    //console.log('this.recordsToDisplay 124',JSON.stringify(recordsToDisplayPage));
  }
  nextPage() {
    this.pageNumber = this.pageNumber + 1;
    this.paginationHelper();
    if (this.pageNumber === this.totalpagescb) {
      this.disableNextButton = true;
      this.disableLastButton = true;
    } else {
      this.disableFirstButton = false;
      this.disablePreviousButton = false;
    }
  }
  firstPage() {
    this.pageNumber = 1;
    this.paginationHelper();
    if (this.pageNumber === 1) {
      this.disableFirstButton = true;
      this.disablePreviousButton = true;
      this.disableLastButton = false;
      this.disableNextButton = false;
    }
  }
  previousPage() {
    this.pageNumber = this.pageNumber - 1;
    this.paginationHelper();
    if (this.pageNumber === 1) {
      this.disablePreviousButton = true;
      this.disableFirstButton = true;
    } else {
      this.disableNextButton = false;
      this.disableLastButton = false;
    }
  }
  lastPage() {
    this.pageNumber = this.totalpagescb;
    this.paginationHelper();
    if (this.pageNumber === this.totalpagescb) {
      this.disableNextButton = true;
      this.disableLastButton = true;
      this.disableFirstButton = false;
      this.disablePreviousButton = false;
    }
  }

  showModal() {
    this.isShowModal = true;
  }
  hideModalBox() {
    this.isShowModal = false;
    this.isEditModal = false;
  }
  handleChange(event) {
    if (event.target.label === "Name") {
      this.rec.Name = event.target.value;
    }
    if (event.target.label === "Category") {
      this.rec.Category__c = event.target.value;
    }
    if (event.target.label === "Publish Type") {
      this.rec.Publish_Type__c = event.target.value;
    }
    if (event.target.label === "Count") {
      this.rec.Count__c = event.target.value;
    }
    if (event.target.label === "Price") {
      this.rec.Price__c = event.target.value;
    }
  }
  handleBookChange(event) {
    if (event.target.label === "Name") {
      this.bookRecords.name = event.currentTarget.dataset.name;
    }
    if (event.target.label === "Category") {
      this.bookRecords.category = event.currentTarget.dataset.name;
    }
    if (event.target.label === "Count") {
      //this.bookRecords.count = event.currentTarget.dataset.name;
      this.bookRecords.count = event.currentTarget.dataset.name;
    }
    if (event.target.label === "Price") {
      this.bookRecords.price = event.currentTarget.dataset.name;
    }
    this.bookRecordsStr = JSON.stringify(this.bookRecords);
  }

  createBookRecord() {
    createBook({ bk: this.rec }).then((result) => {
      console.log("result", result);
      this.showToastMessages(
        "Success!",
        "success",
        "Record{0} Created Successfully!"
      );
      this.isShowModal = false;
      refreshApex(this.wiredBookRecords);
      /* setTimeout(() => {
        eval("$A.get('e.force:refreshView').fire();");
      }, 1000); */
    });
  }
  deleteBooks(event) {
    this.recordId = event.currentTarget.dataset.name;
    deleteRecord(this.recordId)
      .then(() => {
        this.showToastMessages(
          "Success!",
          "success",
          "Record deleted successfully!"
        );
        refreshApex(this.wiredBookRecords);
        /* setTimeout(() => {
          eval("$A.get('e.force:refreshView').fire();");
        }, 1000); */
      })
      .catch((error) => {
        this.error = error;
      });
  }
  editRecord() {
    this.isEditModal = true;
  }
  editBookRecord(event) {
    this.recordId = event.currentTarget.dataset.name;
    updateBookRecord({ booksRecs: this.bookRecordsStr })
      .then((result) => {
        console.log("result", result);
        this.showToastMessages(
          "Success!",
          "success",
          "Record Successfully updated!"
        );
        refreshApex(this.wiredBookRecords);
        /* setTimeout(() => {
          eval("$A.get('e.force:refreshView').fire();");
        }, 1000); */
      })
      .catch((error) => {
        this.error = error;
      });
  }

  /* searchKeyword(event) {
    const searchValue = event.target.value;
    console.log("searchValue", searchValue);
    const searchKey = event.target.value.toLowerCase();
    console.log("Search Key is" + searchKey);
    if (searchKey) {
      this.records = this.bookList;
      console.log("this.records--:", this.records);
      if (this.records) {
        let recs = [];
        for (let rec of this.records) {
          console.log("Rec is" + JSON.stringify(rec));
          let valuesArray = Object.values(rec);
          console.log("valuesArray is" + valuesArray);
          for (let val of valuesArray) {
            let stringVal = String(val);
            if (stringVal) {
              if (stringVal.toLowerCase().includes(searchKey)) {
                recs.push(rec);
                break;
              }
            }
          }
        }
        console.log("Recs are" + JSON.stringify(recs));
        this.recordsToDisplay = recs;
      }
    } else {
      this.recordsToDisplay = this.bookList;
    }
  } */
  sortRecs(event) {
    this.nameUpBool = false;
    this.nameDWBool = false;
    this.catUpBool = false;
    this.catDWBool = false;
    this.cUpBool = false;
    this.cDWBool = false;
    this.cbnUpBool = false;
    this.cbnDWBool = false;
    this.pUpBool = false;
    this.pDWBool = false;
    let colName = event.target.name;
    if (this.sortedColumn === colName) {
      this.sortedDirection = this.sortedDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortedDirection = "asc";
    }

    let isReverse = this.sortedDirection === "asc" ? 1 : -1;

    if (colName) this.sortedColumn = colName;
    else colName = this.sortedColumn;

    switch (colName) {
      case "Name":
        if (this.sortedDirection === "asc") this.nameUpBool = true;
        else this.nameDWBool = true;
        break;
      case "Category":
        if (this.sortedDirection === "asc") this.catUpBool = true;
        else this.catDWBool = true;
        break;
      case "Price":
        if (this.sortedDirection === "asc") this.pUpBool = true;
        else this.pDWBool = true;
        break;
      case "Count":
        if (this.sortedDirection === "asc") this.cUpBool = true;
        else this.cDWBool = true;
        break;
      case "CreatedByName":
        if (this.sortedDirection === "asc") this.cbnUpBool = true;
        else this.cbnDWBool = true;
        break;
      case "PublishType":
        if (this.sortedDirection === "asc") this.ptUpBool = true;
        else this.ptDWBool = true;
        break;
      default:
    }
    // sort the data
    this.records = JSON.parse(JSON.stringify(this.records)).sort((a, b) => {
      if (colName === "Price" && colName === "Count") {
        a = a[colName] ? a[colName] : ""; // Handle null values
        b = b[colName] ? b[colName] : "";
      } else {
        a = a[colName] ? a[colName].toLowerCase() : ""; // Handle null values
        b = b[colName] ? b[colName].toLowerCase() : "";
      }

      return a > b ? 1 * isReverse : -1 * isReverse;
    });
  }
  getPickListOptions() {
    getPickListValues()
      .then((result) => {
        result.forEach((currentItem) => {
          this.pickListOptions.push({
            label: currentItem,
            value: currentItem
          });
        });
        //this.pickListOptions = { ...result};
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        this.pickListOptions = undefined;
      });
  }
  handlePTChange(event) {
    this.picklistVal = event.target.value;
    this.rec.Publish_Type__c = event.target.value;
  }
  @track picklistVal;
  @wire(getPickListValues, {
    customObjInfo: { sobjectType: "Book__c" },
    selectPicklistApi: "Publish_Type__c"
  })
  selectTargetValues;
  naviagteToLWC() {}
  showToastMessages(title, variant, message) {
    const event = ShowToastEvent({
      title: title,
      variant: variant,
      message: message
    });
    this.dispatchEvent(event);
  }
}