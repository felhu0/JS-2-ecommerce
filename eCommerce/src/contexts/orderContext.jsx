import { createContext, useContext, useState } from "react";
import { AuthContext } from "./authContext";
import { ShopContext } from "./shopContext";




export const OrderContext = createContext()

export const useOrder = () => {
  
  const context = useContext(OrderContext)

  if(!context) throw new Error('useOrder must be inside an OrderContextProvider')

  return context 
}


const OrderContextProvider = ({ children }) => {

  const { token } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const { cart, clearCart } = useContext(ShopContext)

  const fetchOrders = async () => {
    
    if (!token) return ;

    try {
      const res = await fetch('https://js2-ecommerce-api.vercel.app/api/orders', {
         headers: {
          'Authorization': `Bearer ${token}`,
         },
      });
      if (res.status === 200) {
        const data = await res.json();
        setOrders(data)
        console.log('Orders fetched successfully');
      } else {
        throw new Error('Failed to fetch orders');
      }
     
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
 };



 const createOrder = async (orderData) => {
  
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Lägg till Authorization header endast om token finns
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch('https://js2-ecommerce-api.vercel.app/api/orders', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData),
    });

    const data = await res.json()

    if (res.status === 201) {
      setOrders(prevOrders => [...prevOrders, data.order])
      return { success: true, message: data.message, order: data.order};

    } else {
      throw new Error(data.message || 'Failed to create order');
    }

  } catch (error) {
    console.error('Error creating order:', error.message)
    
    return { success: false, error: error.message };
    
  }
 }

 const handleConfirmPurchase = async () => {

  if(cart.length === 0) {
    console.error('Your cart is empty')
    return; // Avsluta funktion om varukorgen är tom
  }

  try {
    const orderData = {
      products: cart.map(item => ({
          'productId': item.product._id,
          'quantity': item.quantity
      
      }))
    };

    const result = await createOrder(orderData);
    if (result && result.success) {
    
      clearCart();
      console.log(result.message);
    } else {
      console.error('Error in order creation:', result.error)
    }
  } catch (error) {
    console.error('Error in handleConfirmPurchase:', error);
    return { success: false, error: error.message || 'Your cart is empty' };
  }
  
};


 const value ={
  orders,
  fetchOrders,
  createOrder,
  handleConfirmPurchase,
}
  



  return (
    <OrderContext.Provider value={value}>
        { children }
    </OrderContext.Provider>
  )
}

export default OrderContextProvider