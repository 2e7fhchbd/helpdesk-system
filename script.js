// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDKMArGnFu3n1-R4pQFbPOIMtb_tPMsX1s",
  authDomain: "helpdesk-system-c22b7.firebaseapp.com",
  projectId: "helpdesk-system-c22b7",
  storageBucket: "helpdesk-system-c22b7.appspot.com",
  messagingSenderId: "486149560517",
  appId: "1:486149560517:web:343c8f7257b03c243de0c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============ Ticket Submission ============ //
const submitBtn = document.getElementById("submit-btn");

if (submitBtn) {
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("full-name").value;
    const matricNumber = document.getElementById("matric-number").value;
    const email = document.getElementById("email").value;
    const issue = document.getElementById("issue").value;

    if (!fullName || !matricNumber || !email || !issue) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "tickets"), {
        fullName,
        matricNumber,
        email,
        issue,
        submittedAt: new Date().toISOString()
      });

      alert("Ticket submitted successfully!");

      // Clear form fields
      document.getElementById("full-name").value = "";
      document.getElementById("matric-number").value = "";
      document.getElementById("email").value = "";
      document.getElementById("issue").value = "";

      // Refresh ticket list
      loadSubmittedTickets();

    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
}

// ============ Load Submitted Tickets (User Panel) ============ //
async function loadSubmittedTickets() {
  const ticketList = document.getElementById("submitted-tickets");

  if (!ticketList) return;

  ticketList.innerHTML = "<p>Loading...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "tickets"));
    ticketList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const ticket = doc.data();
      const ticketItem = document.createElement("div");
      ticketItem.classList.add("ticket-item");
      ticketItem.innerHTML = `
        <p><strong>Name:</strong> ${ticket.fullName}</p>
        <p><strong>Matric:</strong> ${ticket.matricNumber}</p>
        <p><strong>Email:</strong> ${ticket.email}</p>
        <p><strong>Issue:</strong> ${ticket.issue}</p>
        <hr>
      `;
      ticketList.appendChild(ticketItem);
    });

    if (ticketList.innerHTML === "") {
      ticketList.innerHTML = "<p>No submitted tickets yet.</p>";
    }

  } catch (error) {
    ticketList.innerHTML = "<p>Error loading tickets.</p>";
    console.error(error);
  }
}

loadSubmittedTickets(); // load on page open

// ============ Admin Panel Ticket View ============ //
async function loadAdminTickets() {
  const adminTicketList = document.getElementById("admin-ticket-list");

  if (!adminTicketList) return;

  adminTicketList.innerHTML = "<p>Loading...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "tickets"));
    adminTicketList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const ticket = doc.data();
      const ticketItem = document.createElement("div");
      ticketItem.classList.add("admin-ticket-item");
      ticketItem.innerHTML = `
        <p><strong>Name:</strong> ${ticket.fullName}</p>
        <p><strong>Matric:</strong> ${ticket.matricNumber}</p>
        <p><strong>Email:</strong> ${ticket.email}</p>
        <p><strong>Issue:</strong> ${ticket.issue}</p>
        <p><strong>Submitted:</strong> ${new Date(ticket.submittedAt).toLocaleString()}</p>
        <hr>
      `;
      adminTicketList.appendChild(ticketItem);
    });

    if (adminTicketList.innerHTML === "") {
      adminTicketList.innerHTML = "<p>No tickets found.</p>";
    }

  } catch (error) {
    adminTicketList.innerHTML = "<p>Error loading tickets.</p>";
    console.error(error);
  }
}

loadAdminTickets(); // load on page open
