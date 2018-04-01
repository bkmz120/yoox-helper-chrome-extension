import CountriesStorage from "../common/CountriesStorage.js";
import SettingsStorage from "../common/SettingsStorage.js";

export const actions = {
    newCountry: {
        setName: value => state => ({name:value}),
        setShortName: value => state => ({shortName:value}),
        setEURcoef: value => state => ({EURcoef:value})
    },
    addCountry:value => (state, actions) => {
        let valid = true;
        let errorMsg = "";
        state.newCountryValid = {
            name:true,
            shortName:true,
            EURcoef:true,
        }

        if (state.newCountry.name=="") {
            valid = false;
            state.newCountryValid.name = false;
        }

        if (state.newCountry.shortName=="") {
            valid = false;
            state.newCountryValid.shortName = false;
        }

        if (state.newCountry.EURcoef=="") {
            valid = false;
            state.newCountryValid.EURcoef = false;
        }

        if (!valid) {
            errorMsg = "Fill all required fields"

            return {
                newCountryValid:state.newCountryValid,
                errorMsg:errorMsg,
            }
        }

        for (var i=0;i<state.countries.length;i++) {
            if (state.countries[i].shortName===state.newCountry.shortName) {
                errorMsg = "Short name must be unique";
                state.newCountryValid.shortName = false;
                valid=false;
                break;
            }
        }

        if (!valid) {
            return {
                newCountryValid:state.newCountryValid,
                errorMsg:errorMsg,
            }
        }

        state.newCountry.EURcoef = state.newCountry.EURcoef.replace(",",".");
        state.countries.push(state.newCountry);
        actions.saveCountries();
        return {
            countries:state.countries,
            newCountry: {
                name:"",
                shortName:"",
                EURcoef:""
            },
            errorMsg:errorMsg,
        }
    },
    removeCountry:shortName=>(state, actions)=>{
        for (var i=0;i<state.countries.length;i++) {
            if (state.countries[i].shortName===shortName) {
                state.countries.splice(i,1);
                break;
            }
        }
        actions.saveCountries();
        return {
            countries:state.countries
        }
    },
    setEURCoef:value=>(state, actions)=> {
        value.EURcoef = value.EURcoef.replace(",",".");
        for (var i=0;i<state.countries.length;i++) {
            if (state.countries[i].shortName===value.shortName) {
                state.countries[i].EURcoef = value.EURcoef;
                break;
            }
        }
        actions.saveCountries();
        return {
            countries:state.countries,
        }
    },
    setAllCountries:value=>{
        if (value===undefined) {
            value=[];
        }
        return {
            countries:value
        }
    },
    setSettings:value=> {
        if (value===undefined) {
            value=[];
        }
        return {
            settings:value
        }
    },
    changeAutoLoadPriceStatus:value=>(state)=>{
        console.log(state);
        state.settings.autoLoadPriceStatus = value;
        SettingsStorage.saveAll(state.settings);
        return {
            settings:state.settings
        }
    },
    saveCountries:value=>state=>{
        CountriesStorage.saveAll(state.countries);
        return true;
    },
    loadSetting:value=>(state, actions)=> {
        SettingsStorage.getAll().then((settings)=>{
            actions.setSettings(settings);
        });

        CountriesStorage.getAll().then((countries)=>{
            actions.setAllCountries(countries);
        });
    }
}