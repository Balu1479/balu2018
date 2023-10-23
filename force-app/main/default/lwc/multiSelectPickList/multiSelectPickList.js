import { LightningElement,track,api } from 'lwc';

export default class MultiSelectPickList extends LightningElement {
    label = 'Multi Picklist Example';
    closePill = false;
    showDropdown = false;
    selectedValues = [];
    @track optionData;
    @api options;
    @api multiSelect = false;
    @track searchString;
    connectedCallback(){
        this.showDropdown = false;
        var optionData = this.options ? (JSON.parse(JSON.stringify(this.options))) : null;
        var values = this.selectedValues ? (JSON.parse(JSON.stringify(this.selectedValues))) : null;
        if(values){
            var searchString;
            var count;
            for(var i =0; i < optionData.length; i++){
                if(this.multiSelect){
                    if(values.includes(optionData[i].values)){
                        optionData[i].selected = true;
                        count++;
                    }
                }
            }
            if(this.multiSelect){
                this.searchString = count + ' Option(s) Selected';
            }
        }
        this.values = values;
        this.optionData = optionData;
    }
}