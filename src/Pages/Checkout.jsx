import React, { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useAuth } from '../Context/useAuth';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api'; // Added import for api service

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ cart, user, clearCart, navigate }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: 'PK',
    paymentMethod: 'cod', orderNotes: '', saveInfo: false,
    billingName: '', billingAddress: '', billingCity: '', billingState: '', billingZipCode: '', billingCountry: 'PK', billingPhone: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [checkoutError, setCheckoutError] = useState('');
  const [cardError, setCardError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [cardReady, setCardReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.currentPrice * item.qty, 0) : 0;
  const shipping = total >= 600 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (formData.paymentMethod === 'card' && finalTotal > 0) {
      setClientSecret('');
      setCardReady(false);
      setCardError('');
      api.post('/payment/create-payment-intent', { amount: Math.round(finalTotal * 100) })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(() => setClientSecret(''));
    } else {
      setClientSecret('');
      setCardReady(false);
      setCardError('');
    }
  }, [formData.paymentMethod, finalTotal]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    return required.every(f => formData[f] && formData[f].trim() !== '');
  };
  const validateBilling = () => {
    if (billingSameAsShipping) return true;
    const required = ['billingName', 'billingAddress', 'billingCity', 'billingState', 'billingZipCode', 'billingCountry', 'billingPhone'];
    return required.every(f => formData[f] && formData[f].trim() !== '');
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateShipping()) {
      setCheckoutError('Please fill in all required shipping fields.');
      setTimeout(() => setCheckoutError(''), 2500);
      return;
    }
    if (currentStep === 2 && !validateBilling()) {
      setCheckoutError('Please fill in all required billing fields.');
      setTimeout(() => setCheckoutError(''), 2500);
      return;
    }
    if (currentStep === 3 && formData.paymentMethod === 'card' && !clientSecret) {
      setCheckoutError('Please wait for payment form to load.');
      setTimeout(() => setCheckoutError(''), 2500);
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handlePlaceOrder = async () => {
    setShowOrderConfirmation(false);
    setIsProcessing(true);
    setCheckoutError('');
    setCardError('');

    // Validate cart items
    const missingColorOrSize = cart.some(item =>
      (Array.isArray(item.colors) && item.colors.length > 0 && !item.color) ||
      (Array.isArray(item.sizes) && item.sizes.length > 0 && !item.size)
    );
    if (missingColorOrSize) {
      setCheckoutError('All items must have a color and size selected.');
      setIsProcessing(false);
      setTimeout(() => setCheckoutError(''), 2500);
      return;
    }

    const shippingAddress = {
      name: (formData.firstName + ' ' + formData.lastName).trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      country: formData.country.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    };
    let billingAddress;
    if (billingSameAsShipping) {
      billingAddress = { ...shippingAddress };
    } else {
      billingAddress = {
        name: formData.billingName.trim(),
        address: formData.billingAddress.trim(),
        city: formData.billingCity.trim(),
        state: formData.billingState.trim(),
        zipCode: formData.billingZipCode.trim(),
        country: formData.billingCountry.trim(),
        phone: formData.billingPhone.trim(),
        email: formData.email.trim(),
      };
      if (!billingAddress.name || !billingAddress.address || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode || !billingAddress.country || !billingAddress.phone) {
        setCheckoutError('Please fill in all required billing address fields.');
        setIsProcessing(false);
        return;
      }
    }
    const orderNumber = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country || !shippingAddress.phone || !orderNumber) {
      setCheckoutError('Please fill in all required shipping fields.');
      setIsProcessing(false);
      return;
    }
    const items = cart.filter(item => item.id).map(item => ({
      product: item.id,
      quantity: item.qty,
      size: item.size,
      color: item.color,
      price: item.currentPrice,
      name: item.name,
    }));

    let paymentInfo = { id: 'COD', status: 'pending', method: formData.paymentMethod };
    if (formData.paymentMethod === 'card') {
      if (!stripe || !elements || !clientSecret) {
        setCardError('Something went wrong with payment. Please try again or use another method.');
        setIsProcessing(false);
        return;
      }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setCardError('Payment form is not ready. Please try again.');
        setIsProcessing(false);
        return;
      }
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country: shippingAddress.country,
            },
          },
        },
      });
      if (error) {
        setCardError(error.message || 'Something went wrong with your card. Please try again.');
        setIsProcessing(false);
        return;
      }
      if (paymentIntent.status !== 'succeeded') {
        setCardError('Payment was not successful. Please try again or use another method.');
        setIsProcessing(false);
        return;
      }
      paymentInfo = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        method: 'card',
      };
    }

    const orderData = {
      orderNumber,
      items,
      shippingAddress,
      billingAddress,
      paymentInfo,
      orderNotes: formData.orderNotes,
      user: user ? user.id : undefined,
      email: user ? user.email : formData.email,
    };

    try {
      const response = await orderService.createOrder(orderData);
      setIsProcessing(false);
      clearCart();
      navigate('/OrderConfirmation', { state: { order: response.order || response } });
    } catch (err) {
      setCheckoutError(err?.response?.data?.message || 'Failed to place order.');
      setIsProcessing(false);
    }
  };

  // --- REDESIGN START ---
  // Replace the main return block with a modern, stepper-based, responsive checkout UI

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
          <button
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            onClick={() => navigate('/Shop')}
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  // Stepper component
  const steps = [
    { label: 'Shipping' },
    { label: 'Billing' },
    { label: 'Payment' },
    { label: 'Review' },
  ];

  const Stepper = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${currentStep - 1 >= idx ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-300'} font-bold transition`}>{idx + 1}</div>
          <span className={`mt-2 text-xs font-medium ${currentStep - 1 >= idx ? 'text-black' : 'text-gray-400'}`}>{step.label}</span>
          {idx < steps.length - 1 && <div className="w-full h-1 bg-gray-200 mt-2 mb-2" />}
        </div>
      ))}
    </div>
  );

  // Sidebar summary
  const OrderSummary = () => (
    <div className="bg-white rounded-lg shadow p-6 sticky top-8">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <ul className="divide-y divide-gray-200 mb-4">
        {cart.map(item => (
          <li key={item.id} className="py-2 flex items-center justify-between">
            <span className="text-sm">{item.name} x{item.qty}</span>
            <span className="text-sm font-medium">${(item.currentPrice * item.qty).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
      <div className="flex justify-between text-sm mb-1"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
      <div className="flex justify-between text-sm mb-1"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
      <div className="flex justify-between text-base font-bold mt-2"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
    </div>
  );

  // Main checkout form layout
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-lg shadow p-8">
          <Stepper />
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="firstName" placeholder="First Name*" value={formData.firstName} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="lastName" placeholder="Last Name*" value={formData.lastName} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full md:col-span-2" name="email" placeholder="Email*" value={formData.email} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full md:col-span-2" name="phone" placeholder="Phone*" value={formData.phone} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full md:col-span-2" name="address" placeholder="Address*" value={formData.address} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="city" placeholder="City*" value={formData.city} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="state" placeholder="State*" value={formData.state} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="zipCode" placeholder="Zip Code*" value={formData.zipCode} onChange={handleInputChange} required />
                <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="country" placeholder="Country*" value={formData.country} onChange={handleInputChange} required />
              </div>
              <div className="flex justify-between mt-6">
                <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}
          {/* Step 2: Billing */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
              <label className="flex items-center mb-4">
                <input type="checkbox" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(!billingSameAsShipping)} className="mr-2" />
                Billing address same as shipping
              </label>
              {!billingSameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="billingName" placeholder="Full Name*" value={formData.billingName} onChange={handleInputChange} required />
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full md:col-span-2" name="billingAddress" placeholder="Address*" value={formData.billingAddress} onChange={handleInputChange} required />
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="billingCity" placeholder="City*" value={formData.billingCity} onChange={handleInputChange} required />
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="billingState" placeholder="State*" value={formData.billingState} onChange={handleInputChange} required />
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="billingZipCode" placeholder="Zip Code*" value={formData.billingZipCode} onChange={handleInputChange} required />
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="billingCountry" placeholder="Country*" value={formData.billingCountry} onChange={handleInputChange} required />
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full md:col-span-2" name="billingPhone" placeholder="Phone*" value={formData.billingPhone} onChange={handleInputChange} required />
                </div>
              )}
              <div className="flex justify-between mt-6">
                <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleBack}>Back</button>
                <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}
          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="flex gap-6 mb-6">
                <label className="flex items-center">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="mr-2" />
                  Cash on Delivery
                </label>
                <label className="flex items-center">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="mr-2" />
                  Credit/Debit Card
                </label>
              </div>
              {formData.paymentMethod === 'card' && (
                <div className="mb-4">
                  <label className="block font-medium mb-1">Card Details</label>
                  {clientSecret ? (
                    <CardElement
                      className="p-3 border rounded bg-white"
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#222',
                            '::placeholder': { color: '#888' },
                            fontFamily: 'inherit',
                            backgroundColor: 'white',
                          },
                          invalid: {
                            color: '#e53e3e',
                          },
                        },
                      }}
                      onReady={() => setCardReady(true)}
                      onChange={e => {
                        setCardError(e.error ? e.error.message : '');
                        setCardReady(e.complete);
                      }}
                    />
                  ) : (
                    <div className="text-gray-500 text-sm">Loading payment form...</div>
                  )}
                  {cardError && <div className="text-red-500 text-sm mt-2">{cardError}</div>}
                </div>
              )}
              <div className="flex justify-between mt-6">
                <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleBack}>Back</button>
                <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={handlePlaceOrder} disabled={isProcessing || (formData.paymentMethod === 'card' && !cardReady)}>
                  {isProcessing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review & Place Order</h2>
              <div className="mb-4">
                <label className="block font-medium mb-1">Order Notes (optional)</label>
                <textarea className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition w-full" name="orderNotes" value={formData.orderNotes} onChange={handleInputChange} rows={2} placeholder="Any special instructions?" />
              </div>
              {checkoutError && <div className="text-red-500 text-sm mb-2">{checkoutError}</div>}
              <div className="flex justify-between mt-6">
                <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleBack}>Back</button>
                <button
                  className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing }
                >
                  {isProcessing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-1">
          <OrderSummary />
        </div>
      </div>
      {/* Order confirmation modal */}
      {showOrderConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>
            <p className="mb-6">Are you sure you want to place this order?</p>
            <div className="flex justify-center gap-6">
              <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => setShowOrderConfirmation(false)}>Cancel</button>
              <button className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Yes, Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
// --- REDESIGN END ---
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cart={cart} user={user} clearCart={clearCart} navigate={navigate} />
    </Elements>
  );
};

export default Checkout;
