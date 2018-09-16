from amadeus import Client, ResponseError
import pprint
import requests
import pycountry
from json import loads
pp = pprint.PrettyPrinter(indent=4)

amadeus = Client(
    client_id='Gjr0dj3cogbnMkxVJRHW5GLOm0foYd3H',
    client_secret='ut0XrsF7PH0jeX41'
)

APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G"


def max_price_search(max_price, ori): #returns list_of_destinations, each element is [airport,city,state,country,price,importance]
    list_of_destinations = []
    try:
        url = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=" + str(ori) + "&apikey=" + APIkey + "&max_price=" + str(max_price)
        #print(url)
        response = requests.get(url)
        response = loads(response.content)

        
        for x in response["results"]:
            des = x["destination"]
            dep = x["departure_date"]
            ret = x["return_date"]
            air = x["airline"]
            price = x["price"]
            


            
            low_fare_url = ("https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=" + ori 
                            + "&destination=" + des + "&departure_date=" + dep + "&return_by=" + ret 
                            +"T23:59&apikey=" + APIkey + "&include_airline=" + air + "&number_of_results=1")
            low_fare_result = requests.get(low_fare_url)
            #print(low_fare_url)
            low_fare_result = loads(low_fare_result.content)["results"]
            #pp.pprint(low_fare_result)

            des_airport = low_fare_result[0]["itineraries"][0]["outbound"]["flights"][0]["destination"]["airport"]

            destination_url = "https://api.sandbox.amadeus.com/v1.2/location/" + des_airport + "?apikey=" + APIkey
            destination_info = requests.get(destination_url)
            destination_info = loads(destination_info.content)
            destination_info = destination_info["airports"][0]
            name_of_airport = destination_info["name"]
            importance = destination_info["aircraft_movements"]
            name_of_des_city = destination_info["city_name"]
            name_of_des_state = destination_info["state"]
            name_of_country = pycountry.countries.get(alpha_2 = destination_info["country"]).name
            to_print = [name_of_airport, name_of_des_city, name_of_des_state, name_of_country, price, importance]
            list_of_destinations.append(to_print)
            print(','.join(map(str,to_print)))

            #low_fare_url = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin="
            #            + str(ori) + "&apikey=" + APIkey + "&max_price=" + str(max_price)
            #            + "&departure_date=" + dep + "&return_date=" + ret
            #print(x["destination"] + "," + x["price"])
        # => [{'type': 'checkin-link', 'id': '1XEN-GBWeb', 'href': 'https://www....
    except ResponseError as error:
        print(error)
    return jsonify(list_of_destinations)

pp.pprint(max_price_search("100", "BOS"))

