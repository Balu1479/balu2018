import { LightningElement } from "lwc";

export default class Array_Objects extends LightningElement {
  array = ["Bala", "Rajee", "Moksha Sree"];
  arrayWithKeyValue = [
    { name: "Apple", quantity: 2 },
    { name: "Lemon", quantity: 5 },
    { name: "Banana", quantity: 12 },
    { name: "Mango", quantity: 20 }
  ];
  checkboxvalue = ['bala'];
  connectedCallback() {
    //this.handleArray();
    //this.handleArrayWithKeyVaue();
    //this.forEachMethod();
  }
  handleArray() {
    let array = ["Bala", "Rajee", "Moksha", "Sree"];
    console.log("array", typeof array);
    console.log("array", array);
    let fruits = [];
    fruits.push("Mango");
    console.log("fruits", typeof fruits);
    console.log("fruits", fruits);
    fruits.push("Lemon", "Banana", "Apple");
    console.log("fruits", fruits);
    console.log("keys", Object.keys(fruits));
    console.log("length", fruits.length);
    console.log("keyValue", fruits[2]);
    const arrayFilter = fruits.filter(value => value.length > 5);
    console.log("arrayFilter", arrayFilter);
    const arrayFilterNew = fruits.filter(this.filterMethod);
    console.log("arrayFilter", arrayFilterNew);
    console.log("array filteritems", this.filterItems(fruits, "le"));
    console.log("array filteritems", this.filterItems(fruits, "an"));
  }
  //filterint the array values
  filterMethod(valueArray) {
    return valueArray.length <= 5;
  }
  //Searching the array items based on string
  filterItems(arr, query) {
    return arr.filter(element =>
      element.toLowerCase().includes(query.toLowerCase())
    );
  }
  handleArrayWithKeyVaue() {
    let inventory = [
      { name: "Apple", quantity: 2 },
      { name: "Lemon", quantity: 5 },
      { name: "Banana", quantity: 12 },
      { name: "Mango", quantity: 20 }
    ];
    console.log("inventory", inventory);
    const inventoryNew = inventory.find(this.findInventoryName);
    console.log("inventoryNew", inventoryNew);
    const inventoryQuantity = inventory.find(this.findInventoryQuantity);
    console.log("inventoryQuantity", inventoryQuantity);
  }
  findInventoryName(value) {
    return value.name === "Mango";
  }
  findInventoryQuantity(value) {
    return value.quantity > 10;
  }
  forEachMethod() {
    let arrayNew = [];
    let arrayChild = [];
    //const array = ['Bala', 'Rajee', 'Moksha Sree'];
    this.array.forEach(element => {
      if (element.length < 6) {
        console.log("element:", element);
        arrayNew.push(element);
      } else {
        arrayChild.push(element);
      }
    });
    console.log("arrayNew:", arrayNew);
    console.log("arrayNew:", arrayChild);
  }
  forLoopMethod() {
    let arrayNew = [];
    for (let i = 0; i < this.array.length; i++) {
      console.log("i value", i);
      console.log("array values", this.array[i]);
      arrayNew.push(this.array[i]);
    }
    this.arrayWithKeyValue.forEach(element => {
      console.log("element:", element.name);
      console.log("element:", element);
      arrayNew.push({
        name: element.name,
        quantity: element.quantity
      });
    });
    console.log("arrayNew for each:", arrayNew);
  }
  mapforLoopMethod() {
    const numbers = [2, 6, 9];
    let total = 0;
    const withTax = numbers.map(cost => {
      total += cost;
      return cost * 1.2;
    });
    console.log("withTax", withTax);
    console.log("withTax", total);
    const products = [
      { name: "Sports car" },
      { name: "Laptop" },
      { name: "Phone" }
    ];
    products.map(product => {
      product.price = 100;
    });
    console.log("products", products);
    products.forEach(product => {
      product.price = 200;
    });
    console.log("for each products", products);
    const productsWithPrice = products.map(product => {
      return { ...product, price: 300 };
    });
    console.log("product with price", productsWithPrice);
  }
  pushforLoopMethod() {
    const animals = ["cat", "lion", "Tiger"];
    const fruits = ["Apple", "Mango", "Banana"];
    //merging the two arrays
    animals.push(...fruits);
    console.log("animals", animals);
  }
  handleObject() {
    const normalObj = {
      a: "Bala",
      b: "Rajee",
      c: "Moksha Sree"
    };
    const nullProtoObj = Object.create(null);
    console.log("normalObj", normalObj);
    console.log("nullProtoObj", nullProtoObj);
    for (const [key, values] of Object.entries(normalObj)) {
      console.log("key", key);
      console.log("value", values);
      console.log(`${key}: ${values}`);
    }
    //Converting an Object to a Map
    console.log("normalObj", normalObj);
    const map = new Map(Object.entries(normalObj));
    console.log("map", map);
  }
  handlePrerequisites() {
    let prerequisites = [
      {
        id: "a090o00003rAKgpAAG",
        name: "HP CloudSystem Matrix Expert Assistance Service",
        preServiceId: "PS119WW",
        serviceId: "PS221WW"
      },
      {
        id: "a090o00003rAKgnAAG",
        name: "HP CloudSystem Matrix Expert Assistance Service",
        preServiceId: "PS221WW",
        serviceId: "PS221WW"
      }
    ];
    let arrayNew = [
        {
            id: "a090o00003rAKgnAAG",
            name: "HP CloudSystem Matrix Expert Assistance Service",
            preServiceId: "Test",
            serviceId: "Test"
          }
    ];
    console.log('prerequisites',prerequisites);
    console.log('arrayNew',arrayNew);
    let arrayFianl = [...prerequisites, ...arrayNew];
    console.log('arrayFinal',arrayFianl);
    for(let key of prerequisites){
        console.log('key',key);
        console.log('key',key.serviceId);

    }
  }
  get options(){
    return [
      {label: 'Bala', value: 'bala'},
      {label: 'Balu', value: 'balu'},
      {label: 'Rajee', value: 'rajee'},
      {label: 'Moksha', value: 'moksha'},
      {label: 'Meena', value: 'meena'},
    ];
  }
  handleChange(event){
    this.checkboxvalue = event.target.value;
    console.log('checkboxvalue',this.checkboxvalue);
  }
}