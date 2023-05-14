import math
import pandas as pd


def get_prod_number(product_number):
    # Read the CSV file into a DataFrame
    df = pd.read_csv("./data.csv")

    filtered_df = df[df["product_number"] == product_number]

    # Create the output list
    data = []
    for _, row in filtered_df.iterrows():
        month_name = pd.to_datetime(row["date"]).strftime("%Y-%m")
        value = row["inventory_units"]

        if math.isnan(value) or math.isinf(value):
            value = None  # Set non-compliant float values to None
        data.append({"name": month_name, "value": value})

    return data


def get_prod_predict(product_number):
    # Read the CSV file into a DataFrame
    df = pd.read_csv("./predictions.csv")

    filtered_df = df[df["id"].str.split("-").str[1] == str(product_number)]
    sorted_df = filtered_df.sort_values("id", ascending=True)

    # Create the output list
    data = []
    for _, row in sorted_df.iterrows():
        week = row["id"][:6]
        value = row["inventory_units"]

        if math.isnan(value) or math.isinf(value):
            value = None  # Set non-compliant float values to None
        data.append({"name": week, "value": value})

    return data


def get_reseller_items(reseller_id, yearweek):
    # Read the CSV file into a DataFrame
    df = pd.read_csv("./data.csv")
    data = []
    try:
        week1 = df[df["year_week"] == yearweek]
        grouped_week1 = week1.groupby(["reporterhq_id"])

        dict_week1 = dict(list(grouped_week1))
        dict_week1[reseller_id]

        for _, row in dict_week1[reseller_id].iterrows():
            product = row["product_number"]
            quantity = row["inventory_units"]
            date = row["year_week"]
            data.append({"product": product, "quantity": quantity, "date": date})
    except:
        data = []

    return data
