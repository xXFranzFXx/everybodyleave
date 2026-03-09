import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Payments = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const initialOptions = {
        "client-id": `${process.env.REACT_APP_PAYPAL_CLIENT_ID}`,
        "enable-funding": "venmo",
        "disable-funding": "",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };
  const [message, setMessage] = useState("");
  const createOrder = async () => {
    const { mongoId, name, profileName } = user;

    const token = await getAccessTokenSilently();
    console.log('mongoId: ', mongoId);

    try {
      const response = await axios({
        method: 'POST',
        url: `http://localhost:4000/api/payments/createOrder`,
        // url: `https://everybodyleave.onrender.com/api/payments/createPayment`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          cart: [
            {
              id: '1m',
              user: mongoId,
            },
          ],
        },
      });
      const orderData = await response.data;
      if (!orderData.id) {
                const errorDetail = orderData.details[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
	                    : "Unexpected error occurred, please try again.";
	
                throw new Error(errorMessage);
            }

            return orderData.id;
      console.log('Created Paypal order: ', orderData.id);
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
        url: `http://localhost:4000/api/payments/captureOrder`,
        // url: `https://everybodyleave.onrender.com/api/payments/capturePayment`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          orderID: orderData.order.id,
        },
      });
      const paymentOrder = await response.data;
      const name = paymentOrder.payer.name.given_name;
      console.log('Transaction successful: ', name);

      return paymentOrder;
    } catch (err) {
      console.log('Error completing Paypal order: ', err);
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
};

export default Payments;
