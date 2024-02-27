import { LightningElement, api } from 'lwc';

export default class ToolTip extends LightningElement {
    @api tooltipText;
    @api tooltipStyles;
}