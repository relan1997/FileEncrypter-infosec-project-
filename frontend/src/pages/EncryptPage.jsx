import React, { useState } from "react";
import axios from "axios";

const EncryptPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
    const [key,setKey] = useState("")
    // On file select (from the pop-up)
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onKeyChange = (value)=>{
        setKey(value)
    }

    // On file upload (click the upload button)
    const onFileUpload = () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        if(!key){
            alert("Pleae enter the required key");
            return;
        }

        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append("myFile", selectedFile, selectedFile.name);
        formData.append("key", key);
        // Details of the uploaded file
        console.log(selectedFile);

        // Request made to the backend API
        // Send formData object
        axios
            .post("http://localhost:8080/api/uploadfile", formData)
            .then((response) => {
                console.log("File uploaded successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error uploading the file:", error);
            });
    };

    // File content to be displayed after
    // file upload is complete
    const fileData = () => {
        if (selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {selectedFile.name}</p>
                    <p>File Type: {selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {new Date(selectedFile.lastModified).toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose a file before pressing the Upload button</h4>
                </div>
            );
        }
    };

    return (
        <div>
            <h1>File Upload using React and Vite!</h1>
            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>Upload!</button>
            </div>
            <div>
                <input type="text" name="key" onChange={(e)=>onKeyChange(e.target.value)} />
            </div>
            {fileData()}
        </div>
    );
}

export default EncryptPage