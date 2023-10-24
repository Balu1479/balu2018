import { LightningElement } from 'lwc';
import strUserId from '@salesforce/user/Id';
export default class CustomLookupParent extends LightningElement {
    userId = strUserId;
 
    handleLookupSelection(event){
        if(event.detail.selectedRecord != undefined){
            console.log('Selected Record Value on Parent Component is ' +  
            JSON.stringify(event.detail.selectedRecord));
            alert(event.detail.selectedRecord.Id + ' '+ event.detail.selectedRecord.Name);
        }
    }
}