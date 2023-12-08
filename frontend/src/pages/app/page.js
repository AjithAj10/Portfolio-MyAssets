"use client";

import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";

export default function Home() {
  const [binanceBalance, setBinanceBalance] = useState();
  const [myCoins, setMyCoins] = useState();
  const [editCoin, setEditCoin] = useState();

  useEffect(() => {
    getCoins();
  }, []);
  const callBinance = async () => {
    try {
      const result = await axios.get("http://localhost:3000/binance/assets");
      setBinanceBalance(result.data);
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
      }));

      try {
        const url = "http://localhost:3000/addCoin";
        for (let i = 0; i < array.length; i++) {
          axios.post(url, array[i]);
        }
        setBinanceBalance();
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Call the api first");
    }
  };

  const getCoins = async () => {
    try {
      const url = "http://localhost:3000/viewCoins";

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
    const val = await axios.post("http://localhost:3000/edit/coin", {
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
    <main className="flex min-h-screen flex-col items-center  p-24">
      <button className="bg-green" onClick={callBinance}>
        get binance
      </button>

      {binanceBalance && (
        <table className="table-auto  border-collapse">
          <thead>
            <tr className="bg-green-600">
              <th className="px-4 py-2">Coin</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Invested</th>
            </tr>
          </thead>
          <tbody>
            {binanceBalance.map((coin) => (
              <tr className="border-b">
                <td className="px-4 py-2">{coin.coin}</td>
                <td className="px-4 py-2">{coin.free}</td>
                <td className="px-4 py-2">10</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="bg-green-600" onClick={addCoins}>
        Add to Db
      </button>
      {myCoins && (
       <table className="p-4 border-collapse border border-gray-200">
          <thead>
          <tr className="bg-gray-500 p-4" >
              <th className="px-4 py-2">Coin </th>
              <th className="px-4 py-2">avgBuyAmount</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Invested</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {myCoins.map((coin) => (
              <tr className="hover:bg-gray-500 p-4">
                <td className="px-4 py-2">{coin.name}</td>
                <td className="px-4 py-2">{coin.avgBuyAmount.toFixed(2)}</td>
                <td className="px-4 py-2">{coin.quantity}</td>
                <td className="px-4 py-2">{coin.investedAmount}</td>
                <td className="px-4 py-2">{coin.lastDate}</td>
                <td className="px-4 py-2">{coin.status}</td>
                <td>
                  <button
                    className="bg-orange-600 px-3 py-1 m-2"
                    onClick={() => setEditCoin(coin)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <button
            onClick={editCoinFn}
            className="border mt-4 border-green-400 text-green-400 hover:text-white hover:bg-blue-500 font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setEditCoin("")}
            className="border ml-4 mt-4 border-red-400 text-red-400 hover:text-white hover:bg-red-500 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button> 
        </div>
      )}

      <button className="bg-green-600" onClick={getCoins}>
        All coins
      </button>
    </main>
  );
}
