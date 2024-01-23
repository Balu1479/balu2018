import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { RefreshEvent } from 'lightning/refresh';
export default class FileUploader extends LightningElement {
    @api recordId;
    get acceptedFormats(){
        return ['.pdf', '.png'];
    }
    handleUploadFinished(event){
        //alert('file upload handler');
        const uploadFiles = event.detail.files;
        //console.log('no. of files uploaded',uploadFiles.length);
        this.showToastMessage('Files are uploaded successfully', `${uploadFiles.length} Files are uploaded successfully`, 'Success');
        this.dispatchEvent(new RefreshEvent());
    }
    showToastMessage(title, message, variant){
        const event = new ShowToastEvent({
            tittle:title,
            message:message,
            variant:variant
        });
        this.dispatchEvent(event);  
    }
}