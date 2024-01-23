import { LightningElement,track } from 'lwc';
import addMethod from '@salesforce/apex/CalculatorController.addMethod';
import devideMethod from '@salesforce/apex/CalculatorController.devideMethod';
import getCreditsCount from '@salesforce/apex/CalculatorController.getCreditsCount';
import getAccountIds from '@salesforce/apex/AccountController.getAccountIds';

export default class Calculator extends LightningElement {
 @track result;
 error;
 firstNumber;
 secondNumber;
 unreedemedCount;
 @track creditsCount = [];
 @track accountIds = [];
 connectedCallback(){
    this.fetchCreditsCount();
    this.fecthAccountIds();
 }
 add(){
    addMethod({x:this.firstNumber, y:this.secondNumber})
    .then((data) => {
        this.result = data;
    })
    .catch((error) => {
        this.error = error;
        this.result = undefined;
    })
 }
 division(){
    devideMethod({x:this.firstNumber, y:this.secondNumber})
    .then((data) => {
        this.result = data;
        this.error = undefined;
    })
    .catch((error) => {
        this.error = error;
        this.result = undefined;
    })
 }
 subtract(){
    this.result = parseInt(this.firstNumber) - parseInt(this.secondNumber);
 }
 multiply(){
    this.result = parseInt(this.firstNumber) * parseInt(this.secondNumber);
 }
 /*division(){
    this.result = parseInt(this.firstNumber) / parseInt(this.secondNumber);
 }*/
 handleChange(event){
    if(event.target.label== 'First Number'){
        this.firstNumber = event.target.value;
    }
    if(event.target.label== 'Second Number'){
        this.secondNumber = event.target.value;
    }
 }
 fetchCreditsCount(){
    getCreditsCount().then((result) =>{
        this.creditsCount = JSON.parse(result);
    })
    .catch((error) =>{
        this.error = error;
    })
 }
 fecthAccountIds(){
    getAccountIds().then((result) =>{
        this.accountIds = result;
    })
    .catch((error) =>{
        this.error = error;
    })
 }
}