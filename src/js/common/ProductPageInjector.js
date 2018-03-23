import $ from "jquery";
import ProductPageParser from "./ProductPageParser.js";
import ProductCountriesIterator from "./ProductCountriesIterator.js";

export default class ProductPageInjector {
    constructor(document,url){
        this._document = document;
        this._url = url;
    }

    inject() {
        $(document).ready(()=>{
            setTimeout(()=>{
                var productPageParser = new ProductPageParser(this._document);
                var self = this;
                productPageParser.ready(function(){
                    let $price = this.getPriceEl();
                    self._$priceWrap = $price.closest("#item-price");
                    self._$showPrices = $("<a/>",{
                        text:"Get other prices",
                        href:"#",
                        class:"show-prices-link"
                    });
                    self._$showPrices.on("click",self._showPrices.bind(self));
                    self._$priceWrap.append(self._$showPrices);
                });
            },2000);

        });

    }

    _showPrices(e) {
        e.preventDefault();
        var productCountriesIterator = new ProductCountriesIterator(this._url);
        productCountriesIterator.getPrices().then((countries)=>{
            console.log(countries);
            this._$showPrices.remove();
            let $cPricesWrap = $("<div />",{
                class:"country-price-link-wrap",
            });
            for (let i=0;i<countries.length;i++) {
                let $cPrice = $("<a/>",{
                    text:countries[i].price_str,
                    href:countries[i].url,
                    target:"_blank",
                    class:"country-price-link"
                });
                $cPricesWrap.append($cPrice);
            }
            this._$priceWrap.append($cPricesWrap);
        });
        return false;
    }

}