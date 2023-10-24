import { LightningElement, wire } from "lwc";
import messageChannel from "@salesforce/messageChannel/Sample__c";
import { publish, MessageContext } from "lightning/messageService";
export default class Publisher extends LightningElement {
  @wire(MessageContext) messageContext;
  handleButtonClick() {
    let message = { messageText: "This is a test" };
    publish(this.messageContext, messageChannel, message);
  }
  handleAddition() {
    //alert('enter handle addition');
    const payload = {
      constant: 1,
      operator: "add"
    };
    publish(this.messageContext, messageChannel, payload);
  }
  handleSubtraction() {
    //alert('enter handle addition');
    const payload = {
      constant: 1,
      operator: "sub"
    };
    publish(this.messageContext, messageChannel, payload);
  }
  handleMultiply() {
    //alert('enter handle addition');
    const payload = {
      constant: 2,
      operator: "mul"
    };
    publish(this.messageContext, messageChannel, payload);
  }
}