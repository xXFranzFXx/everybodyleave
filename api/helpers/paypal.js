const { ordersController } = require ('../config/paypalConfig');
const { ApiError } = require('@paypal/paypal-server-sdk');

async function createOrder (cart) {
   const collect = {
        body: {
            intent: "CAPTURE",
            purchaseUnits: [
                {
                   amount: {
                        currencyCode: "USD",
                        value: "7",
                        breakdown: {
                           itemTotal: {
                                currencyCode: "USD",
                                value: "7",
                            },
                        },
                    },
                    // lookup item details in `cart` from database
                    items: [
                        {
                            name: "EbL Upgrade",
                            unitAmount: {
                                currencyCode: "USD",
                                value: "6",
                            },
                            quantity: "1",
                            description: "EbL one month upgrade",
                            sku: "sku01",
                        },
                    ],
                },
            ],
        },
        prefer: "return=minimal",
    };
   

    try {
        const { body, ...httpResponse } = await ordersController.createOrder(
            collect
        );
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return {
            jsonResponse: JSON.parse(body),
            httpStatusCode: httpResponse.statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            // const { statusCode, headers } = error;
            throw new Error(error.message);
        }
    }
};

const captureOrder = async (orderID) => {
    const collect = {
        id: orderID,
        prefer: "return=minimal",
    };

    try {
        const { body, ...httpResponse } = await ordersController.captureOrder(
            collect
        );
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return {
            jsonResponse: JSON.parse(body),
            httpStatusCode: httpResponse.statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            // const { statusCode, headers } = error;
            throw new Error(error.message);
        }
    }
};

module.exports = { createOrder, captureOrder };