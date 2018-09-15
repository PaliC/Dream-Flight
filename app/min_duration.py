from amadeus import Client, ResponseError
import pprint
import requests
import pycountry
from json import loads
pp = pprint.PrettyPrinter(indent=4)
from datetime import datetime, timedelta

amadeus = Client(
    client_id='Gjr0dj3cogbnMkxVJRHW5GLOm0foYd3H',
    client_secret='ut0XrsF7PH0jeX41'
)

APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G"
def convert_duration(duration):
    t = datetime.strptime(duration,"%H:%M")
    delta = timedelta(hours=t.hour, minutes=t.minute)
    return delta
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