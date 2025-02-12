import { useState } from 'react';
import './styles.css';

import axios from "axios";

function AddressForm() {
    // The three values we need to call the REM API are
    // 
    //   - the address of the home;
    //   - the current heating fuel;
    //   - the upgrade to be performed.
    //
    // We will make states for the first two, whose values
    // will be managed by a form. For the third one, we will
    // just use a constant value.
    const [address, setAddress] = useState("");
    const [currentFuel, setCurrentFuel] = useState("natural_gas");
    const [savings, setSavings] = useState("")
    const [hidden, setHidden] = useState(true)

    const upgrade = 'hvac__heat_pump_seer24_hspf13'

    // This is the URL for the REM API.
    const remApiURL = "https://api.rewiringamerica.org/api/v1/rem/address"

    // If you don't have an API key, please register at 
    // https://rewiring.link/api-signup to get one.
    //
    // Please do not commit you API key to any
    // public repository. There is an additional example
    // in this repository that shows how to secure your 
    // API key using Next.js. It is in the `rem-with-nextjs/`
    // directory.
    //
    // That is more the type of thing you would want to do
    // in a production environment. But for now, we are just
    // introducing the API in static page to get started and
    // help you understand what it can do.
    const apiKey = "INSERT_YOUR_API_KEY_HERE"
    
    const onFuelChange = (event) => {
        setCurrentFuel(event.target.value)
        setHidden(true)
    }

    /**
     * Callback when the form is submitted.
     * 
     * This is where we make the API call, and then,
     * when it returns, update the results in the DOM
     * based on the result.
     * 
     * @param {Event} event - the change event.
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        try {            
            axios
                .get(
                    remApiURL,
                    {
                        params: {address: address, heating_fuel: currentFuel, upgrade: upgrade},
                        headers: {Authorization: "Bearer " + apiKey}
                    } 
                )
                .then(
                    (response) => {                    
                        const rawSavings = -Number(response.data.fuel_results.total.delta.cost.mean.value)
                        const roundedSavings = (Math.round(rawSavings * 100) / 100).toFixed(2);
                        const expectedSavings = "$" + roundedSavings

                        setSavings(expectedSavings)
                        setHidden(false)
                    }
                )
        } catch (error) {
            console.log(error)      
        }
    }

    return (
        <>
            <div id="mainform">
                <form onSubmit={handleSubmit}>
                    <label>
                        <p className="label">
                            Address:
                        </p>
                        <input
                            type="text"
                            id="address"
                            value={address} 
                            onChange={
                                e => {
                                    setAddress(e.target.value)
                                    setHidden(true)
                                }
                            }
                        />
                    </label>
                    <br/><br/>
                    <fieldset id="fuels">
                        <legend className="label">Current Heating Fuel:</legend>
                        <label>
                            <input
                                type="radio"
                                name="fuel"
                                value="fuel_oil"
                                onChange={onFuelChange}
                            />
                            Fuel Oil
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="fuel"
                                value="natural_gas"
                                onChange={onFuelChange}
                                defaultChecked={true}
                            />
                            Natural Gas
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="fuel"
                                value="propane"
                                onChange={onFuelChange}
                            />
                            Propane
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="fuel"
                                value="electricity"
                                onChange={onFuelChange}
                            />
                            Electricity
                        </label>
                        </fieldset>
                    <br/><br/>
                    <label>
                        <input type="submit" value="OK"/>
                    </label>
                </form>
            </div>
            <div id="results" hidden={hidden}>
                <p>Expected annual savings: <span id="savings">{savings}</span></p>
                <p>Call us at 1-800-LEC-TRIC to get your job started today!</p>
            </div>
        </>
    );
}


export default function App() {
    return (
        <>
            <div id="titlebar">
                <h1 id="title">
                    Electrification Nation
                </h1>
                <h2 id="subtitle">Your Heat Pump People</h2>
            </div>
            <div id="content">
                <div>
                    We're here to help you save money by electrifying your home. Enter your address and select the fuel you
                    currently use to heat your home and we'll tell you how much you can save by having us install a heat pump!
                </div>
                <AddressForm>
                </AddressForm>
            </div>
        </>    
    );
}
