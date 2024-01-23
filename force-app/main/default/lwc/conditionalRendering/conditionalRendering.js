import { LightningElement } from 'lwc';

export default class ConditionalRendering extends LightningElement {
    isVisible = false;
    changeHandler(event){
        this.isVisible = event.target.checked;
    }
}