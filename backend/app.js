
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import 'dotenv/config'

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
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const upload = multer({ storage: multer.memoryStorage() });
// async function deriveKey(password, salt) {
//   return new Promise((resolve, reject) => {
//     crypto.pbkdf2(password, salt, 100000, 32, "sha256", (err, derivedKey) => {
//       if (err) reject(err);
//       resolve(derivedKey);
//     });
//   });
// }

const readFileAsBuffer = (path) => {
  return fs.readFile(path);
};

app.post("/api/encryptfile", upload.single("myFile"), async (req, res) => {
  try {
    const password = req.body.key; // Password for encryption
    if (!password) {
      return res.status(400).send("Password is required for encryption.");
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).send("No file uploaded.");
    }

    const fileBuffer = req.file.buffer;

    // Convert password into a buffer to use as the XOR key
    const keyBuffer = Buffer.from(password);

    // XOR encryption function
    const xorCipher = (buffer, keyBuffer) => {
      const outputBuffer = Buffer.alloc(buffer.length); // Allocate buffer for output
      for (let i = 0; i < buffer.length; i++) {
        outputBuffer[i] = buffer[i] ^ keyBuffer[i % keyBuffer.length]; // XOR operation
      }
      return outputBuffer;
    };

    // Encrypt the file buffer using XOR
    const encryptedBuffer = xorCipher(fileBuffer, keyBuffer);

    // Save encrypted file data to MongoDB
    const newFile = new EncText({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      encryptedData: encryptedBuffer, // Store the encrypted buffer
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

    const { encryptedData, mimetype } = fileDoc;

    // Convert the key to a buffer
    const keyBuffer = Buffer.from(key);

    // XOR decryption function (same as encryption in XOR)
    const xorCipher = (buffer, keyBuffer) => {
      const outputBuffer = Buffer.alloc(buffer.length); // Allocate buffer for output
      for (let i = 0; i < buffer.length; i++) {
        outputBuffer[i] = buffer[i] ^ keyBuffer[i % keyBuffer.length]; // XOR operation
      }
      return outputBuffer;
    };

    // Decrypt the file buffer using XOR
    const decryptedBuffer = xorCipher(encryptedData, keyBuffer);

    // Save the decrypted file to a local folder
    const outputDir = path.join(__dirname, "decrypted_files");
    await fs.mkdir(outputDir, { recursive: true }); // Ensure directory exists
    const outputFilePath = path.join(outputDir, filename);

    await fs.writeFile(outputFilePath, decryptedBuffer); // Write decrypted file

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
