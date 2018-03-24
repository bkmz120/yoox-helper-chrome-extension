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
                    let $priceWrap = $price.closest("#item-price");
                    let $loading = $("<div />",{
                        text:"Loading prices...",
                        class:"country-price-loading"
                    });
                    $priceWrap.append($loading);
                    let productCountriesIterator = new ProductCountriesIterator(self._url);
                    productCountriesIterator.getPrices().then((countries)=>{
                        let $cPricesWrap = $("<div />",{
                            class:"country-price-link-wrap",
                        });
                        for (let i=0;i<countries.length;i++) {
                            let $cPrice = $("<a/>",{
                                text:countries[i].price_str,
                                href:countries[i].url,
                                class:"country-price-link"
                            });
                            $cPricesWrap.append($cPrice);
                        }
                        $loading.remove();
                        $priceWrap.append($cPricesWrap);
                    });
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