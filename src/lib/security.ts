"use server";

import { createCipheriv, createDecipheriv, scryptSync } from "crypto";

const password = "Netsepio"; // Replace with your secret passphrase
const salt = "Chromium"; // Replace with a unique salt

// Generate key and IV
const key = scryptSync(password, salt, 24); // You can use scryptSync for simplicity
const iv = Buffer.alloc(16, 0); // Initialization vector.

export const encrypt = async (priv: string) => {
  const algo = "aes-192-cbc";
  const cipher = createCipheriv(algo, key, iv);

  let encrypted = cipher.update(priv, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decrypt = async (encryptedData: string) => {
  const algo = "aes-192-cbc";
  const decipher = createDecipheriv(algo, key, iv);

  try {
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Handle decryption errors as needed
  }
};
