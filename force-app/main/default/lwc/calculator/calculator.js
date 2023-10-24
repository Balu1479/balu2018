import { LightningElement,track } from 'lwc';
import addMethod from '@salesforce/apex/calculatorController.addMethod';
import devideMethod from '@salesforce/apex/calculatorController.devideMethod';
import getCreditsCount from '@salesforce/apex/calculatorController.getCreditsCount';
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
        console.log('data--:',data);
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
        console.log('data--:',data);
        this.result = data;
        console.log('this.result--:',this.result);
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
        console.log('result--:',typeof(result));
        console.log('values--:',JSON.parse(result));
        //this.creditsCount = [...JSON.parse(result)];
        this.creditsCount = JSON.parse(result);
        console.log('creditsCount--:',typeof(this.creditsCount));
        console.log('creditsCount--:',this.creditsCount.unredeemedCount);
        
    })
    .catch((error) =>{
        this.error = error;
    })
 }
 fecthAccountIds(){
    getAccountIds().then((result) =>{
        console.log('result--:',result);
        this.accountIds = result;
        console.log('accountIds--:',this.accountIds);
    })
    .catch((error) =>{
        this.error = error;
    })
 }
}