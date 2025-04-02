# Import the client stub package.
import rewiringamerica_rem

# Set up your key to send authorized requests to the API. If you
# don't already have one, you can sign up for one here: https://rewiring.link/api-signup
#
# Please do not commit you API key to any public repository. There is an
# additional example in this repository that shows how to secure your API key
# using Next.js. It is in the `rem-with-nextjs/` directory.
configuration = rewiringamerica_rem.Configuration(
    access_token="key_example"
)

# Initialize the API client and query parameters to pass into your API request.
with rewiringamerica_rem.ApiClient(configuration) as api_client:
    # Create an instance of the API class.
    api_instance = rewiringamerica_rem.ResidentialElectrificationModelApi(api_client)
    # Define your the upgrade you want to model, your home's heating fuel,
    # and your home's address.
    upgrade = rewiringamerica_rem.SupportedUpgrade.HVAC__HEAT_PUMP_SEER15_HSPF9
    address = "address_example"
    heating_fuel = rewiringamerica_rem.HeatingFuel.NATURAL_GAS

    try:
        # Hit the API endpoint.
        api_response = api_instance.get_by_address(upgrade, address, heating_fuel)
        # Extract the total values from the response object.
        totals = api_response.fuel_results["total"]
        # Extract the average annual cost savings from the response object.
        # This is an absolute value because the change in cost, which
        # decreases, could result in a negative sign.
        cost_savings = round(-(totals.delta.cost.mean.value))
        # Display the savings!
        print(f"I could save ${cost_savings} annually with this home upgrade!")
    except Exception as e:
        # If anything is wrong with the request, it'll get caught here.
        print("Exception when calling get_by_address: %s\n" % e)
