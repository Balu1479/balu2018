import { LightningElement, wire, track } from "lwc";
import retrieveBookRecords from "@salesforce/apex/BookController.retrieveBookRecords";

export default class BookComponent extends LightningElement {
  @track bookRecords = [];
  @wire(retrieveBookRecords)
  booksRecords({ data, error }) {
    if (data) {
      console.log("data", data);
      this.bookRecords = JSON.parse(data);
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.bookRecords = undefined;
    }
  }
}