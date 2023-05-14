# AlgoHP: Inventory Forecasting and Visualization

![](https://github.com/tylertaewook/hackupc-algohp/hackupc.gif)
![](hackupc.gif)

AlgoHP is a powerful tool for inventory forecasting and visualization based on the ARIMA (AutoRegressive Integrated Moving Average) model. It enables users to forecast the inventory levels of 100 different products over a span of 13 weeks. The tool also provides a user-friendly dashboard that presents the forecasts in an intuitive and visually appealing manner.

The project leverages the capabilities of the GPT to power a command bar that allows users to quickly summarize shipment information and requirements. This feature enhances the usability and convenience of the tool, making it easier for users to gather essential insights about their inventory.

# Features
- Inventory forecasting: AlgoHP utilizes the ARIMA model to forecast inventory levels for 100 different products over a 13-week period. The forecasts are based on historical data and provide valuable insights into future inventory trends.
- User-friendly dashboard: The tool offers a visually appealing and intuitive dashboard that presents the inventory forecasts in a clear and concise manner. Users can easily navigate through the dashboard and gain a comprehensive overview of their inventory situation.
- GPT-powered command bar: The integration of GPT enables users to interact with the tool through a command bar. By entering commands, users can quickly summarize shipment information and requirements, gaining immediate access to important insights without the need for manual calculations or data analysis.


# Running it Locally

## Frontend
```bash
cd frontend-dashboard
npm start
```

## Backend
```bash
cd backend-fastapi
uvicorn main:app --reload
```

Access the application by visiting http://localhost:8000 in your web browser.