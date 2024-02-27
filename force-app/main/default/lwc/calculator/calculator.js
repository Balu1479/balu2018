import { LightningElement, track } from "lwc";
import addMethod from "@salesforce/apex/CalculatorController.addMethod";
import devideMethod from "@salesforce/apex/CalculatorController.devideMethod";
import getCreditsCount from "@salesforce/apex/CalculatorController.getCreditsCount";
import getAccountIds from "@salesforce/apex/AccountController.getAccountIds";
import { showToastMessage } from "c/showToastMessage";
export default class Calculator extends LightningElement {
  @track result;
  error;
  firstNumber;
  secondNumber;
  unreedemedCount;
  @track creditsCount = [];
  @track accountIds = [];
  isClearall = false;
  connectedCallback() {
    this.fetchCreditsCount();
    this.fecthAccountIds();
  }
  add() {
    if (
      this.firstNumber !== undefined &&
      this.secondNumber !== undefined &&
      this.firstNumber !== "" &&
      this.secondNumber !== ""
    ) {
      this.isClearall = false;
      addMethod({ x: this.firstNumber, y: this.secondNumber })
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          this.error = error;
          this.result = undefined;
        });
    } else {
      showToastMessage(
        "Please add requred fields",
        "Info",
        "Please fill the first and second numbers"
      );
    }
  }
  division() {
    if (
      this.firstNumber !== undefined &&
      this.secondNumber !== undefined &&
      this.firstNumber !== "" &&
      this.secondNumber !== ""
    ) {
      this.isClearall = false;
      devideMethod({ x: this.firstNumber, y: this.secondNumber })
        .then((data) => {
          this.result = data;
          this.error = undefined;
        })
        .catch((error) => {
          this.error = error;
          this.result = undefined;
        });
    } else {
      showToastMessage(
        "Please add requred fields",
        "Info",
        "Please fill the first and second numbers"
      );
    }
  }
  subtract() {
    if (
      this.firstNumber !== undefined &&
      this.secondNumber !== undefined &&
      this.firstNumber !== "" &&
      this.secondNumber !== ""
    ) {
      this.isClearall = false;
      this.result =
        parseInt(this.firstNumber, 10) - parseInt(this.secondNumber, 10);
    } else {
      showToastMessage(
        "Please add requred fields",
        "Info",
        "Please fill the first and second numbers"
      );
    }
  }
  multiply() {
    if (
      this.firstNumber !== undefined &&
      this.secondNumber !== undefined &&
      this.firstNumber !== "" &&
      this.secondNumber !== ""
    ) {
      this.isClearall = false;
      this.result =
        parseInt(this.firstNumber, 10) * parseInt(this.secondNumber, 10);
    } else {
      showToastMessage(
        "Please add requred fields",
        "Info",
        "Please fill the first and second numbers"
      );
    }
  }
  /*division(){
    this.result = parseInt(this.firstNumber) / parseInt(this.secondNumber);
 }*/
  clear() {
    if (
      this.firstNumber === "" &&
      this.secondNumber === "" &&
      this.result === ""
    ) {
      this.isClearall = false;
    } else {
      this.isClearall = true;
      this.firstNumber = "";
      this.secondNumber = "";
      this.result = "";
    }
  }
  handleChange(event) {
    if (event.target.label === "First Number") {
      this.firstNumber = event.target.value;
    }
    if (event.target.label === "Second Number") {
      this.secondNumber = event.target.value;
    }
  }
  fetchCreditsCount() {
    getCreditsCount()
      .then((result) => {
        this.creditsCount = JSON.parse(result);
      })
      .catch((error) => {
        this.error = error;
      });
  }
  fecthAccountIds() {
    getAccountIds()
      .then((result) => {
        this.accountIds = result;
      })
      .catch((error) => {
        this.error = error;
      });
  }
}