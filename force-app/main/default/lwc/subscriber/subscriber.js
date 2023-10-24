import { LightningElement, wire } from "lwc";
import messageChannel from "@salesforce/messageChannel/Sample__c";
import { subscribe, MessageContext } from "lightning/messageService";
export default class Subscriber extends LightningElement {
  subscription = null;
  addionResult = null;
  messageFromPublisher;
  result;
  counter = 0;
  @wire(MessageContext) messageContext;

  connectedCallback() {
    this.handleSubscribe();
    this.addition();
  }
  handleSubscribe() {
    if (this.subscription) {
      return;
    }
    this.subscription = subscribe(
      this.messageContext,
      messageChannel,
      message => {
        console.log(message.messageText);
        this.messageFromPublisher = message.messageText;
      }
    );
  }
  addition() {
    this.addionResult = subscribe(
      this.messageContext,
      messageChannel,
      message => {
        console.log(message.constant);
        this.result = this.addHandler(message);
      }
    );
  }
  addHandler(message) {
    if (message.operator == "add") {
      this.counter += message.constant;
    } else if (message.operator == "sub") {
      this.counter -= message.constant;
    } else if (message.operator == "mul") {
      this.counter *= message.constant;
    }
    return this.counter;
  }
}