import { LightningElement } from 'lwc';
import IMAGE from '@salesforce/resourceUrl/Salesforce_icon';
import LION from '@salesforce/resourceUrl/lion';
import LIONPIC from '@salesforce/resourceUrl/LionPic';

export default class OpsRampMain extends LightningElement {
    imagesource = IMAGE;
    lionimage = IMAGE;
    lionpic = IMAGE;
    buttonlabel = 'Launch OpsRamp'
    description = 'Define an optional description property to add a line of descriptive text for each option.The descriptive text displays below the label of the listitem. When adding descriptions,specify a description for each item in a list. If some items are missing descriptions,the text of the items can be misaligned.';
    opsrampHandler(){
        this.imagesource = IMAGE;
    }
    opsrampHandler1(){
        this.lionimage = LION;
    }
    opsrampHandler2(){
        this.lionpic = LIONPIC;
    }
}