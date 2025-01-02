import React, { useState } from "react";

const PaymentGateway = ({ totalAmount, onPaymentSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onPaymentSuccess(paymentMethod);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        <div className="mb-4">
          <p className="text-lg font-semibold">
            Total Amount: ${totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Payment Method</label>
          <select
            className="w-full p-2 border rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          <button
            onClick={onCancel}
            disabled={processing}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
