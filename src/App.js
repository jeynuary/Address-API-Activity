import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  const [timePH, setTimePH] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 🕒 Philippine Time
  useEffect(() => {
    const updateTime = () => {
      const time = new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
      setTimePH(time);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🇵🇭 Fetch all regions
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Error loading regions:", err));
  }, []);

  // 📍 Fetch provinces or Metro Manila
  useEffect(() => {
    if (!selectedRegion) {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      return;
    }

    if (selectedRegion === "130000000") {
      setProvinces([{ code: "MM01", name: "Metro Manila" }]);
    } else {
      fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`)
        .then((res) => res.json())
        .then((data) => setProvinces(data))
        .catch((err) => console.error("Error loading provinces:", err));
    }
  }, [selectedRegion]);

  // 🏙️ Fetch cities
  useEffect(() => {
    if (!selectedProvince) return;

    if (selectedProvince === "MM01") {
      fetch(`https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/`)
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Error loading cities:", err));
    } else {
      fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`)
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Error loading cities:", err));
    }
  }, [selectedProvince]);

  // 🏘️ Fetch barangays
  useEffect(() => {
    if (!selectedCity) return;

    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`)
      .then((res) => res.json())
      .then((data) => setBarangays(data))
      .catch((err) => console.error("Error loading barangays:", err));
  }, [selectedCity]);

  // ✅ Toast Trigger
  useEffect(() => {
    if (selectedRegion && selectedProvince && selectedCity && selectedBarangay) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [selectedBarangay]);

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-2 text-primary">Philippine Address Selector</h2>
        <p className="text-center text-secondary mb-4">
          Philippine Time (Asia/Manila): <strong>{timePH}</strong>
        </p>

        <div className="mb-3">
          <label className="form-label fw-semibold">Region:</label>
          <select
            className="form-select"
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedProvince("");
              setSelectedCity("");
              setSelectedBarangay("");
            }}
          >
            <option value="">-- Select Region --</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Province:</label>
          <select
            className="form-select"
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedCity("");
              setSelectedBarangay("");
            }}
          >
            <option value="">-- Select Province --</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">City/Municipality:</label>
          <select
            className="form-select"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedBarangay("");
            }}
          >
            <option value="">-- Select City/Municipality --</option>
            {cities.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Barangay:</label>
          <select
            className="form-select"
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
          >
            <option value="">-- Select Barangay --</option>
            {barangays.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {selectedBarangay && (
          <div className="alert alert-primary mt-4">
            <h5 className="fw-bold">Selected Address:</h5>
            <p className="mb-0">
              Region: {regions.find((r) => r.code === selectedRegion)?.name}
              <br />
              Province: {provinces.find((p) => p.code === selectedProvince)?.name}
              <br />
              City/Municipality: {cities.find((c) => c.code === selectedCity)?.name}
              <br />
              Barangay: {barangays.find((b) => b.code === selectedBarangay)?.name}
            </p>
          </div>
        )}
      </div>

      {/* 🔔 Toast Notification */}
      {showToast && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-4 bg-success text-white"
          role="alert"
        >
          <div className="toast-body">
            ✅ Full address selected successfully!
          </div>
        </div>
      )}
    </div>
  );
}

export default App;






