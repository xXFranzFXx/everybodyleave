const { createOrder, captureOrder } = require('../helpers/paypal');


      
exports.createPaypalOrder = async (req, res) => {
  try {
    console.log("req.body: ", req.body)
        // use the cart information passed from the front-end to calculate the order amount detals
        const { cart } = await req.body;
        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
       console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
};

 exports.capturePaypalOrder = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
 }