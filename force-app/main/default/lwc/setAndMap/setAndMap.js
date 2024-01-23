import { LightningElement, track } from 'lwc';
const stuNames = [
    {
        name:'Bala',
        age:10,
        id:100
    },
    {
        name:'Moksha',
        age:9,
        id:101
    },
    {
        name:'Bala',
        age:9,
        id:102
    },
    {
        name:'Rajee',
        age:10,
        id:103
    },
];

export default class SetAndMap extends LightningElement {
    @track uniqueNames = [];
    @track keysOfMap = [];
    @track valuesOdMap = [];
    connectedCallback(){
        this.fetchSetData();
        this.fetchMapData();
    }
    // set methods
    fetchSetData(){
        console.log('stuNames',stuNames);
        console.log('stuNames',typeof(stuNames));
        let uniqueStuNames = new Set();
        // for adding the names to the new set
        stuNames.forEach((element) =>{
            console.log('element',element);
            uniqueStuNames.add(element.name);
        });
        console.log('uniqueStuNames',uniqueStuNames);
        //this.uniqueNames = uniqueStuNames;
        console.log('uniqueNames',this.uniqueNames);
        // to get the only value of the set
        uniqueStuNames.forEach((each) =>{
            console.log('each',each);
            this.uniqueNames.push(each);
        });
        // to get the key and values of the set
        for(let value of this.uniqueNames.entries()){
            console.log('value entries',value);
        }
        // to get the only value of the set
        for(let value of this.uniqueNames.values()){
            console.log('values',value);
        }
        console.log('uniqueNames',this.uniqueNames);
    }
    fetchMapData(){
        console.log('map data',stuNames);
        let stuMap = new Map();
        console.log('stuMap',stuMap);
        // to add the key and values to the map
        stuNames.forEach((element) =>{
            stuMap.set(element.id,element)
        });
        console.log('stuMap',stuMap);
        /* this.keysOfMap = stuMap.keys();
        console.log('this.keysOfMap',this.keysOfMap); */
        // to get the value and key from the map through callback function
        stuMap.forEach((value,key) =>{
            console.log('key',key);
            console.log('value',value);
            this.keysOfMap.push(key);
            this.valuesOdMap.push(value);
        });
        console.log('keysOfMap',this.keysOfMap);
        console.log('valuesOdMap',this.valuesOdMap);
        // to get only key through iterator
        for(let eachKey of stuMap.keys()){
            console.log('eachKey',eachKey);
        }
        // to get only values through iterator
        for(let eachValue of stuMap.values()){
            console.log('eachValue',eachValue);
        }
        // to get keys and values through iterator
        for(let each of stuMap.entries()){
            console.log('eachValue',each);
        }
    }

}