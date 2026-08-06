"use client";

import { db, storage } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Uploads a single file to Storage under portfolios/{id}/... and returns its public URL
async function uploadFile(portfolioId, file, subfolder) {
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const fileRef = ref(storage, `portfolios/${portfolioId}/${subfolder}/${safeName}`);
  const snapshot = await uploadBytes(fileRef, file);
  return getDownloadURL(snapshot.ref);
}

// Uploads the logo + gallery images, then writes the full portfolio document to Firestore
export async function createPortfolio({
  category,
  title,
  description,
  phone,
  additionalPhones,
  links,
  logoFile,
  imageFiles,
}) {
  const id = uuidv4().split("-")[0]; // short, URL-friendly id

  let logoUrl = null;
  if (logoFile) {
    logoUrl = await uploadFile(id, logoFile, "logo");
  }

  const images = [];
  if (imageFiles && imageFiles.length) {
    for (const file of imageFiles) {
      const url = await uploadFile(id, file, "gallery");
      images.push(url);
    }
  }

  const portfolioData = {
    id,
    category: category || "Business",
    title: title || "Untitled Portfolio",
    description: description || "",
    phone,
    additionalPhones: additionalPhones?.filter(Boolean) || [],
    links: links?.filter((l) => l.url) || [],
    logoUrl,
    images,
    ratingSum: 0,
    ratingCount: 0,
    ratingAverage: 0,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "portfolios", id), portfolioData);

  return id;
}

export async function getPortfolio(id) {
  const snap = await getDoc(doc(db, "portfolios", id));
  if (!snap.exists()) return null;
  return snap.data();
}

// Records a new rating (1-5) and atomically recomputes the running average
export async function submitRating(id, value) {
  const portfolioRef = doc(db, "portfolios", id);
  const ratingsRef = collection(db, "portfolios", id, "ratings");

  await addDoc(ratingsRef, {
    value,
    createdAt: serverTimestamp(),
  });

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(portfolioRef);
    if (!snap.exists()) return;
    const data = snap.data();
    const newSum = (data.ratingSum || 0) + value;
    const newCount = (data.ratingCount || 0) + 1;
    transaction.update(portfolioRef, {
      ratingSum: newSum,
      ratingCount: newCount,
      ratingAverage: newSum / newCount,
    });
  });
}
