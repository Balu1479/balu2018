import { LightningElement, track } from "lwc";

export default class PubsubChildThree extends LightningElement {
  panelText;
  customclass = "redColor"; // you can set this parameter basis of admin selection
  @track panelStyle;
  /* get panelStyle() {
    this.panelText = "panel";
    return this.panelText;
  } */
  connectedCallback() {
    this.panelStyle = 'panel';
    console.log('panel',this.panelStyle);
  }
  changeTheme() {
    this.customclass = "greenColor";
    console.log("customclass", this.customclass);
  }
}