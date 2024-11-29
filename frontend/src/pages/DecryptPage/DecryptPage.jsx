import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DecryptPage.css'; 

const DecryptPage = () => {
  const [filename, setFilename] = useState('');
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleDecrypt = async (e) => {
    e.preventDefault();

    if (!filename || !key) {
      setMessage("Filename and key are required.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/decryptfile",
        { filename, key },
        { responseType: 'blob' }
      );

      if (response.status === 200) {
        const downloadUrl = URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setMessage("File decrypted successfully!");
      } else {
        setMessage("Decryption failed. Please check your filename and key.");
      }
    } catch (error) {
      console.error("Error during decryption:", error);
      setMessage("An error occurred during decryption.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="decrypt-page">
      <h1 className="decrypt-title">Decrypt File</h1>
      <form onSubmit={handleDecrypt} className="decrypt-form">
        <div className="input-group">
          <label htmlFor="filename">Filename:</label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
          />
        </div>
        <div className="input-group">
          <label htmlFor="key">Decryption Key:</label>
          <input
            type="password"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter decryption key"
          />
        </div>
        <button type="submit" disabled={isLoading} className="decrypt-button">
          {isLoading ? "Decrypting..." : "Decrypt File"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}

      <div className="navigation-buttons">
        <button className="nav-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default DecryptPage;