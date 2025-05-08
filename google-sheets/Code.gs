/*
 * Residential Electrification Model
 *  _______      ________   ____    ____
 * |_   __ \    |_   __  | |_   \  /   _|
 *   | |__) |     | |_ \_|   |   \/   |
 *   |  __ /      |  _| _    | |\  /| |
 *  _| |  \ \_   _| |__/ |  _| |_\/_| |_
 * |____| |___| |________| |_____||_____|
 *
 * Google Apps Script to call Rewiring America's REM API
 * from Google Sheets.
 *
 * Check https://github.com/rewiringamerica/api_demos for
 * the latest version of this script.
 *
 * Example usage, in a cell in your spreadsheet:
 * =REM('123 Main St', 'baseline', 'natural_gas', 'natural_gas', 'YOUR_API_KEY')
 *
 * The function call will produce a large table of results,
 * see https://api.rewiringamerica.org/ to sign up for a key
 * and check the documentation for details of the model.
 *
 */

const UPGRADES = [
  "baseline",
  "combination__all_electric__hvac_seer24_hspf13__weatherization",
  "combination__hvac_seer18_hspf10__weatherization",
  "hvac__heat_pump_seer15_hspf9",
  "hvac__heat_pump_seer18_hspf10",
  "hvac__heat_pump_seer24_hspf13",
  "water_heater__heat_pump_uef3.35",
  "weatherization__insulation_air_duct_sealing",
];

const HEATING_FUELS = ["electricity", "natural_gas", "fuel_oil", "propane"];

const WATER_HEATER_FUELS = [
  "electricity",
  "fuel_oil",
  "natural_gas",
  "propane",
];

/**
 * Return complete data from Rewiring America's REM API.
 *
 * @param {string} address The full address for a location including street number and name, city, state, and zip code.
 * @param {string} upgrade The upgrade whose effects we want to analyze.
 * @param {string} heating_fuel The heating fuel used in the home before the upgrade.
 * @param {string} [water_heater_fuel] The fuel used by the home's water heater before the upgrade. Required when requesting water heater upgrades; otherwise optional.
 * @param {string} apiKey A valid Rewiring America API key.
 * @return A two-dimensional array containing the data.
 * @customfunction
 */
function REM(address, upgrade, heating_fuel, water_heater_fuel, apiKey) {
  try {
    validateParameters(
      address,
      upgrade,
      heating_fuel,
      water_heater_fuel,
      apiKey
    );
    const results = callRem(
      {
        address,
        upgrade,
        heating_fuel,
        ...(water_heater_fuel && { water_heater_fuel }), // this ensures that water_heater_fuel key is only set when there's a value provided
      },
      apiKey
    );
    return formatRemTable(results);
  } catch (e) {
    return [["ERROR: " + e.message]];
  }
}

/**
 * Validate parameters for Rewiring America's REM API.
 *
 * @param {string} address The full address for a location including street number and name, city, state, and zip code.
 * @param {string} upgrade The upgrade whose effects we want to analyze.
 * @param {string} heating_fuel The heating fuel used in the home before the upgrade.
 * @param {string} [water_heater_fuel] The fuel used by the home's water heater before the upgrade. Required when requesting water heater upgrades; otherwise optional.
 * @param {string} apiKey A valid Rewiring America API key.
 * @private
 */
function validateParameters(
  address,
  upgrade,
  heating_fuel,
  water_heater_fuel,
  apiKey
) {
  if (typeof address !== "string") {
    throw new Error("Parameter 1 must be a string with a full address.");
  }
  if (!UPGRADES.includes(upgrade)) {
    throw new Error("Parameter 2 must be a valid upgrade.");
  }
  // TODO: check whether water_heater_fuel is required, based on upgrade type
  if (!HEATING_FUELS.includes(heating_fuel)) {
    throw new Error("Parameter 3 must be a valid upgrade heating fuel.");
  }
  if (
    typeof water_heater_fuel === "string" &&
    !WATER_HEATER_FUELS.includes(water_heater_fuel)
  ) {
    throw new Error("Parameter 4 must be a valid upgrade heating fuel.");
  }
  if (typeof apiKey !== "string" || !apiKey.startsWith("zpka_")) {
    throw new Error(
      "API key required and must be a valid Rewiring America key. Register at https://api.rewiringamerica.org"
    );
  }
}

/**
 * Calls the Rewiring America REM API with the given query as a key value object.
 *
 * @param {Object.<string, string>} query Object containing REM parameters as keys and values.
 * @param {string} apiKey A valid Rewiring America API key.
 * @return {Object} The complete parsed REM response ready to use in code.
 * @private
 */
function callRem(query, apiToken) {
  const url = buildURL(
    "https://api.rewiringamerica.org/api/v1/rem/address",
    query
  );
  const params = {
    method: "GET",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${apiToken}` },
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, params);
  // TODO: check for non-200 response here?
  return JSON.parse(response.getContentText());
} // https://stackoverflow.com/questions/68689710/google-app-script-urlfetchapp-with-bearer-token-but-get-bad-request

/**
 * Builds a complete URL from a base URL and a map of URL parameters.
 *
 * @param {string} url The base URL.
 * @param {Object.<string, string>} query Object containing URL parameters as keys and values.
 * @return {string} The complete URL.
 * @private
 */
function buildURL(url, query) {
  const queryString = Object.keys(query)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
    })
    .join("&");
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + queryString;
} // Credit to https://stackoverflow.com/questions/63668793/sending-parameters-with-urlfetchapp

/**
 * Formats the REM results in a generic data table for easier reuse in your spreadsheet.
 *
 * @param {Object>} results Complete REM API resonse ready to use in code.
 * @return {Array} An array of arrays representing a table of REM results.
 * @private
 */
function formatRemTable(results) {
  if (results.detail) {
    return [["ERROR: " + results.detail]];
  }
  const { fuel_results, rates, emissions_factors, sampling_details } = results;

  // TODO: better names for these headings?
  const headings = [
    "fuel",
    "impact",
    "scenario",
    "mean",
    "median",
    "percentile_20",
    "percentile_80",
    "unit",
  ];
  const table = [headings];

  // fuel_results
  const fuels = ["total", "electricity", "fuel_oil", "natural_gas", "propane"];
  const impacts = ["energy", "emissions", "cost"];
  const scenarios = ["baseline", "delta", "upgrade"];
  const columns = ["mean", "median", "percentile_20", "percentile_80"];
  fuels.forEach((fuel) => {
    var fuelData = fuel_results[fuel];
    impacts.forEach((impact) => {
      scenarios.forEach((scenario) => {
        var bucketData = fuelData[scenario] || {}; // some scenarios return empty
        var rowData = bucketData[impact] || {};
        var colData = columns.map((col) => {
          return rowData[col] || {};
        });
        table.push([
          fuel,
          impact,
          scenario,
          ...colData.map((c) => c.value),
          colData[0].unit,
        ]);
      });
    });
  });

  // spacer
  table.push([]);

  // rates
  table.push(["fuel", "rate type", "rate", "unit"]);
  ["electricity", "fuel_oil", "natural_gas", "propane"].forEach((fuel) => {
    var fuelRates = rates[fuel];
    fuelRates.forEach(({ rate_type, value, unit }) => {
      table.push([fuel, rate_type, value, unit]);
    });
  });

  // spacer
  table.push([]);

  // emissions_factors
  table.push(["fuel", "emissions_factor", "unit"]);
  ["electricity", "fuel_oil", "natural_gas", "propane"].forEach((fuel_type) => {
    table.push([
      fuel_type,
      emissions_factors[fuel_type].value,
      emissions_factors[fuel_type].unit,
    ]);
  });

  // spacer
  table.push([]);

  // sampling_details
  table.push(["sampling_detail", "value"]);
  table.push(["num_samples", sampling_details.num_samples]);
  table.push(["num_excluded_samples", sampling_details.num_excluded_samples]);

  return table;
}
