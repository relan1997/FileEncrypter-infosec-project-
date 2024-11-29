
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import multer from "multer";
import cors from "cors";
import crypto from "crypto";
import { promises as fs } from "fs";
const app = express();
app.use(cors());
app.use(express.json());
import { EncText } from "../backend/models/encryptModel.js";
mongoose.connect(
  "mongodb+srv://harshal:v8MiIlu9uuK0VQJ8@cluster0.u57rmde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const upload = multer({ storage: multer.memoryStorage() });
async function deriveKey(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, "sha256", (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey);
    });
  });
}

const readFileAsBuffer = (path) => {
  return fs.readFile(path);
};

app.post("/api/uploadfile", upload.single("myFile"), async (req, res) => {
  try {
    const password = req.body.key; // Password for encryption
    if (!password) {
      return res.status(400).send("Password is required for encryption.");
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).send("No file uploaded.");
    }

   
    const fileBuffer = req.file.buffer;

    const salt = crypto.randomBytes(16);

    // Derive the encryption key
    const key = await deriveKey(password, salt);

    const iv = salt; 
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encryptedBuffer = Buffer.concat([
      cipher.update(fileBuffer),
      cipher.final(),
    ]);

    // Save encrypted file data to MongoDB
    const newFile = new EncText({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      encryptedData: encryptedBuffer, 
      salt: salt, 
    });

    await newFile.save(); // Save the document to MongoDB
    console.log("Encrypted file saved to MongoDB!");

    res.status(200).send("File encrypted and saved successfully!");
  } catch (err) {
    console.error("Error encrypting or saving file:", err);
    res.status(500).send("An error occurred during encryption and saving.");
  }
});

app.post("/api/decryptfile", async (req, res) => {
  try {
    console.log(req.body);
    const { filename, key } = req.body; // User provides filename and key
    if (!filename || !key) {
      return res.status(400).send("Filename and key are required.");
    }

    // Find the file by filename
    const fileDoc = await EncText.findOne({ filename });
    if (!fileDoc) {
      return res.status(404).send("File not found.");
    }

    const { encryptedData, salt, mimetype } = fileDoc;

  
    const derivedKey = await deriveKey(key, salt);

    // Decryption
    const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, salt);
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    // Save the decrypted file to a local folder
    const outputDir = path.join(__dirname, "decrypted_files");
    await fs.mkdir(outputDir, { recursive: true }); 
    const outputFilePath = path.join(outputDir, filename);

    await fs.writeFile(outputFilePath, decryptedBuffer); 

    // Send the file for download
    res.download(outputFilePath, filename, async (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Failed to send the file.");
      }

      // Delete the file after download to avoid clutter
      try {
        await fs.unlink(outputFilePath);
      } catch (cleanupErr) {
        console.error("Error deleting temporary file:", cleanupErr);
      }
    });
  } catch (err) {
    console.error("Decryption error:", err);
    res.status(500).send("An error occurred during decryption.");
  }
});

app.listen(8080, () => {
  console.log("Listening on Port 8080");
});
