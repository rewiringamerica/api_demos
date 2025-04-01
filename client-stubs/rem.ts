// Import the necessary client stub dependencies.
import { ResidentialElectrificationModelApi } from "@rewiringamerica/rem/api/apis";
import { SupportedUpgrade } from "@rewiringamerica/rem/model/supportedUpgrade";
import { HeatingFuel } from "@rewiringamerica/rem/model/heatingFuel";
import { HttpBearerAuth } from "@rewiringamerica/rem/model/models";

// Set up your key to send authorized requests to the API. If you don't already have
// one, you can sign up for one here: https://rewiring.link/api-signup
const key = new HttpBearerAuth()
key.accessToken = "keyExample"

// Initialize the API client and configure authorization with the API key.
const remApi = new ResidentialElectrificationModelApi();
remApi.setDefaultAuthentication(key)

// Define an async function that calls the get by address REM API endpoint.
async function getRemByAddress(upgrade: SupportedUpgrade, address: string, heatingFuel: HeatingFuel) {
  try {
    // Hit the API endpoint.
    const apiResponse = await remApi.getByAddress(upgrade, address, heatingFuel);
    // Extract the total values from the response object.
    const totals = apiResponse.body.fuelResults.total;
    // Extract the average annual cost savings from the response object.
    // This is an absolute value because the change in cost, which
    // decreases, could result in a negative sign.
    const costSavings = Math.round(Math.abs(totals.delta.cost.mean.value));
    // Display the savings!
    console.log(`I could save $${costSavings} annually with this home upgrade!`);
  } catch (error) {
    // If anything is wrong with the request, it'll get caught here.
    console.error("Error:", error.response.body);
  }
}

// Define the upgrade you want to model, your home's heating fuel,
// and your home's address.
const upgrade = SupportedUpgrade.HvacHeatPumpSeer15Hspf9
const address = "addressExample"
const heatingFuel = HeatingFuel.NaturalGas
// Call the async function that you set up.
getRemByAddress(upgrade, address, heatingFuel);