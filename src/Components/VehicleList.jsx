import { useState, useEffect } from "react";
import VehicleForm from "./VehicleForm";

function VehicleList({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const apiBase = "https://localhost:7291/api/vehicle";

  // 🔹 Fetch vehicles
  const fetchVehicles = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`${apiBase}/${user.userId}`);
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  // 🔹 Delete vehicle
  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      fetchVehicles(); // refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🚗 My Vehicles</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setEditVehicle(null);
          setShowForm(true);
        }}
      >
        + Add Vehicle
      </button>

      {/* VehicleForm Modal */}
      {showForm && (
        <VehicleForm
          user={user}
          vehicle={editVehicle}
          onClose={() => setShowForm(false)}
          refreshVehicles={fetchVehicles} // 🔥 pass refresh function
        />
      )}

      <div className="row">
        {vehicles.map((v) => (
          <div className="col-md-6 mb-3" key={v.vehicleId}>
            <div className="card p-3 shadow rounded">
              <h5>{v.vehicleNumber}</h5>
              <p>{v.brand} - {v.model} ({v.type})</p>

              <p><b>RC:</b> {v.rcExpiryDate?.split("T")[0]}</p>
              <p><b>Insurance:</b> {v.insuranceExpiryDate?.split("T")[0]}</p>
              <p><b>Pollution:</b> {v.pollutionExpiryDate?.split("T")[0]}</p>
              <p><b>Battery:</b> {v.batteryWarrantyExpiryDate?.split("T")[0]}</p>

              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    setEditVehicle(v);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteVehicle(v.vehicleId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleList;