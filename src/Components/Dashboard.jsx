// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaBell, FaUser, FaFile } from "react-icons/fa";

import VehicleForm from "./VehicleForm";
import ExpiryAlerts from "./ExpiryAlerts";

function Dashboard() {
  const navigate = useNavigate();

  // USER
  const [user, setUser] = useState(null);

  // SIDEBAR
  const [selectedTab, setSelectedTab] = useState("vehicles");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // VEHICLES
  const [vehicles, setVehicles] = useState([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);

  // SERVICE HISTORY
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    vehicleId: "",
    serviceDate: "",
    serviceType: "",
    serviceCenter: "",
    notes: "",
    cost: ""
  });

  const apiVehicle = "https://localhost:7291/api/vehicle";
  const apiService = "https://localhost:7291/api/servicehistory";

  // FETCH USER
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/login");
    else setUser(storedUser);
  }, [navigate]);

  // FETCH VEHICLES & SERVICES
  useEffect(() => {
    if (user) {
      fetchVehicles();
      fetchServices();
    }
  }, [user]);

  // VEHICLES
  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${apiVehicle}/${user.userId}`);
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    await fetch(`${apiVehicle}/${id}`, { method: "DELETE" });
    fetchVehicles();
  };

  // SERVICE HISTORY
  const fetchServices = async () => {
    try {
      const res = await fetch(`${apiService}/user/${user.userId}`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceChange = (e) => {
    setServiceForm({
      ...serviceForm,
      [e.target.name]: e.target.value
    });
  };

  const addService = async (e) => {
    e.preventDefault();

    if (!serviceForm.vehicleId || !serviceForm.serviceDate) {
      alert("Please select vehicle and date");
      return;
    }

    const dto = {
      vehicleId: parseInt(serviceForm.vehicleId),
      serviceDate: serviceForm.serviceDate,
      serviceType: serviceForm.serviceType || "",
      serviceCenter: serviceForm.serviceCenter || "",
      notes: serviceForm.notes || "",
      cost: parseFloat(serviceForm.cost) || 0
    };

    try {
      const res = await fetch(apiService, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API Error:", text);
        alert("Failed to add service. See console.");
        return;
      }

      alert("Service added successfully!");
      setServiceForm({
        vehicleId: "",
        serviceDate: "",
        serviceType: "",
        serviceCenter: "",
        notes: "",
        cost: ""
      });
      fetchServices();

    } catch (err) {
      console.error("Add service error", err);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete service history?")) return;
    await fetch(`${apiService}/${id}`, { method: "DELETE" });
    fetchServices();
  };

  if (!user) return null;

  return (
    <div className="d-flex vh-100 flex-column flex-md-row"
      style={{ background: "linear-gradient(135deg,#1e3c72,#2a5298)" }}>

      {/* Sidebar */}
      <div className={`text-white p-4 d-flex flex-column ${sidebarOpen ? "d-block" : "d-none d-md-flex"}`}
        style={{ minWidth: "240px", background: "rgba(0,0,0,0.6)" }}>

        <div className="text-center mb-4">
          <div className="rounded-circle bg-light text-dark d-inline-flex align-items-center justify-content-center mb-2"
            style={{ width: "70px", height: "70px", fontSize: "24px" }}>
            {user.userName.charAt(0).toUpperCase()}
          </div>
          <h5>{user.userName}</h5>
          <small>{user.email}</small>
        </div>

        {[ 
          { key: "vehicles", icon: <FaCar />, label: "Vehicles" },
          { key: "serviceHistory", icon: <FaFile />, label: "Service History" },
          { key: "alerts", icon: <FaBell />, label: "Expiry Alerts" },
          { key: "profile", icon: <FaUser />, label: "Profile" }
        ].map(item => (
          <button
            key={item.key}
            className={`btn text-start mb-2 ${selectedTab === item.key ? "btn-light text-dark fw-bold" : "btn-outline-light"}`}
            onClick={() => setSelectedTab(item.key)}
          >
            {item.icon} {item.label}
          </button>
        ))}

        <button
          className="btn btn-danger mt-auto"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="d-flex justify-content-between mb-4">
          <h3 className="text-white">Welcome {user.userName}</h3>
          <button
            className="btn btn-light d-md-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <div className="p-4 rounded shadow-lg"
          style={{ background: "rgba(255,255,255,0.95)" }}>

          {/* VEHICLES */}
          {selectedTab === "vehicles" && (
            <div>
              <h4>My Vehicles</h4>
              <button
                className="btn btn-primary mb-3"
                onClick={() => { setEditVehicle(null); setShowVehicleForm(true); }}
              >
                + Add Vehicle
              </button>

              {showVehicleForm && (
                <VehicleForm
                  user={user}
                  vehicle={editVehicle}
                  onClose={() => setShowVehicleForm(false)}
                  refreshVehicles={fetchVehicles}
                />
              )}

              <div className="row">
                {vehicles.map(v => (
                  <div className="col-md-6 mb-3" key={v.vehicleId}>
                    <div className="card p-3 shadow">
                      <h5>{v.vehicleNumber}</h5>
                      <p>{v.brand} - {v.model}</p>
                      <p><b>Insurance:</b> {v.insuranceExpiryDate?.split("T")[0]}</p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => { setEditVehicle(v); setShowVehicleForm(true); }}
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
          )}

          {/* SERVICE HISTORY */}
          {selectedTab === "serviceHistory" && (
            <div>
              <h4>Service History</h4>

              <form className="mb-4" onSubmit={addService}>
                <select
                  className="form-control mb-2"
                  name="vehicleId"
                  value={serviceForm.vehicleId}
                  onChange={handleServiceChange}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.vehicleNumber}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="serviceDate"
                  className="form-control mb-2"
                  value={serviceForm.serviceDate}
                  onChange={handleServiceChange}
                  required
                />

                <input
                  name="serviceType"
                  className="form-control mb-2"
                  placeholder="Service Type"
                  value={serviceForm.serviceType}
                  onChange={handleServiceChange}
                />

                <input
                  name="serviceCenter"
                  className="form-control mb-2"
                  placeholder="Service Center"
                  value={serviceForm.serviceCenter}
                  onChange={handleServiceChange}
                />

                <input
                  type="number"
                  name="cost"
                  className="form-control mb-2"
                  placeholder="Cost"
                  value={serviceForm.cost}
                  onChange={handleServiceChange}
                />

                <textarea
                  name="notes"
                  className="form-control mb-2"
                  placeholder="Notes"
                  value={serviceForm.notes}
                  onChange={handleServiceChange}
                />

                <button className="btn btn-success">Add Service</button>
              </form>

              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Center</th>
                    <th>Cost</th>
                    <th>Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
               <tbody>
  {services.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center">No service history</td>
    </tr>
  ) : (
    services.map(s => {
      // Map vehicleId to vehicleNumber
      const vehicle = vehicles.find(v => v.vehicleId === s.vehicleId);
      const vehicleNumber = vehicle ? vehicle.vehicleNumber : "Unknown";

      return (
        <tr key={s.id}>
          <td>{vehicleNumber}</td> {/* Fixed column */}
          <td>{new Date(s.serviceDate).toLocaleDateString()}</td>
          <td>{s.serviceType}</td>
          <td>{s.serviceCenter}</td>
          <td>₹{s.cost}</td>
          <td>{s.description}</td>
          <td>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteService(s.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })
  )}
</tbody>
              </table>
            </div>
          )}

          {/* ALERTS */}
          {selectedTab === "alerts" && <ExpiryAlerts user={user} />}

          {/* PROFILE */}
          {selectedTab === "profile" && (
            <div>
              <h4>User Profile</h4>
              <p><b>Name:</b> {user.userName}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Phone:</b> {user.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;