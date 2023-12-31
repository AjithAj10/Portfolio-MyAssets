"use client";

import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import { Button, Table, TableHead } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export default function Home() {
  const [binanceBalance, setBinanceBalance] = useState();
  const [kuBalance, setKuBalance] = useState();
  const [myCoins, setMyCoins] = useState();
  const [editCoin, setEditCoin] = useState();

  useEffect(() => {
    getCoins();
  }, []);
  const callBinance = async () => {
    try {
      const result = await axios.get("http://localhost:3100/binance/assets");
      setBinanceBalance(result.data);
    } catch (e) {
      console.log(e);
    }
  };
  const callKu = async () => {
    try {
      const result = await axios.get("http://localhost:3100/ku/assets");
      setKuBalance(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const addCoins = async () => {
    if (binanceBalance && binanceBalance.length > 0) {
      const date = new Date();

      let array = binanceBalance.map((coin) => ({
        name: coin.coin,
        avgBuyAmount: 10 / coin.free,
        quantity: coin.free,
        investedAmount: 10, // Please adjust this value according to your logic
        lastDate: date,
        status: "active",
        exchange: "binance"
      }));

      try {
        const url = "http://localhost:3100/addCoin";
        for (let i = 0; i < array.length; i++) {
          axios.post(url, array[i]);
        }
        setBinanceBalance();
      } catch (e) { 
        console.log(e);
      }
    }else if(kuBalance && kuBalance.length > 0) {
        const date = new Date();

        let array = kuBalance.map((coin) => ({
          name: coin.currency,
          avgBuyAmount: 10 / coin.balance,
          quantity: coin.balance,
          investedAmount: 10, // Please adjust this value according to your logic
          lastDate: date,
          status: "active",
          exchange: "ku_coin"
        }));

        try {
            const url = "http://localhost:3100/addCoin";
            for (let i = 0; i < array.length; i++) {
              axios.post(url, array[i]);
            }
            setKuBalance();
            setTimeout(() => {
                getCoins();
            },1)
          } catch (e) { 
            console.log(e);
          }


    } else {
      alert("Call the api first");
    }
  };

  const getCoins = async () => {
    try {
      const url = "http://localhost:3100/viewCoins";

      let data = await axios.get(url);
      setMyCoins(data.data);

      // const dateObject = new Date(data.data.lastDate);
      // let date = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`
      // setEditCoin({editCoin,lastDate: date})
      // console.log(date);
    } catch (e) {
      console.log(e);
    }
  };

  const editCoinFn = async () => {
    const val = await axios.post("http://localhost:3100/edit/coin", {
      ...editCoin,
    });
    if (val.status >= 200 && val.status < 300) {
      alert("Updated");
    }
    setEditCoin("");
    getCoins();
  };

  const investFn = (e) => {
    const val = e.target.value;
    let avg = (val / editCoin.quantity).toFixed(2);
    setEditCoin({...editCoin, avgBuyAmount: avg, investedAmount: val});
  }

  return (
    <main className="">
      <Button className="bg-green" onClick={callBinance}>
        get binance
      </Button>
      <Button className="bg-green" onClick={callKu}>
        get Ku
      </Button>

      {binanceBalance && (
        <Table sx={{maxWidth: '400px'}} className="">
          <TableHead>
            <TableRow className="bg-green-600">
              <TableCell className="px-4 py-2">Coin</TableCell>
              <TableCell className="px-4 py-2">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {binanceBalance.map((coin) => (
              <TableRow className="border-b">
                <TableCell className="px-4 py-2">{coin.coin}</TableCell>
                <TableCell className="px-4 py-2">{coin.free}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {kuBalance && (
        <Table sx={{maxWidth: '400px'}} className="">
          <TableHead>
            <TableRow className="bg-green-600">
              <TableCell className="px-4 py-2">Coin</TableCell>
              <TableCell className="px-4 py-2">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kuBalance.map((coin) => (
              <TableRow className="border-b">
                <TableCell className="px-4 py-2">{coin.currency}</TableCell>
                <TableCell className="px-4 py-2">{coin.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button className="bg-green-600" onClick={addCoins}>
        Add to Db
      </Button>
      {myCoins && (
       <Table className="p-4 border-collapse border border-gray-200">
          <TableHead>
          <TableRow className="bg-gray-500 p-4"  >
              <TableCell className="px-4 py-2"># </TableCell>
              <TableCell className="px-4 py-2">Name </TableCell>
              <TableCell className="px-4 py-2">Avg Buy Amount</TableCell>
              <TableCell className="px-4 py-2">Quantity</TableCell>
              <TableCell className="px-4 py-2">Invested</TableCell>
              <TableCell className="px-4 py-2">Date</TableCell>
              <TableCell className="px-4 py-2">Status</TableCell>
              <TableCell className="px-4 py-2">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myCoins.map((coin,index) => (
              <TableRow className="hover:bg-gray-500 p-4" sx={coin.exchange === "binance" ? {background:'#f1ae13'} : {background:'#21af91'}  }>
                <TableCell className="px-4 py-2">{index+1}</TableCell>
                <TableCell className="px-4 py-2">{coin.name}</TableCell>
                <TableCell className="px-4 py-2">{coin.avgBuyAmount.toFixed(2)}</TableCell>
                <TableCell className="px-4 py-2">{coin.quantity}</TableCell>
                <TableCell className="px-4 py-2">{coin.investedAmount}</TableCell>
                <TableCell className="px-4 py-2">{coin.lastDate}</TableCell>
                <TableCell className="px-4 py-2">{coin.status}</TableCell>
                <TableCell>
                  <Button
                    className="bg-orange-600 px-3 py-1 m-2"
                    onClick={() => setEditCoin(coin)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {editCoin && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-10 border border-gray-300 shadow-md z-50">
          <h2 className="text-blue-600 font-bold">{editCoin.name}</h2>{" "}
          <label className="block mt-4">Avg</label>
          <input
            type="number"
            value={editCoin.avgBuyAmount}
            onChange={(e) =>
              setEditCoin({ ...editCoin, avgBuyAmount: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <label className="block mt-4">Quantity</label>
          <input
            type="number"
            value={editCoin.quantity}
            disabled={true}
            onChange={(e) =>
              setEditCoin({ ...editCoin, quantity: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <label className="block mt-4">Investment</label>
          <input
            type="number"
            value={editCoin.investedAmount}
            onChange={investFn }
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <label className="block mt-4">Date</label>
          <input
            type="date"
            value={editCoin.date}
            onChange={(e) => setEditCoin({ ...editCoin, date: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <label className="block mt-4">Status</label>
          <select
            value={editCoin.status}
            onChange={(e) =>
              setEditCoin({ ...editCoin, investedAmount: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="in-progress">in-progress</option>
            <option value="closed">closing</option>
            <option value="sold">sold</option>
          </select>
          <Button
            onClick={editCoinFn}
            className="border mt-4 border-green-400 text-green-400 hover:text-white hover:bg-blue-500 font-bold py-2 px-4 rounded"
          >
            Save
          </Button>
          <Button
            onClick={() => setEditCoin("")}
            className="border ml-4 mt-4 border-red-400 text-red-400 hover:text-white hover:bg-red-500 font-bold py-2 px-4 rounded"
          >
            Cancel
          </Button> 
        </div>
      )}

      <Button className="bg-green-600" onClick={getCoins}>
        All coins
      </Button>
    </main>
  );
}