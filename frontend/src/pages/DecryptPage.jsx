import React, { useState } from 'react';
import axios from 'axios';  // Import axios

const DecryptPage = () => {
  // State for file name and key
  const [filename, setFilename] = useState('');
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleDecrypt = async (e) => {
    e.preventDefault();

    if (!filename || !key) {
      setMessage("Filename and key are required.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      console.log(filename,key)
      // Make the POST request using axios
      const response = await axios.post("http://localhost:8080/api/decryptfile", {
        filename,
        key
      }, {
        responseType: 'blob', // Important to tell axios we expect a Blob (binary data)
      });

      // If the response is successful, handle the file download
      if (response.status === 200) {
        const downloadUrl = URL.createObjectURL(response.data); // Create a download link
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename; // Suggest the original filename for download
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
    <div>
      <h1>Decrypt File</h1>
      <form onSubmit={handleDecrypt}>
        <div>
          <label htmlFor="filename">Filename:</label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
          />
        </div>

        <div>
          <label htmlFor="key">Decryption Key:</label>
          <input
            type="password"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter decryption key"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Decrypting..." : "Decrypt File"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default DecryptPage;
