import { LightningElement, track } from "lwc";
import retrieveNews from "@salesforce/apex/NewsController.retrieveNews";
export default class NewsComponent extends LightningElement {
  error;
  @track result = [];
  isShowModal = false;
  @track selectedNews = {};
  get modalClass() {
    return this.isShowModal ? "slds-modal slds-fade-in-open" : "slds-modal";
  }
  get modalBackDropClass() {
    return this.isShowModal
      ? "slds-backdrop slds-backdrop_open"
      : "slds-backdrop";
  }
  connectedCallback() {
    this.fetchNews();
  }
  fetchNews() {
    retrieveNews()
      .then((response) => {
        this.formattedResponse(response.articles);
        this.error = undefined;
      })
      .catch((error) => {
        console.log("error", error);
        this.error = error;
      });
  }
  formattedResponse(response) {
    this.result = response.map((items, index) => {
      let id = `new_${index + 1}`;
      let name = items.source.name;
      let date = new Date(items.publishedAt).toDateString();
      return { ...items, id: id, name: name, date: date };
    });
  }
  showModal(event) {
    this.isShowModal = true;
    let newsId = event.target.dataset.id;
    this.selectedNews = this.result.find((item) => item.id === newsId);
  }
  closeModal() {
    this.isShowModal = false;
  }
}