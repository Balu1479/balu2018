import { LightningElement } from 'lwc';
//import studentPrimary from './student.html';
//import htmlPractice from './htmlPractice.html';
import DCEAccessToTheSoftwareDashboard from '@salesforce/label/c.DCEAccessToTheSoftwareDashboard';

export default class LifeCycleHooks extends LightningElement {
    label = {
        DCEAccessToTheSoftwareDashboard
    };
    showTemplatePrimary = true;
    constructor(){
        super();
        console.log('this is constructor');
    }
    connectedCallback() {
        var element = this.template;
        var divElement = this.template;
        console.log('element--:', element.isConnected);
        console.log('divElement--:',divElement.textContent);
    }
    /* render() {
        console.log('I am in render callback');
        console.log('I am in render callback',this.showTemplatePrimary ? studentPrimary : htmlPractice);
        return this.showTemplatePrimary ? studentPrimary : htmlPractice;
    } */
}