import CountriesStorage from "../common/CountriesStorage.js";

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


        state.countries.push(state.newCountry);
        actions.saveSettings();
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
        actions.saveSettings();
        return {
            countries:state.countries
        }
    },
    setEURCoef:value=>(state, actions)=> {
        for (var i=0;i<state.countries.length;i++) {
            if (state.countries[i].shortName===value.shortName) {
                state.countries[i].EURcoef = value.EURcoef;
                break;
            }
        }
        actions.saveSettings();
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
    saveSettings:value=>state=>{
        CountriesStorage.saveAll(state.countries);
        return true;
    },
    loadSetting:value=>(state, actions)=> {
        CountriesStorage.getAll().then((countries)=>{

            actions.setAllCountries(countries);
        });
    }
}