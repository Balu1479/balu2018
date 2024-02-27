import { LightningElement, api } from 'lwc';

export default class TooltipDescription extends LightningElement {
    disabledTooltip = true;
    tooltipStyles = "width: 270px;";
    @api tooltipMinWidth = "300";
    
    get labelOfHeader() {
        console.log('tooltipMinWidth--', typeof(this.tooltipMinWidth));
        return 'Software Dashboard';
    }
    get descriptionValue() {
        console.log('tooltipMinWidth--', typeof(this.tooltipMinWidth));
        return 'Access to the Software Dashboard requires an HPE Support Service Agreement.'
    }
    get tooltipText() {
        console.log('tooltipMinWidth--', typeof(this.tooltipMinWidth));
        return 'Access to the Software Dashboard requires an HPE Support Service Agreement.'
    }
    connectedCallback() {
        console.log('tooltipMinWidth--', typeof(this.tooltipMinWidth));
        console.log('tooltipMinWidth--', this.tooltipMinWidth);
    }
}