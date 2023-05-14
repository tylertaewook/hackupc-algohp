import numpy as np
import pandas as pd
import torch
import scipy
from matplotlib import pyplot as plt
import datetime
from sqlalchemy.sql.elements import True_
from statsmodels.tsa.stattools import adfuller
from statsmodels.graphics.tsaplots import plot_acf
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.graphics.tsaplots import plot_predict
import os
from openpyxl.workbook import Workbook
import math

def main():
        cwd = os.getcwd()
        train_path = os.path.join(cwd,"train.csv")
        train_df = pd.read_csv(train_path)

        train_df = train_df.dropna()

        train_df = train_df.drop_duplicates(['id', 'year_week', 'product_number'])

        prod_cat_li = train_df.prod_category.unique()
        prod_cat_class_li = []
        for prod_cat in prod_cat_li:
                prod_cat_class_li.append(product_cat(prod_cat))
        
        re_prod_num, pred_result_arr = prod_cat_class_li[0].compute_prediction(train_df)
        
        for prod_cat_class in prod_cat_class_li[1:]:
                tmp_prod_num, tmp_pred_result_arr = prod_cat_class.compute_prediction(train_df)
                re_prod_num = np.hstack((re_prod_num, tmp_prod_num))
                pred_result_arr = np.hstack((pred_result_arr,tmp_pred_result_arr))
        date_li = range(202319,202332)
        id_li = ["0"]*(len(date_li)*len(re_prod_num))
        
        i = 0
        for date in date_li:
                for prod_num in re_prod_num:
                        id_li[i] = f"{date}-{prod_num}"
                        i += 1
        zipped = zip(id_li,pred_result_arr.flatten())
        sub_df = pd.DataFrame(zipped, columns = ['id','inventory_units'])
        #print(sub_df)
        write_path = os.path.join(cwd, 'Algo_UPC_HP_challenge.xlsx')
        with pd.ExcelWriter(write_path) as writer:
                sub_df.to_excel(writer, sheet_name='Sheet1', index=False)
        return sub_df

        #prod_cat1.compute_prediction(train_df)

class product_cat():
        def __init__(self, prod_cat_name) -> None:
                self.prod_cat = prod_cat_name

        def compute_prediction(self, train_df):
                df = train_df.groupby('prod_category')
                gd = df.get_group(self.prod_cat).groupby('date')['inventory_units'].sum(numeric_only = True)
                df = train_df[train_df['prod_category'] == self.prod_cat]
                prod_num_li = df.product_number.unique()
                ratio_df = df[['date', 'product_number', 'sales_units']]
                ratio_df = ratio_df.groupby(['date', 'product_number']).sum()
                ratio_df = ratio_df.unstack().fillna(0)
                re_prod_num = ratio_df.columns.get_level_values(1)
                sales_sum_arr = ratio_df["sales_units"].sum(axis = 1)
                ratio_df = ratio_df['sales_units'].div(sales_sum_arr, axis = 'rows')
                ratio_arr = np.zeros((len(ratio_df),len(prod_num_li)))
                
                prod_cat_d = self.find_d(gd.values)
                ratio_d_arr = np.zeros(ratio_arr.shape[1])
                for j in range(ratio_arr.shape[1]):
                        ratio_arr[:,j] = ratio_df[prod_num_li[j]].values
                        ratio_d_arr[j] = self.find_d(ratio_arr[:,j])
                order_tup = self.opt_orders(gd.values, 10, prod_cat_d)
                #print(order_tup)
                prod_cat_arima = ARIMA(pd.DataFrame(gd.values), order=order_tup)
                prod_cat_model = prod_cat_arima.fit()
                ratio_models_li = []
                for j in range(ratio_arr.shape[1]):
                        #order_tup = self.opt_orders(ratio_arr[:,j], 15, ratio_d_arr[j])
                        #ratio_models_li.append(ARIMA(pd.DataFrame(ratio_arr[:,j]), order=order_tup).fit())
                        ratio_models_li.append(ARIMA(pd.DataFrame(ratio_arr[:,j]), order=(1,ratio_d_arr[j],1)).fit())
                #print(prod_cat_d, ratio_d_arr)

                plot_predict(prod_cat_model)
                plt.plot(pd.DataFrame(gd.values),label = "real data")
                plt.plot(np.multiply(ratio_arr,gd.values.reshape(gd.values.size,1)))
                for_num = 13
                y_pred = prod_cat_model.forecast(for_num)#model.predict(start = start_d, end=end_d)#
                plt.plot(y_pred, label = f"model of {self.prod_cat}")
                pred_result_arr = np.zeros((for_num,ratio_arr.shape[1]))
                for j in range(ratio_arr.shape[1]):
                        pred_result_arr[:,j] = y_pred*ratio_models_li[j].forecast(for_num)
                        pred_result_arr[pred_result_arr < 0] = 0
                        plt.plot(y_pred*ratio_models_li[j].forecast(for_num), label = str(prod_num_li[j]))
                #plt.legend()
                plt.plot(range(ratio_arr.shape[0], ratio_arr.shape[0]+13), np.sum(pred_result_arr, axis = 1))
                plt.show()

                
                return re_prod_num, pred_result_arr

        def find_d(self, data_arr):
                d_val = -1
                p = 1
                while p > 0.05:
                        d_val += 1
                        tmp = pd.DataFrame(data_arr)
                        for i in range(d_val):
                                tmp = tmp.diff()
                        tmp = tmp.dropna()
                        p = adfuller(tmp)[1]
                return d_val
        
        def opt_orders(self, true_val, day_limit, d):
                test_val_li = range(day_limit+1)
                errors = {}
                for p in test_val_li:
                        for q in test_val_li:
                                fitted_val = ARIMA(pd.DataFrame(true_val), order=(p,d,q)).fit().fittedvalues
                                errors[(p,q)] = self.cost(fitted_val, true_val)
                #print(errors)
                min_key = min(errors, key=lambda k: errors[k])
                return (min_key[0], d, min_key[1])
        def cost(self, num_arr1, num_arr2):
                return math.sqrt(np.sum((num_arr1-num_arr2)**2))

if __name__ == "__main__":
        main()