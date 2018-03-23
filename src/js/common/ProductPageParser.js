import $ from "jquery";
import parsePrice from 'parse-price';

export default class ProductPageParser {
    /**
     * productPage - document object of page or url of page
     */
    constructor(productPage) {
        if (typeof productPage === "string") {
            this._documentReady = this._loadDocument(productPage);
        }
        else if (typeof productPage === "object") {
            this._$pageDocument = productPage;
            this._documentReady = Promise.resolve();
        }
    }

    _loadDocument(url) {
        let loadPromise= new Promise((resolve,reject)=>{
            $.get(url,(data)=>{
                this._$pageDocument = $("<html />",{
                  html:data
                });
                resolve();
            });
        });
        return loadPromise;
    }

    ready(callback) {
        this._documentReady.then(()=>{
            callback.apply(this);
        });
    }

    getPriceEl() {
        this._$priceEl = $("#item-price span[itemprop='price']",this._$pageDocument);
        return this._$priceEl;
    }

    getPriceValue(EURcoef) {
        if (this._$priceEl === undefined ) {
            this.getPriceEl();
        }
        let price = parsePrice(this._$priceEl.text());
        if (EURcoef!==undefined) {
            price = price*EURcoef;
        }
        price = price.toFixed(2);
        return price;
    }
}