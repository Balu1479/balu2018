import { LightningElement, api } from "lwc";

export default class PageNavigation extends LightningElement {
  @api totalrecords;
  @api pagenumber;
  @api totalpages;
  @api disableFirstButton;
  @api disableLastButton;
  @api disablePreviousButton;
  @api disableNextButton;
  nextPage() {
    const event = new CustomEvent("nextpage", {
      detail: {
        key: "GBM1479",
        value: "Moksha Sree Bala Gongolla"
      }
    });
    this.dispatchEvent(event);
  }
  firstPage() {
    const event = new CustomEvent("firstpage", {
      detail: {
        key: "test",
        value: "Moksha"
      }
    });
    this.dispatchEvent(event);
  }
  previousPage() {
    const event = new CustomEvent("previouspage", {
      detail: {
        key: "test1",
        value: "Bala"
      }
    });
    this.dispatchEvent(event);
  }
  lastPage() {
    const event = new CustomEvent("lastpage", {
      detail: {
        key: "test2",
        value: "Rajee"
      }
    });
    this.dispatchEvent(event);
  }
  disableFirst() {
    const event = new CustomEvent("disablefirst", {});
    this.dispatchEvent(event);
  }
}