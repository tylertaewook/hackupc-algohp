from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from eda import get_prod_number, get_prod_predict, get_reseller_items


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    data = get_prod_number(6909)
    return data


@app.get("/product/{prodId}")
async def read_item(prodId):
    data = get_prod_number(int(prodId))
    return data


@app.get("/predict/{prodId}")
async def read_item(prodId):
    data = get_prod_predict(int(prodId))
    return data


@app.get("/seller/{reseller_id}/{year_week}")
async def read_item(reseller_id, year_week):
    data = get_reseller_items(int(reseller_id), int(year_week))
    return data
