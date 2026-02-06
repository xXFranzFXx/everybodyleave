const { 
  Client, 
  Environment, 
  OrdersController 
}  = require("@paypal/paypal-server-sdk");



const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  environment: Environment.Sandbox, // or Environment.Production
});

const ordersController = new OrdersController(client);

exports.createOrder = async (req, res) => {
   
  try {
    const { body } = await ordersController.ordersCreate({
      body: {
        intent: "CAPTURE",
        purchaseUnits: [{
          amount: {
            currencyCode: "USD",
            value: "100.00",
          },
        }],
      },
    });
    res.json(JSON.parse(body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 }

 exports.captureOrder = async (req, res) => {
    try {
    const { orderId } = req.params;
    const { body } = await ordersController.ordersCapture({
      id: orderId,
    });
    res.json(JSON.parse(body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 }