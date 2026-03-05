import { useState, useEffect } from "react";

function VehicleForm({ user, vehicle, onClose, refreshVehicles }) {
  const apiBase = "https://localhost:7291/api/vehicle";

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    type: "",
    model: "",
    brand: "",
    rcExpiryDate: "",
    insuranceExpiryDate: "",
    pollutionExpiryDate: "",
    batteryWarrantyExpiryDate: ""
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle,
        rcExpiryDate: vehicle.rcExpiryDate?.split("T")[0],
        insuranceExpiryDate: vehicle.insuranceExpiryDate?.split("T")[0],
        pollutionExpiryDate: vehicle.pollutionExpiryDate?.split("T")[0],
        batteryWarrantyExpiryDate: vehicle.batteryWarrantyExpiryDate?.split("T")[0]
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData, userId: user.userId };

    try {
      if (vehicle) {
        // UPDATE
        const res = await fetch(`${apiBase}/${vehicle.vehicleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, vehicleId: vehicle.vehicleId })
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        // ADD
        const res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Add failed");
      }

      refreshVehicles(); // 🔥 refresh parent list
      onClose();         // close form
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h5>{vehicle ? "Edit Vehicle" : "Add Vehicle"}</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="form-control"
              placeholder="Vehicle Number"
              required
            />
          </div>

          <div className="col-md-6">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Type</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Scooter">Scooter</option>
            </select>
          </div>

          <div className="col-md-6">
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="form-control"
              placeholder="Model"
              required
            />
          </div>

          <div className="col-md-6">
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="form-control"
              placeholder="Brand"
              required
            />
          </div>

          {/* 🔹 Expiry Dates */}
          {["rcExpiryDate","insuranceExpiryDate","pollutionExpiryDate","batteryWarrantyExpiryDate"].map((field, i) => (
            <div className="col-md-6" key={i}>
              <label>{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="date"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          ))}
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-success me-2">
            {vehicle ? "Update" : "Add"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default VehicleForm;