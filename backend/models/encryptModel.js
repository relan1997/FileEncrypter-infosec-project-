import mongoose from "mongoose";

const encryptSchema = new mongoose.Schema({
    filename: { type: String, required: true,unique:true }, // Original filename
    mimetype: { type: String, required: true }, // MIME type of the file
    encryptedData: { type: Buffer, required: true }, // The encrypted file data
    salt: { type: Buffer, required: true }, // Salt used for key derivation (16 bytes)
    createdAt: { type: Date, default: Date.now }, // Timestamp  
});

const EncText = mongoose.model('EncText', encryptSchema);

export { EncText };
