import { useState, useEffect } from "react";

function VehicleDocuments({ vehicleId, user }) {
  const [documents, setDocuments] = useState([]);
  const [editDoc, setEditDoc] = useState(null);

  // Upload form state
  const [documentType, setDocumentType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState(null);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (vehicleId) fetchDocuments();
  }, [vehicleId, refresh]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(
        `https://localhost:7291/api/document/vehicle/${vehicleId}`
      );
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Upload document
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !documentType) return alert("Please select type and file");

    const formData = new FormData();
    formData.append("VehicleId", vehicleId);
    formData.append("DocumentType", documentType);
    if (expiryDate) formData.append("ExpiryDate", expiryDate);
    formData.append("Image", file);

    const res = await fetch("https://localhost:7291/api/document", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Document uploaded successfully!");
      setDocumentType("");
      setExpiryDate("");
      setFile(null);
      setRefresh(!refresh);
    } else alert("Upload failed");
  };

  // Delete document
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this document?")) return;

    await fetch(`https://localhost:7291/api/document/${id}`, {
      method: "DELETE",
    });
    setRefresh(!refresh);
  };

  // Edit document
  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("DocumentId", editDoc.documentId);
    formData.append("DocumentType", editDoc.documentType);
    if (editDoc.expiryDate) formData.append("ExpiryDate", editDoc.expiryDate);
    if (editDoc.file) formData.append("Image", editDoc.file);

    await fetch("https://localhost:7291/api/document", {
      method: "PUT",
      body: formData,
    });

    setEditDoc(null);
    setRefresh(!refresh);
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h3>Vehicle Documents</h3>

      {/* UPLOAD FORM */}
      <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          required
        >
          <option value="">-- Select Document Type --</option>
          <option value="RC">RC</option>
          <option value="Insurance">Insurance</option>
          <option value="Pollution">Pollution Certificate</option>
        </select>

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          style={{ marginLeft: 10 }}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginLeft: 10 }}
          required
        />

        <button type="submit" style={{ marginLeft: 10 }}>
          Upload
        </button>
      </form>

      {/* DOCUMENT LIST */}
      {documents.length === 0 && <p>No documents found.</p>}

      {documents.map((doc) => {
        const isExpired =
          doc.expiryDate && new Date(doc.expiryDate) < new Date();

        return (
          <div
            key={doc.documentId}
            style={{
              border: "1px solid gray",
              padding: 10,
              marginBottom: 10,
              borderRadius: 4,
            }}
          >
            <strong>{doc.documentType}</strong>{" "}
            {doc.expiryDate && (
              <span>
                - Expires: {doc.expiryDate.substring(0, 10)}{" "}
                {isExpired && <span style={{ color: "red" }}>(Expired)</span>}
              </span>
            )}

            <div style={{ marginTop: 5 }}>
              <a
                href={`https://localhost:7291${doc.filePath}`}
                target="_blank"
                rel="noreferrer"
              >
                View File
              </a>
            </div>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => setEditDoc(doc)}>Edit</button>
              <button
                onClick={() => handleDelete(doc.documentId)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}

      {/* EDIT FORM */}
      {editDoc && (
        <div style={{ marginTop: 20, borderTop: "1px solid #ccc", paddingTop: 10 }}>
          <h4>Edit Document</h4>
          <form onSubmit={handleEdit}>
            <input
              type="text"
              value={editDoc.documentType}
              onChange={(e) =>
                setEditDoc({ ...editDoc, documentType: e.target.value })
              }
              required
            />

            <input
              type="date"
              value={editDoc.expiryDate?.substring(0, 10) || ""}
              onChange={(e) =>
                setEditDoc({ ...editDoc, expiryDate: e.target.value })
              }
              style={{ marginLeft: 10 }}
            />

            <input
              type="file"
              onChange={(e) =>
                setEditDoc({ ...editDoc, file: e.target.files[0] })
              }
              style={{ marginLeft: 10 }}
            />

            <div style={{ marginTop: 10 }}>
              <button type="submit">Update</button>
              <button
                type="button"
                onClick={() => setEditDoc(null)}
                style={{ marginLeft: 10 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default VehicleDocuments;