'use client';
// import Image from "next/image";

import Head from 'next/head'

import { FormEvent, useState } from 'react';
import './globals.css';

import serverSavings from './serverSavings';

async function clientSavings(address : string, currentFuel : string) {
    console.log("On the client side.");

    const expectedSavings = await serverSavings(address, currentFuel);

    return expectedSavings
}

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

    const onFuelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const expectedSavings = clientSavings(address, currentFuel);

        console.log(`Handler Savings: ${expectedSavings}`)

        setSavings(expectedSavings)
        setHidden(false)
    };

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
                    <label>
                        <p className="label">
                        Current Heating Fuel:
                        </p>
                        <input type="radio" className="fuel" name="fuel" value="fuel_oil" onChange={onFuelChange} />
                        Fuel Oil &nbsp;&nbsp;
                        <input type="radio" className="fuel" name="fuel" value="natural_gas" onChange={onFuelChange} defaultChecked={true} />
                        Natural Gas &nbsp;&nbsp;
                        <input type="radio" className="fuel" name="fuel" value="propane" onChange={onFuelChange} />
                        Propane &nbsp;&nbsp;
                        <input type="radio" className="fuel" name="fuel" value="electricity" onChange={onFuelChange} />
                        Electricity
                    </label>
                    <br/><br/>
                    <label>
                        <input type="submit" value="OK" id="ok"/>
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

export default function Home() {
    return (
        <div>
            <Head>
              <title>REM Demo with Secrets</title>
            </Head>
            <div id="titlebar">
                <h1 id="title">
                    Electrification Nation
                </h1>
                <h2 id="subtitle">Your Heat Pump People</h2>
            </div>
            <div id="content">
                <div>
                    We&apos;re here to help you save money by electrifying your home. Enter your address and select the fuel you
                    currently use to heat your home and we&apos;ll tell you how much you can save by having us install a heat pump!
                </div>
                <AddressForm>
                </AddressForm>
            </div>
        </div>    
    );
}
