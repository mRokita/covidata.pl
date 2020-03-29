import httpx


class Client(httpx.Client):

    def __init__(self):
        super().__init__(
            base_url='http://api/api/v1/',
            headers={'Authorization': 'Bearer ***REMOVED***'}
        )


if __name__ == '__main__':
    with Client() as client:  # You should use that for every single request
        res = client.get('regions')
        print(res.json())
