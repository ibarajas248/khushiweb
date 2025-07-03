// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBD28o9VyGF3PwXyRWYvcCR2gua0HKS18M",
  authDomain: "khushi-prueba-imagen.firebaseapp.com",
  projectId: "khushi-prueba-imagen",
  storageBucket: "khushi-prueba-imagen.appspot.com",
  messagingSenderId: "407942354111",
  appId: "1:407942354111:web:6ce04e740b7282e48ee20a",
  measurementId: "G-Q5M02HDW3C"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Exportar globalmente para acceso desde HTML (si es necesario)
window.firebaseStorage = storage;
window.firebaseRef = ref;
window.firebaseUploadBytes = uploadBytes;
window.firebaseGetDownloadURL = getDownloadURL;
window.firebaseDeleteObject = deleteObject;
