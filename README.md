# US Stock Chart Web

This is US stock chart website.

## Stacks
Backend: Django
Frontend: React.js

## Dependencies
###Install dependencies

- Inside `backend/`
```sh
pip install -r requirements.txt
```

- Inside frontend/
```sh
npm install
```
## API Endpoints
- `api/stock/`
    - List all stokcs that are created by user requests.

- `api/stock/<str:symbol>`
    - Retrieve and destroy object with a requested symbol.
    - If object is not found, create one in database.
    - If object is not found because such symbol does not exist, than send `HTTP 404` error.
    - Update object in every user request.

- `api/candle?symbol=<symbol>&from=<from_date>&to=<to_date>`
    - List all candle data that matches requested params.
    - If candle data does not exist, retrieve all candle data from `1900-01-01` to today and save to database.
    - GET request should be made every 5 seconds.
