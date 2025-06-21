const express = require('express');
const router = express.Router();
const Iyzipay = require('iyzipay');
const db = require('../../db/index');

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL
});

router.post('/checkout', async (req, res) => {
    console.log('Checkout request received:', req.body);
    const { order_id, user_id, amount, card_details, billing_address, cardRegion } = req.body;

    // Validate input
    if (!order_id || !user_id || !amount || !card_details || !billing_address || !cardRegion) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate cardRegion
    if (!['turkish', 'non-turkish'].includes(cardRegion)) {
        console.error('Invalid cardRegion:', cardRegion);
        return res.status(400).json({ error: 'Invalid card region' });
    }

    // Validate critical fields
    if (!billing_address.email.includes('@') || !billing_address.zip_code.match(/^[0-9]{5}$/)) {
        console.error('Invalid email or ZIP code:', billing_address.email, billing_address.zip_code);
        return res.status(400).json({ error: 'Invalid email or ZIP code' });
    }

    const request = {
        locale: cardRegion === 'turkish' ? 'tr' : 'en',
        conversationId: `order-${order_id}`,
        price: amount.toFixed(2),
        paidPrice: amount.toFixed(2),
        currency: 'TRY',
        basketId: `B${order_id}`,
        paymentGroup: 'PRODUCT',
        callbackUrl: 'http://localhost:5000/api/payments/callback',
        enabledInstallments: [1, 2, 3, 6, 9],
        buyer: {
            id: user_id.toString(),
            name: billing_address.full_name.split(' ')[0] || 'John',
            surname: billing_address.full_name.split(' ').slice(1).join(' ') || 'Doe',
            email: billing_address.email,
            identityNumber: cardRegion === 'turkish' ? 'mob' : '00000000000',
            registrationAddress: billing_address.street + (billing_address.apartment ? `, ${billing_address.apartment}` : ''),
            city: billing_address.city,
            country: billing_address.country || 'Turkey',
            zipCode: billing_address.zip_code
        },
        shippingAddress: {
            contactName: billing_address.full_name,
            city: billing_address.city,
            country: billing_address.country || 'Turkey',
            address: billing_address.street + (billing_address.apartment ? `, ${billing_address.apartment}` : ''),
            zipCode: billing_address.zip_code
        },
        billingAddress: {
            contactName: billing_address.full_name,
            city: billing_address.city,
            country: billing_address.country || 'Turkey',
            address: billing_address.street + (billing_address.apartment ? `, ${billing_address.apartment}` : ''),
            zipCode: billing_address.zip_code
        },
        basketItems: [
            {
                id: 'BI101',
                name: 'Order Items',
                category1: 'General',
                itemType: 'PHYSICAL',
                price: amount.toFixed(2)
            }
        ],
        paymentCard: {
            cardHolderName: card_details.name,
            cardNumber: card_details.cardNum,
            expireMonth: card_details.expDate.split('-')[1].padStart(2, '0'),
            expireYear: card_details.expDate.split('-')[0],
            cvc: card_details.cvv
        }
    };

    try {
        iyzipay.payment.create(request, async (err, result) => {
            if (err) {
                console.error('Iyzico payment error:', err);
                return res.status(500).json({ error: 'Payment failed', details: err.message || err });
            }
            console.log('Iyzico response:', result);
            if (result.status === 'success') {
                try {
                    await db.query(
                        'UPDATE orders SET payment_id = $1, status = $2 WHERE id = $3',
                        [result.paymentId, 'paid', order_id]
                    );
                    res.json({ status: 'success', paymentId: result.paymentId });
                } catch (dbError) {
                    console.error('Database update error:', dbError);
                    res.status(500).json({ error: 'Failed to update order' });
                }
            } else {
                console.error('Payment not approved:', result);
                res.status(400).json({ error: 'Payment not approved', details: result });
            }
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Payment processing error', details: error.message });
    }
});

router.post('/callback', (req, res) => {
    console.log('Callback received:', req.body);
    res.status(200).send('Callback received');
});

module.exports = router;