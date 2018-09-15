from amadeus import Client, ResponseError
import pprint
import requests
import pycountry
from json import loads, dumps
pp = pprint.PrettyPrinter(indent=4)

amadeus = Client(
    client_id='Gjr0dj3cogbnMkxVJRHW5GLOm0foYd3H',
    client_secret='ut0XrsF7PH0jeX41'
)

APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G"

def get_from_url(url):
    data = requests.get(url)
    data = loads(data.content)
    return data

def get_result_from_url(url):
    return get_from_url(url)["results"]

def extract_airport_info(des_info):
    destination_info = des_info["airports"][0]
    latitude_of_airport = float(destination_info["location"]["latitude"])
    longtitude_of_airport = float(destination_info["location"]["longitude"])
    name_of_airport = destination_info["name"]
    importance = destination_info["aircraft_movements"]
    name_of_des_city = destination_info["city_name"]
    name_of_des_state = destination_info["state"]
    name_of_country = pycountry.countries.get(alpha_2 = destination_info["country"]).name
    return {"latitude_of_airport": latitude_of_airport, "longtitude_of_airport": longtitude_of_airport, "name_of_airport": name_of_airport, "name_of_des_city": name_of_des_city, "name_of_des_state": name_of_des_state, "name_of_country": name_of_country, "importance": importance}

def extract_city_info(des_info):
    city_info = des_info["city"]
    lat = float(city_info["location"]["latitude"])
    lng = float(city_info["location"]["longtitude"])
    country = pycountry.countries.get(alpha_2 = city_info["country"]).name
    state = city_info["state"]
    name = city_info["name"]
    movement = 0
    for airport in des_info["airports"]:
        movement = movement + int(airport["aircraft_movements"])
    return {"center": {"lat":lat, "lng": lng}, "country": country, "state": state, "name": name, "movement": str(movement)}

def master_search(max_price, ori): #returns list_of_destinations, each element is [lat, long, airport,city,state,country,price,importance]
    list_of_destinations = []
    try:
        url = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=" + str(ori) + "&apikey=" + APIkey + "&max_price=" + str(max_price)
        #print(url)
        #response = requests.get(url)
        #response = loads(response.content)

        
        for x in get_result_from_url(url):
            des = x["destination"]
            dep = x["departure_date"]
            ret = x["return_date"]
            air = x["airline"]
            price = x["price"]
            
            low_fare_url = ("https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=" + ori 
                            + "&destination=" + des + "&departure_date=" + dep + "&return_by=" + ret 
                            +"T23:59&apikey=" + APIkey + "&include_airline=" + air + "&number_of_results=1")
            #low_fare_result = requests.get(low_fare_url)
            #print(low_fare_url)
            low_fare_result = get_result_from_url(low_fare_url)
           

            des_airport = low_fare_result[0]["itineraries"][0]["outbound"]["flights"][0]["destination"]["airport"]
            destination_url = "https://api.sandbox.amadeus.com/v1.2/location/" + des_airport + "?apikey=" + APIkey
            #destination_info = requests.get(destination_url)
            #destination_info = loads(destination_info.content)
            destination_info = get_from_url(destination_url)

            airport_info = extract_airport_info(destination_info)
            airport_info["price"] = float(price)

            city_info = extract_city_info(destination_info)
            city_info["price"] = float(price)
            list_of_destinations.append(city_info)
            

            
    except ResponseError as error:
        print(error)
    return dumps(list_of_destinations)

def min_dur_search(ori, des, dep, ret, max_price):
    try:
        low_fare_url = ("https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=" + ori
                        + "&destination=" + des + "&departure_date=" + dep + "&return_by=" + ret
                        +"T23:59&apikey=" + APIkey)
            # low_fare_url = ("https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=" + ori
            #                 + "&destination=" + des + "&departure_date=" + dep + "&return_by=" + ret
            #                 +"T23:59&apikey=" + APIkey + "&include_airline=" + air + "&number_of_results=1")
        low_fare_results = requests.get(low_fare_url)
        low_fare_results = loads(low_fare_results.content)
        champion_duration = timedelta(hours=999,minutes=0)
        champion_it = low_fare_results["results"][0]["itineraries"][0]
        for x in low_fare_results["results"]:

            for it in x["itineraries"]:
                duration = convert_duration(it["inbound"]["duration"]) + convert_duration(it["outbound"]["duration"])
                if champion_duration > duration:
                    champion_duration = duration
                    champion_it = it
        return champion_it
    except ResponseError as error:
        print(error)


pp.pprint(master_search("100", "BOS"))

