import { api, LightningElement } from "lwc";
import LANG from "@salesforce/i18n/lang";
import DIR from "@salesforce/i18n/dir";

export default class ParentComponent extends LightningElement {
  lang = LANG;
  dir = DIR;
  @api parentMessage;
  name;
  rajee;
  renderValue;
  hasRendered = true;
  searchValue;
  constructor() {
    super();
    this.name = "Moksha Sree Bala";
    console.log("I am from parent component constructor");
  }
  connectedCallback() {
    //console.log('I am from parent component conected call back');
    this.rajee = "Moksha Sree Bala";
    /* console.log('Rajee name--:',this.rajee);
        console.log('language name--:',this.lang);
        console.log('dir name--:',this.dir); */
  }
  connectedCallback() {
    this.rajee = "Moksha Sree Bala Gongolla";
    console.log("Rajee name--:", this.rajee);
  }
  renderedCallback() {
    if (this.hasRendered) {
      this.renderValue = "this is the rendered call back value";
      this.hasRendered = false;
    }
  }
  handleNameChange(event) {
    this.parentMessage = event.target.value;
  }
  handleClick() {
    //this.parentMessage = 'Moksha Sree';
    console.log("message", this.parentMessage);
    this.template
      .querySelector("c-child-component")
      .handleChild(this.parentMessage);
  }
  handleChildButton(event) {
    let key = event.detail.key;
    let value = event.detail.value;
    this.parentMessage = key + " " + value;
    this.name = this.template.querySelector(".moksha").value;
  }
  handleRenderButton() {
    this.renderValue = "This is the button clicked value";
    console.log("button value--:", this.renderValue);
  }
  handleSearchChange(event) {
    this.searchValue = event.target.value;
  }
  handleSearch() {
    //this.searchValue = event.detail.value;
    //this.searchValue = 'search';
    console.log("search value", this.searchValue);
    this.template
      .querySelector("c-child-component")
      .childHandleSearch(this.searchValue);
  }
}