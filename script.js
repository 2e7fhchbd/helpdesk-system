// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Your Firebase config
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

// Check if user is on the form page or admin page
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');
  const adminDiv = document.getElementById('adminTickets');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const issue = document.getElementById('issue').value;

      if (!name || !email || !issue) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        await addDoc(collection(db, "tickets"), {
          name,
          email,
          issue,
          timestamp: new Date()
        });

        alert("Ticket submitted successfully!");
        form.reset();
      } catch (error) {
        console.error("Error adding ticket: ", error);
        alert("Failed to submit ticket.");
      }
    });
  }

  if (adminDiv) {
    loadTickets(adminDiv);
  }
});

// Function to load tickets to admin page
async function loadTickets(container) {
  container.innerHTML = "<p>Loading tickets...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "tickets"));

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No tickets found.</p>";
      return;
    }

    let html = "<ul>";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      html += `<li><strong>${data.name}</strong> (${data.email}): ${data.issue}</li>`;
    });
    html += "</ul>";

    container.innerHTML = html;
  } catch (error) {
    console.error("Error fetching tickets: ", error);
    container.innerHTML = "<p>Failed to load tickets.</p>";
  }
}
