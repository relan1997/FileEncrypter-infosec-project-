import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './EncryptPage.css'; 

const EncryptPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleEncrypt = async (e) => {
    e.preventDefault();

    if (!selectedFile || !key) {
      setMessage("File and encryption key are required.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("myFile", selectedFile);
    formData.append("key", key);

    try {
      const response = await axios.post("https://fileencrypter-infosec-project.onrender.com/api/encryptfile", formData);

      if (response.status === 200) {
        setMessage("File encrypted successfully!");
      } else {
        setMessage("Encryption failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during encryption:", error);
      setMessage("An error occurred during encryption.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="encrypt-page">
      <h1 className="encrypt-title">Encrypt File</h1>
      <form onSubmit={handleEncrypt} className="encrypt-form">
        <div className="input-group">
          <label htmlFor="file">Select File:</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="hidden-file-input"
            />
            <label htmlFor="file" className="custom-file-button">
              {selectedFile ? selectedFile.name : "Choose File"}
            </label>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="key">Encryption Key:</label>
          <input
            type="password"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter encryption key"
          />
        </div>
        <button type="submit" disabled={isLoading} className="encrypt-button">
          {isLoading ? "Encrypting..." : "Encrypt File"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}


      <div className="navigation-buttons">
        <button className="nav-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
        <button className="nav-button" onClick={() => navigate('/decrypt')}>
          Go to Decrypt File
        </button>
      </div>
    </div>
  );
};

export default EncryptPage;