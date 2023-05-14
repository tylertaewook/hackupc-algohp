import axios from "axios";
import Card from "components/card";
import Dropdown from "components/dropdown";
import React, { PureComponent, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Brush,
  ResponsiveContainer,
} from "recharts";

import { Select, Space } from "antd";

const categData = [
  "Arale",
  "Goku",
  "Doraemon",
  "Conan",
  "Clover",
  "Luffy",
  "Bobobo",
];

const prodData = {
  "Arale": [
    "6909", "17766", "25662", "58233", "65142", "81921", "93765", "138180", "143115", "201348",
    "213192", "214179", "230958", "231945", "247737",
  ],
  "Goku": [
    "7896", "8883", "14805", "51324", "57246", "86856", "87843", "92778", "105609", "109557",
    "119427", "158907", "167790", "171738", "172725", "175686", "177660", "234906", "236880",
    "237867", "238854", "239841",
  ],
  "Doraemon": [
    "9870", "10857", "11844", "12831", "127323", "129297", "130284", "157920", "190491", "191478",
    "192465", "204309", "211218", "221088", "222075",
  ],
  "Conan": [
    "24675", "45402", "46389", "48363", "80934", "112518", "240828", "242802",
  ],
  "Clover": [
    "30597", "32571", "43428", "59220", "62181", "64155", "73038", "75012", "77973", "83895", "89817",
    "94752", "99687", "107583", "114492", "116466", "148050", "155946", "169764", "182595",
    "183582", "184569", "195426", "196413", "197400", "226023", "233919", "235893",
  ],
  "Luffy": [
    "33558", "37506", "41454", "82908", "91791", "163842", "219114", "220101",
  ],
  "Bobobo": [
    "165816", "187530", "193452", "205296",
  ]
};

const Selector = ({
  category,
  product,
  setCategory,
  setProduct,
}: {
  category: "Arale" | "Goku" | "Doraemon" | "Conan" | "Clover" | "Luffy" | "Bobobo"
  product: string
  setCategory: React.Dispatch<React.SetStateAction<"Arale" | "Goku" | "Doraemon" | "Conan" | "Clover" | "Luffy" | "Bobobo">>;
  setProduct: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleCategoryChange = (value: "Arale" | "Goku" | "Doraemon" | "Conan" | "Clover" | "Luffy" | "Bobobo") => {
    setCategory(value);
    setProduct(prodData[value][0]);
  };

  const onProductChange = (value: string) => {
    setProduct(value);
  };

  return (
    <Space wrap>
      Select Product:
      <Select
        defaultValue={"Arale"}
        style={{ width: 120 }}
        onChange={handleCategoryChange}
        options={categData.map((categ) => ({
          label: categ,
          value: categ,
        }))}
      />
      <Select
        style={{ width: 120 }}
        value={product}
        onChange={onProductChange}
        options={prodData[category].map((product: any) => ({ label: product, value: product }))}
      />
    </Space>
  );
};

const MainChart = () => {
  const [data, setData] = useState<any>(false);
  const [predData, setPredData] = useState<any>(false);
  const [category, setCategory] = useState<"Arale" | "Goku" | "Doraemon" | "Conan" | "Clover" | "Luffy" | "Bobobo">("Arale");
  const [product, setProduct] = useState("6909");
  useEffect(() => {
    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/product/" + String(product),
    }).then((res) => {
      setData(res.data);
    });

    axios({
      method: "GET",
      url: "http://127.0.0.1:8000/predict/" + String(product),
    }).then((res2) => {
      setPredData(res2.data);
      console.log(predData)
    });
  }, [product]);

  return (
    <div>
      {data && (
        <Card extra="!p-[20px] text-center">
          <Selector
            category={category}
            product={product}
            setCategory={setCategory}
            setProduct={setProduct}
          />
          <p>Past Data</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={200}
              data={data}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ReferenceLine x={"2023-03"} label="cutoff" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00adb5"
                fill="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>

          <p>Predictions ~ up to 13 weeks</p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={200}
              data={predData}
              // syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Brush />
            </LineChart> 
          </ResponsiveContainer>

          {/* <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              width={500}
              height={200}
              data={data}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="pv"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer> */}
        </Card>
      )}
    </div>
  );
};

export default MainChart;
