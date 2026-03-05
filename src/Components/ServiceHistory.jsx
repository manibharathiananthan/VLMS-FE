import { useEffect, useState } from "react";

function ServiceHistory({ user }) {

  const apiBase = "https://localhost:7291/api/servicehistory";

  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceDate: "",
    serviceType: "",
    serviceCenter: "",
    notes: "",
    cost: ""
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Load vehicles
  const fetchVehicles = async () => {
    try {
      const res = await fetch(`https://localhost:7291/api/vehicle/user/${user.userId}`);
      if (!res.ok) return;

      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.log("Vehicle load error", err);
    }
  };

  // 🔹 Load service history
  const fetchServices = async () => {
    try {
      const res = await fetch(`${apiBase}/user/${user.userId}`);
      if (!res.ok) return;

      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.log("Service load error", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchServices();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Add service
  const handleAddService = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          vehicleId: parseInt(formData.vehicleId),
          serviceDate: formData.serviceDate,
          serviceType: formData.serviceType,
          serviceCenter: formData.serviceCenter,
          notes: formData.notes,
          cost: parseFloat(formData.cost)
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        alert("Failed to add service. Check console.");
        return;
      }

      setFormData({
        vehicleId: "",
        serviceDate: "",
        serviceType: "",
        serviceCenter: "",
        notes: "",
        cost: ""
      });

      fetchServices();

    } catch (err) {
      console.log("Add service error", err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service history?")) return;

    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    fetchServices();
  };

  return (
    <div className="container mt-4">

      <h3>Service History</h3>

      {/* Add Service Form */}
      <form onSubmit={handleAddService} className="card p-3 mb-4">
        <div className="row">
          <div className="col-md-3">
            <label>Vehicle</label>
            <select
              className="form-control"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.vehicleNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label>Service Date</label>
            <input
              type="date"
              className="form-control"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label>Service Type</label>
            <input
              type="text"
              className="form-control"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label>Service Center</label>
            <input
              type="text"
              className="form-control"
              name="serviceCenter"
              value={formData.serviceCenter}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mt-2">
            <label>Notes</label>
            <input
              type="text"
              className="form-control"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Oil change / Repair"
            />
          </div>

          <div className="col-md-2 mt-2">
            <label>Cost</label>
            <input
              type="number"
              className="form-control"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-1 d-flex align-items-end mt-2">
            <button className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </form>

      {/* Service List */}
      {loading ? (
        <p>Loading services...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Type</th>
              <th>Center</th>
              <th>Notes</th>
              <th>Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No service history
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id}>
                  <td>{s.vehicle.vehicleNumber}</td>
                  <td>{new Date(s.serviceDate).toLocaleDateString()}</td>
                  <td>{s.serviceType}</td>
                  <td>{s.serviceCenter}</td>
                  <td>{s.notes}</td>
                  <td>₹{s.cost}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteService(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ServiceHistory;