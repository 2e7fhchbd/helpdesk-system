import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ticketsCollection = collection(db, "tickets");

// Submit form
const form = document.getElementById("ticketForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const department = document.getElementById("department").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;

    try {
      await addDoc(ticketsCollection, {
        name,
        department,
        title,
        description,
        priority,
        timestamp: new Date()
      });

      document.getElementById("success-message").textContent = "Ticket submitted!";
      form.reset();
    } catch (err) {
      console.error("Error submitting ticket:", err);
    }
  });
}

// Display user tickets
const userTicketsDiv = document.getElementById("userTickets");
if (userTicketsDiv) {
  const q = query(ticketsCollection, orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    userTicketsDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const ticket = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${ticket.title}</strong> (${ticket.priority})<br>
        ${ticket.description}<br>
        <em>By ${ticket.name} - ${ticket.department}</em>
        <hr>
      `;
      userTicketsDiv.appendChild(div);
    });
  });
}

// Display admin tickets
const adminTicketsDiv = document.getElementById("adminTickets");
if (adminTicketsDiv) {
  const q = query(ticketsCollection, orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    adminTicketsDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const ticket = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${ticket.title} (${ticket.priority})</h3>
        <p>${ticket.description}</p>
        <p><strong>${ticket.name}</strong> - ${ticket.department}</p>
        <hr>
      `;
      adminTicketsDiv.appendChild(div);
    });
  });
}
