import { ShowToastEvent } from "lightning/platformShowToastEvent";

function showToastMessage(title, variant, message) {
    const event = new ShowToastEvent({
      title: title,
      variant: variant,
      message: message
    });
    dispatchEvent(event);
}
export {
    showToastMessage
};