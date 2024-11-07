/* eslint-disable react/react-in-jsx-scope */
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Datatable = ({ columns, hotelId }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Log the API URL for debugging
        console.log("Fetching data from:", `${process.env.REACT_APP_API}/${path}`);
        
        const res = await axios.get(`${process.env.REACT_APP_API}/${path}`);
        setList(res.data);
        console.log("Data: ",res.data);
        
      } catch (err) {
        // Log the error details
        console.error("Error fetching data:", err.response ? err.response.data : err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [path]);

  const handleDelete = async (id) => {
    try {
      const url =
        path === "rooms"
          ? `${process.env.REACT_APP_API}/${path}/{id}/{hotelId}`
          : `${process.env.REACT_APP_API}/${path}/{id}`;
      await axios.delete(url);

      // Update the state to remove the deleted item
      setList(list.filter((item) => item._id !== id));
      alert("Delete successful");
    } catch (err) {
      console.error("Error deleting item:", err.response ? err.response.data : err.message);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to="/users/test" style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        All {path}
        <Link to={`/${path}/new`} className="link">
          Add New User
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
