import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Orders.css";

function OrdersPage() {
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    fetch("http://localhost:8000/api/orders/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const apiEndpoint = "http://localhost:8000/api/orders/";

    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        color: color,
        quantity: quantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.error);
        } else {
          setOrders((prevOrders) => [...prevOrders, data]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleUpdate = async (event, order) => {
    event.preventDefault();
    const response = await fetch(
      `http://localhost:8000/api/orders/${order.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          quantity: updatedQuantity,
          company: order.company,
          user: order.user,
          paint: order.paint,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.error) {
      alert(data.error);
    } else {
      setOrders(orders.map((o) => (o.id === order.id ? data : o)));
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Create Order</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        >
          <option value="">Select color</option>
          <option value="Blue">Blue</option>
          <option value="Grey">Grey</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Purple">Purple</option>
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Create Order</button>
      </form>
      <div>
        <h1>Orders</h1>
        {orders.map((order) => (
          <div className="order-card">
            <div key={order.id}>
              <h2>Order {order.id}</h2>
              <p>User: {order.user}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Paint: {order.paint}</p>
              <p>Company: {order.company}</p>
              {(!selectedOrder || selectedOrder.id !== order.id) && (
                <button onClick={() => setSelectedOrder(order)}>
                  Edit Order
                </button>
              )}
              {selectedOrder && selectedOrder.id === order.id && (
                <form key={order.id} onSubmit={(e) => handleUpdate(e, order)}>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={updatedQuantity}
                    onChange={(e) => setUpdatedQuantity(e.target.value)}
                    required
                  />
                  <button type="submit" className="update-order">
                    Update Order
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
