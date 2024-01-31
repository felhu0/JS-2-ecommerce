import { useContext, useEffect } from "react"
import { OrderContext } from "../contexts/orderContext"
// import './OrderHistory.css'

export const OrderHistory = () => {
  
  const { orders, fetchOrders } = useContext(OrderContext)

  useEffect(() => {
    fetchOrders(); // Anropa fetchOrders när komponenten laddas
  }, []);
  
  if(!orders || orders.lenght === 0) {
    return <div>No Orders found.</div>
  }
   

  return (
    <>
        
        <div className="order-history-container">
          <h1>ORDER HISTORY</h1>
          <table className="order-history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Total Price</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    <ul>
                      {order.products.map(item => (
                        <li key={item._id}>
                          {item.product.name} - Quantity: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

     
    </>
  )
}