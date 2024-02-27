import { LightningElement, api } from 'lwc';

export default class DescriptiveButton extends LightningElement {
    @api labelOfHeader;
    @api descriptionValue;
    @api tooltipText;
    @api disabledTooltip;
    @api tooltipStyles;
    
}