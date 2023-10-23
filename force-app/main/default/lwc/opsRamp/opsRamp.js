import { LightningElement,api } from 'lwc';
export default class OpsRamp extends LightningElement {
    @api imagesource;
    @api buttonlabel;
    @api description;
    handleOpsramp(){
        var opsrampEvent = new CustomEvent('opsramphandler');
        this.dispatchEvent(opsrampEvent);
    }
}