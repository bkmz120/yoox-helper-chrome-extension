import $ from "jquery";
import ProductPageParser from "./ProductPageParser.js";
import ProductCountriesIterator from "./ProductCountriesIterator.js";
import SettingsStorage from "./SettingsStorage.js";

export default class ProductPageInjector {
    constructor(document,url){
        this._document = document;
        this._url = url;
    }

    inject() {
        SettingsStorage.getAll().then((settings)=>{
            $(document).ready(()=>{
                setTimeout(()=>{
                    var productPageParser = new ProductPageParser(this._document);
                    var self = this;
                    console.log(settings);
                    productPageParser.ready(function(){
                        let $price = this.getPriceEl();
                        if (settings.autoLoadPriceStatus) {
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
                        }
                        else {
                            self._$priceWrap = $price.closest("#item-price");
                            self._$showPrices = $("<a/>",{
                                text:"Get other prices",
                                href:"#",
                                class:"show-prices-link"
                            });
                            self._$showPrices.on("click",self._showPrices.bind(self));
                            self._$priceWrap.append(self._$showPrices);
                        }

                    });
                },2000);
            });
        });
    }

    _showPrices(e) {
        e.preventDefault();
        this._$showPrices.off("click",self._showPrices);
        this._$showPrices.text("Loading prices...");
        this._$showPrices.addClass("show-prices-link_loading");
        var productCountriesIterator = new ProductCountriesIterator(this._url);
        productCountriesIterator.getPrices().then((countries)=>{
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