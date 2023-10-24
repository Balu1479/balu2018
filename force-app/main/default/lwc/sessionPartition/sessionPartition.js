import { LightningElement } from 'lwc';

export default class SessionPartition extends LightningElement {
    partitionInput;
    counterKeyInput;
    counterInitValue;
    handleCounterKey(event){
        this.counterKeyInput = event.target.value;
    }
    handlePartitionInput(event){
        this.partitionInput = event.target.value;
    }
    handleCounterInitValue(event){
        this.counterInitValue = event.target.value;
        console.log(this.counterInitValue);
    }
}