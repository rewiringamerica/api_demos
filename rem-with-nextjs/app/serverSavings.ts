'use server';

import axios from "axios";

export default async function serverSavings(address : string, currentFuel: string) {

    console.log("On the server side.")

    const upgrade = 'high_eff_hp_elec_backup';

    // This is the URL for the REM API.
    const remApiURL = "https://api.rewiringamerica.org/api/v1/rem/address";

    // If you don't have an API key, please register at 
    // https://rewiring.link/api-signup to get one.
    const apiKey = "INSERT_YOUR_API_KEY_HERE";
    
    let expectedSavings = "123";

    await axios
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
                expectedSavings = "$" + roundedSavings
            }
        )

    return expectedSavings;
}
