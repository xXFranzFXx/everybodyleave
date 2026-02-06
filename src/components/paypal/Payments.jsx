import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const Payments = () =>  {
    const { user, getAccessTokenSilently } = useAuth0();
    
    const createOrder = async () => {
      const { mongoId, name, profileName } = user;

      const token = await getAccessTokenSilently();
      console.log('mongoId: ', mongoId);
      
      try {
        const response = await axios({
          method: 'POST',
        //  url: `http://localhost:4000/api/payments/createPayment`,
          url: `https://everybodyleave.onrender.com/api/payments/createPayment`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            id: `${process.env.REACT_APP_PRODUCT_ID}`,
            user: mongoId
          },
        });
        const order = await response.data;
        console.log("Created Paypal order: ", order.id);
        return order.id;
       
      } catch (err) {
        console.log('Error creating Paypal order: ', err);
      }
    };
 
 const onApprove = async (orderData) => {
      const { mongoId, name, profileName } = user;

      const token = await getAccessTokenSilently();
      console.log('mongoId: ', mongoId);
      
      try {
        const response = await axios({
          method: 'POST',
        //  url: `http://localhost:4000/api/payments/capturePayment`,
          url: `https://everybodyleave.onrender.com/api/payments/capturePayment`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            orderID: orderData.orderID
          },
        });
        const paymentOrder = await response.data;
        const name = paymentOrder.payer.name.given_name;
        console.log("Transaction successful: ", name);

        return paymentOrder;
       
      } catch (err) {
        console.log('Error completing Paypal order: ', err);
      }
    };
  
    return (
        <PayPalScriptProvider options={{ clientId: `${process.env.REACT_APP_PAYPAL_CLIENT_ID}` }}>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </PayPalScriptProvider>
    );
}

export default Payments