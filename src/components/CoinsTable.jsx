import React from "react";
import { DataGrid, GridToolbar, Button } from "@mui/material";

const CoinsTable = ({ myCoins, setEditCoin }) => {
    const columns = [
        { field: "id", headerName: "#", width: 70 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "avgBuyAmount", headerName: "Avg Buy Amount", flex: 1 },
        { field: "quantity", headerName: "Quantity", flex: 1 },
        { field: "investedAmount", headerName: "Invested", flex: 1 },
        { field: "lastDate", headerName: "Date", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        {
          field: "edit",
          headerName: "Edit",
          width: 120,
          renderCell: (params) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditCoin(params.row)}
            >
              Edit
            </Button>
          ),
        },
      ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={myCoins.map((coin, index) => ({ id: index + 1, ...coin }))}
        columns={columns}
        pageSize={5}
        components={{
          Toolbar: GridToolbar,
        }}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  )
}

export default CoinsTable;
