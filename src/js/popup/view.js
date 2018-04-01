import {h} from "hyperapp"

const CountryRow = ({name,shortName,EURcoef,removeCountry,setEURCoef}) => (
    <div class="country-row">
        <div class="country-row__name">{name}</div>
        <div class="country-row__shortName">{shortName}</div>
        <input  type="text"
                class="country-row__eurCoef"
                value={EURcoef}
                oninput={e => setEURCoef({
                    EURcoef:e.target.value,
                    shortName:shortName
                })}
        />
        <i class="country-row__remove fas fa-times" onclick={()=>removeCountry(shortName)}></i>
    </div>
);

const CountryNewRow = ({
    setName,
    setShortName,
    setEURCoef,
    addCountry,
    validName,
    validShortName,
    validEURcoef
}) => (
    <div class="country-new-row">
        <input  type="text"
                class={validName ? 'country-new-row__name' : 'country-new-row__name error-inp'}
                oninput={e => setName(e.target.value)}
                placeholder="Country"
        />
        <input  type="text"
                class={validShortName ? 'country-new-row__shortName' : 'country-new-row__shortName error-inp'}
                oninput={e => setShortName(e.target.value)}
                placeholder="Short name"
        />
        <input type="text"
                class={validEURcoef ? 'country-new-row__eurCoef' : 'country-new-row__eurCoef error-inp'}
                oninput={e => setEURCoef(e.target.value)}
                placeholder="to EUR coef"
        />
        <div class="country-new-row__addBtn" onclick={()=>addCountry()}>Add</div>
    </div>
)

export const view = (state, actions) => {
    var countries = state.countries.map((country)=>{
        return  <CountryRow
                    name={country.name}
                    shortName={country.shortName}
                    EURcoef={country.EURcoef}
                    removeCountry={actions.removeCountry}
                    setEURCoef = {actions.setEURCoef}
                />
    });

    return  <div class="popup" oncreate={()=>actions.loadSetting()}>
                <div class="country-row country-row_label">
                    <div class="country-row__name country-row__name_label">Country</div>
                    <div class="country-row__shortName country-row__shortName_label">Short name</div>
                    <div class="country-row__eurCoef country-row__eurCoef_label">to EUR coef</div>
                </div>
                {countries}
                <CountryNewRow
                    setName={actions.newCountry.setName}
                    setShortName={actions.newCountry.setShortName}
                    setEURCoef={actions.newCountry.setEURcoef}
                    addCountry={actions.addCountry}
                    validName={state.newCountryValid.name}
                    validShortName={state.newCountryValid.shortName}
                    validEURcoef={state.newCountryValid.EURcoef}
                />
                <div class="error-msg">{state.errorMsg}</div>

                <div class="checkbox">
                    <input type="checkbox"
                           id="autoLoadPrice"
                           class="checkbox__inp"
                           checked={state.settings.autoLoadPriceStatus}
                           onchange={e => actions.changeAutoLoadPriceStatus(e.target.checked)}
                    />
                    <label for="autoLoadPrice" class="checkbox__label">Auto load price</label>
                </div>
            </div>
}
