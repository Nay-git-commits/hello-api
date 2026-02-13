"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // --- NEW: Load existing profile on page load ---
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          // Pre-fill the form with database data
          setFirstName(data.user.firstName);
          setLastName(data.user.lastName);
          setEmail(data.user.email);
          setPreviewUrl(data.user.profileImage); // Show the saved image
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");

    if (!file && !previewUrl) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    // Only append file if a NEW one was selected
    if (file) {
        formData.append("file", file);
    }
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Success! Profile Updated.");
        setPreviewUrl(data.user.profileImage);
      } else {
        setStatus("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("Upload failed.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1>User Profile Management</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <div>
          <label>First Name:</label><br/>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Last Name:</label><br/>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Email:</label><br/>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ border: "1px dashed #ccc", padding: "20px", textAlign: "center" }}>
          <label>Profile Image:</label><br/>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          {previewUrl && (
            <div style={{ marginTop: "15px" }}>
              <p>Current Profile Photo:</p>
              <img 
                src={previewUrl} 
                alt="Profile" 
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }} 
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          style={{ padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}
        >
          {file ? "Upload & Save" : "Save Changes"}
        </button>

      </form>
      
      {status && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{status}</p>}
    </div>
  );
}