import { LightningElement, wire, track } from 'lwc';
import getMobiles from '@salesforce/apex/MobileController.getMobileRecords';
export default class Mobiles extends LightningElement {
    @track allMobiles = [];
    error;
    @wire(getMobiles)
    getMobileRecords({ data, error }) {
        if (data) {
            console.log('data', data);
            this.allMobiles = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.allMobiles = undefined;
        }
    }
    sortRecs(event) {
        let colName = event.target.name;
        console.log('all mobiles 19', this.allMobiles);
        this.allMobiles = this.template.querySelector("c-sorting").sortRecords(colName, this.allMobiles);
        console.log('all mobiles 21', this.allMobiles);
    }
}