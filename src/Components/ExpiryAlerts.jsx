// ExpiryAlerts.jsx
import { useEffect, useState } from "react";

function ExpiryAlerts({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = "https://localhost:7291/api/vehicle";

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const days = 30;
      const response = await fetch(
        `${apiBase}/expiry-alert?userId=${user.userId}&days=${days}`,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error("Failed to fetch alerts");

      const data = await response.json();
      const today = new Date();
      const next30Days = new Date();
      next30Days.setDate(today.getDate() + days);

      // Sort alerts by date
      const sorted = data.sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
      );

      setAlerts(sorted);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Loading alerts...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (alerts.length === 0)
    return <div>No vehicle expiry data available.</div>;

  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);

  const upcoming = alerts.filter(
    alert => new Date(alert.expiryDate) >= today &&
             new Date(alert.expiryDate) <= next30Days
  );
  const expired = alerts.filter(alert => new Date(alert.expiryDate) < today);

  return (
    <div>
      <h3>Vehicle Expiry Alerts</h3>

      {upcoming.length > 0 ? (
        <div>
          <h4>Upcoming Expiries (Next 30 Days)</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {upcoming.map((alert, index) => {
              const expiryDate = new Date(alert.expiryDate);
              const daysLeft = Math.ceil(
                (expiryDate - today) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    backgroundColor: daysLeft <= 7 ? "#ffe6e6" : "#f9f9f9",
                  }}
                >
                  <strong>{alert.vehicleNumber}</strong> <br />
                  {alert.documentType} expires on {expiryDate.toLocaleDateString()} (
                  {daysLeft} days left)
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>No upcoming expiries in the next 30 days.</div>
      )}

      {expired.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Already Expired</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {expired.map((alert, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#ffe6e6",
                }}
              >
                <strong>{alert.vehicleNumber}</strong> <br />
                {alert.documentType} expired on{" "}
                {new Date(alert.expiryDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpiryAlerts;