'use server';

import axios from "axios";
import SecretManagerServiceClient from '@google-cloud/secret-manager';

async function accessRaApiKey() {
    // Set the name of the GCP project where you use the secret manager.
    const project = process.env.GCP_PROJECT;

    // Set your secret name here. This should refer to a secret you set
    // up in the GCP secret manager. See
    // https://cloud.google.com/security/products/secret-manager?hl=en
    // for details.
    const secretName = 'ra-api-key';

    const name = `projects/${project}/secrets/${secretName}/versions/latest`;

    const secretManagerClient = new SecretManagerServiceClient.SecretManagerServiceClient();

    const [accessResponse] = await secretManagerClient.accessSecretVersion({
        name,
    });

    const apiKey = accessResponse.payload.data.toString('utf8');

    return apiKey
};

const RA_API_KEY = await accessRaApiKey()

export default async function serverSavings(address : string, currentFuel: string) {

    const upgrade = 'high_eff_hp_elec_backup';

    // This is the URL for the REM API.
    const remApiURL = "https://api.rewiringamerica.org/api/v1/rem/address";

    let expectedSavings = "123";

    await axios
        .get(
            remApiURL,
            {
                params: {address: address, heating_fuel: currentFuel, upgrade: upgrade},
                headers: {Authorization: "Bearer " + RA_API_KEY}
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
