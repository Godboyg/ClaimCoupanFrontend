import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [coupon, setCoupon] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkClaimStatus();
  }, []);

  const checkClaimStatus = async () => {
    try {
      const response = await axios.get("api/coupons/status");
      console.log("response",response);
      setStatus(response.data);
    } catch (error) {
      console.error("Error fetching status", error);
    }
  };

  const claimCoupon = async () => {
    setLoading(true);
    try {
      const response = await axios.get("api/coupons/claim");
      console.log("coupan response",response);
      setCoupon(response.data.code);
      checkClaimStatus();
    } catch (error) {
      alert(error.response?.data?.message || "Error claiming coupon");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Claim Your Coupon</h2>
        {coupon ? (
          <p className="text-green-600 font-bold">Your Coupon Code: {coupon}</p>
        ) : status && !status.canClaim ? (
          <p className="text-red-500">Try again in {status.remainingTime} seconds.</p>
        ) : (
          <button
            onClick={claimCoupon}
            disabled={loading || (status && !status.canClaim)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Claim Coupon"}
          </button>
        )}
      </div>
    </div>
  );
}
