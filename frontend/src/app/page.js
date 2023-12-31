"use client";

import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import {
  Button,
  Container,
  Input,
  Table,
  TableHead,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CoinsTable from "../components/CoinsTable";
import "./style.css";

export default function Home() {
  const [binanceBalance, setBinanceBalance] = useState();
  const [kuBalance, setKuBalance] = useState();
  const [myCoins, setMyCoins] = useState();
  const [editCoin, setEditCoin] = useState();

  useEffect(() => {
    getCoins();
  }, []);

  useEffect(() => {
    let apiFetch = () => {
      axios.get("https://api.coincap.io/v2/assets").then((e) => {
        console.log("call", e);
      });
    };
    apiFetch();
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
        exchange: "binance",
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
    } else if (kuBalance && kuBalance.length > 0) {
      const date = new Date();

      let array = kuBalance.map((coin) => ({
        name: coin.currency,
        avgBuyAmount: 10 / coin.balance,
        quantity: coin.balance,
        investedAmount: 10, // Please adjust this value according to your logic
        lastDate: date,
        status: "active",
        exchange: "ku_coin",
      }));

      try {
        const url = "http://localhost:3100/addCoin";
        for (let i = 0; i < array.length; i++) {
          axios.post(url, array[i]);
        }
        setKuBalance();
        setTimeout(() => {
          getCoins();
        }, 1);
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
    setEditCoin({ ...editCoin, avgBuyAmount: avg, investedAmount: val });
  };

  return (
    <Container maxWidth={"xl"} className="">
      <Button className="bg-green" onClick={callBinance}>
        get binance
      </Button>
      <Button className="bg-green" onClick={callKu}>
        get Ku
      </Button>

      {binanceBalance && (
        <Table sx={{ maxWidth: "400px" }} className="">
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
        <Table sx={{ maxWidth: "400px" }} className="">
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
        <TableContainer>
          <Table className="">
            <TableHead>
              <TableRow
                className=""
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  position: "sticky",
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}># </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Avg Buy Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Invested</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myCoins.map((coin, index) => (
                // {background:'#f1ae13'} : {background:'#21af91'}
                <TableRow key={index} className="hover:bg-gray-500 p-4">
                  <TableCell className="px-4 py-2">{index + 1}</TableCell>
                  <TableCell className="name">
                    <img
                      className="coinImg"
                      src={`https://assets.coincap.io/assets/icons/${coin.name.toLowerCase()}%402x.png`}
                      alt={coin.name}
                    />{" "}
                    {coin.name}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {coin.avgBuyAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-2">{coin.quantity}</TableCell>
                  <TableCell className="px-4 py-2">
                    {coin.investedAmount}
                  </TableCell>
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
        </TableContainer>
      )}
      {editCoin && (
        <div
          style={{
            position: "fixed",
            zIndex: 3,
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              width: "80%",
              maxWidth: 600,
            }}
          >
            <CardContent>
              <Box sx={{display:'flex'}} className="name">
                <img
                  className="coinImg"
                  src={`https://assets.coincap.io/assets/icons/${editCoin.name.toLowerCase()}%402x.png`}
                  alt={editCoin.name}
                />
                <Typography variant="h5">{editCoin.name}</Typography>
              </Box>
              <TextField
                label="Avg"
                type="number"
                value={editCoin.avgBuyAmount}
                onChange={(e) =>
                  setEditCoin({ ...editCoin, avgBuyAmount: e.target.value })
                }
                disabled={false} // Assuming this field should be editable
                margin="normal"
                fullWidth
              />
              <TextField
                label="Quantity"
                type="number"
                value={editCoin.quantity}
                onChange={(e) =>
                  setEditCoin({ ...editCoin, quantity: e.target.value })
                }
                disabled
                margin="normal"
                fullWidth
              />
              <TextField
                label="Investment"
                type="number"
                value={editCoin.investedAmount}
                onChange={investFn}
                margin="normal"
                fullWidth
              />
              <TextField
                //label="Date"
                type="date"
                value={editCoin.date}
                onChange={(e) =>
                  setEditCoin({ ...editCoin, date: e.target.value })
                }
                margin="normal"
                fullWidth
              />
              <Select
                label="Status"
                value={editCoin.status}
                onChange={(e) =>
                  setEditCoin({ ...editCoin, investedAmount: e.target.value })
                } // Should this update investedAmount or status?
                margin="normal"
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="closing">Closing</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
              </Select>
              <div style={{ marginBottom: "1.5em" }}></div>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  sx={{ marginRight: "1em" }}
                  variant="contained"
                  onClick={editCoinFn}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditCoin("")}>
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>
      )}

      <Button className="bg-green-600" onClick={getCoins}>
        All coins
      </Button>
    </Container>
  );
}
