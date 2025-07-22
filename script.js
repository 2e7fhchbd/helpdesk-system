import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJz1bkwfmGfOPKm2aPTNc0QTmHA6FzHfU",
  authDomain: "ithelp-fa911.firebaseapp.com",
  projectId: "ithelp-fa911",
  storageBucket: "ithelp-fa911.appspot.com",
  messagingSenderId: "991792960822",
  appId: "1:991792960822:web:cd63301d95764e60fe4f97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit ticket (for user.html)
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
      await addDoc(collection(db, "tickets"), {
        name,
        department,
        title,
        description,
        priority,
        timestamp: new Date()
      });
      document.getElementById("success-message").innerText = "Ticket submitted successfully!";
      form.reset();
      loadTickets("userTickets"); // Refresh tickets list
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });
}

// Load tickets (for both user.html and admin.html)
async function loadTickets(containerId) {
  const ticketsContainer = document.getElementById(containerId);
  if (!ticketsContainer) return;

  ticketsContainer.innerHTML = "Loading tickets...";

  const q = query(collection(db, "tickets"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  ticketsContainer.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const ticket = doc.data();
    const ticketDiv = document.createElement("div");
    ticketDiv.className = "ticket";
    ticketDiv.innerHTML = `
      <strong>${ticket.title}</strong><br>
      <em>By ${ticket.name} (${ticket.department})</em><br>
      <span>Priority: ${ticket.priority}</span><br>
      <p>${ticket.description}</p>
      <small>${new Date(ticket.timestamp.seconds * 1000).toLocaleString()}</small>
      <hr>
    `;
    ticketsContainer.appendChild(ticketDiv);
  });
}

// Load tickets for both user and admin
window.addEventListener("DOMContentLoaded", () => {
  loadTickets("userTickets");
  loadTickets("adminTickets");
});
