import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elements
const authForm = document.getElementById("authForm");
const secretContent = document.getElementById("secretContent");
const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

// Auth functions
signUpButton.addEventListener("click", async () => {
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully!");
  } catch (error) {
    alert(error.message);
  }
});

signInButton.addEventListener("click", async () => {
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Signed in successfully!");
  } catch (error) {
    alert(error.message);
  }
});

signOutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Signed out successfully!");
  } catch (error) {
    alert(error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    authForm.style.display = "none";
    secretContent.style.display = "block";
    loadProducts();
  } else {
    authForm.style.display = "block";
    secretContent.style.display = "none";
  }
});

// Product functions
async function loadProducts() {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnapshot) => {
    const product = docSnapshot.data();
    const productCard = createProductCard(product, docSnapshot.id);
    productsContainer.appendChild(productCard);
  });
}

function createProductCard(product, id) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <h3>${product.name}</h3>
    <p>Price: $${product.price}</p>
    <p>Category: ${product.category}</p>
    <button onclick="deleteProduct('${id}')">Delete</button>
    <button onclick="updateProduct('${id}')">Update</button>
  `;

  return card;
}

window.deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, "products", id));
    alert("Product deleted!");
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
};

window.updateProduct = async (id) => {
  const name = prompt("New product name:");
  const price = prompt("New product price:");
  const category = prompt("New product category:");
  if (name && price && category) {
    try {
      await updateDoc(doc(db, "products", id), { name, price, category });
      alert("Product updated!");
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  }
};
