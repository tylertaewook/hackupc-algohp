import PieChartCard from "views/admin/default/components/PieChartCard";
import Card from "components/card";
import CheckTable from "views/admin/default/components/CheckTable";

import DailyTraffic from "views/admin/default/components/DailyTraffic";
import MainChart from "./components/MainChart";
import axios from "axios";
import { useEffect, useState } from "react";
import { ResponsiveContainer } from "recharts";
import { Space, Select, Button } from "antd";
import { sellerData, weekData } from "./variables/predictionData";

const Dashboard = () => {
  const [tableData, setTableData] = useState([])
  const [seller, setSeller] = useState(sellerData[0])
  const [week, setWeek] = useState(weekData[0])

  useEffect(() => {
    try {
      axios({
      method: "GET",
      url: "http://127.0.0.1:8000/seller/" + seller + "/" + week
    }).then((res) => {
      setTableData(res.data);
      // console.log(res.data)
    });
    } catch (error) {
      console.log("error happened")
    }
    
  }, [seller, week]);

  function onSellerChange(value: number): void {
    setSeller(value)
  }
  function onWeekChange(value: number): void {
    setWeek(value)
  }

  function handleSellerClick() {
    const res = "seller: " + seller + " week: " + week
    alert(res)
  }

  return (
    <div>
      <div className="my-5">
        <MainChart />
      </div>

      <Card>
        <ResponsiveContainer width="100%" height={100}>
          <div>
            <h1 className="mx-5 mt-3 text-3xl font-bold">Upcoming Inventory Management</h1>
            <Space wrap className="m-5 mt-2">
              Seller:
              <Select
                defaultValue={seller}
                style={{ width: 120 }}
                onChange={onSellerChange}
                options={sellerData.map((seller) => ({
                  label: seller,
                  value: seller,
                }))}
                />
              Week:
              <Select
                style={{ width: 120 }}
                value={week}
                onChange={onWeekChange}
                options={weekData.map((week: any) => ({ label: week, value: week }))}
              />
              <Button onClick={handleSellerClick} type="primary" className="bg-blueSecondary text-white">Submit</Button>

            </Space>
          </div>
        </ResponsiveContainer>
      </Card>

      {tableData.length > 0 && <div className="mt-5 grid grid-cols-1 gap-5">
        <div>
          <CheckTable tableData={tableData} />
        </div>

        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div> */}
      </div>}
    </div>
  );
};

export default Dashboard;
