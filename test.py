from amadeus import Client, ResponseError
import pprint
import requests
from json import loads
pp = pprint.PrettyPrinter(indent=4)

amadeus = Client(
    client_id='Gjr0dj3cogbnMkxVJRHW5GLOm0foYd3H',
    client_secret='ut0XrsF7PH0jeX41'
)

def max_price_search(max_price):
    try:
        url = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=BOS&apikey=deruRte5Y9yrs4eK59paEuSZ9mGbGX0G" + "&max_price=" + str(max_price)
	print(url)
        response = requests.get(url)
        #pp.pprint(response.content)
        response = loads(response.content)
        for x in response["results"]:
            print(x["destination"] + "," + x["price"])
        # => [{'type': 'checkin-link', 'id': '1XEN-GBWeb', 'href': 'https://www....
    except ResponseError as error:
        print(error)

max_price_search("100")
