
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJz1bkwfmGfOPKm2aPTNc0QTmHA6FzHfU",
  authDomain: "ithelp-fa911.firebaseapp.com",
  projectId: "ithelp-fa911",
  storageBucket: "ithelp-fa911.appspot.com",
  messagingSenderId: "991792960822",
  appId: "1:991792960822:web:cd63301d95764e60fe4f97"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ticketsCollection = collection(db, "tickets");

const isAdmin = window.location.pathname.includes("admin");

async function getTickets() {
  const snapshot = await getDocs(ticketsCollection);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

async function saveTicket(ticket) {
  await addDoc(ticketsCollection, ticket);
}

async function updateStatus(id, newStatus) {
  const ticketRef = doc(db, "tickets", id);
  await updateDoc(ticketRef, { status: newStatus });
  renderAdminTickets();
}

async function renderUserTickets() {
  const container = document.getElementById("userTickets");
  const username = document.getElementById("name")?.value || localStorage.getItem("currentUser");
  if (!container || !username) return;

  const tickets = await getTickets();
  const userTickets = tickets.filter(t => t.name === username);

  container.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "tickets-grid";

  userTickets.forEach(ticket => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerHTML = `
      <strong>${ticket.title}</strong><br>
      ${ticket.description}<br>
      Priority: ${ticket.priority}<br>
      <span class="status ${ticket.status}">${ticket.status}</span><br>
      Date: ${ticket.date}
    `;
    grid.appendChild(div);
  });

  container.appendChild(grid);
}

async function renderAdminTickets() {
  const container = document.getElementById("adminTickets");
  if (!container) return;

  const tickets = await getTickets();
  container.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "tickets-grid";

  tickets.forEach(ticket => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerHTML = `
      <strong>${ticket.title}</strong> — <em>${ticket.name}</em><br>
      ${ticket.description}<br>
      Priority: ${ticket.priority}<br>
      Date: ${ticket.date}<br>
      Status:
      <select onchange="updateStatus('${ticket.id}', this.value)">
        <option ${ticket.status === "Open" ? "selected" : ""}>Open</option>
        <option ${ticket.status === "In Progress" ? "selected" : ""}>In Progress</option>
        <option ${ticket.status === "Resolved" ? "selected" : ""}>Resolved</option>
      </select>
    `;
    grid.appendChild(div);
  });

  container.appendChild(grid);
}

const form = document.getElementById("ticketForm");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const date = new Date().toLocaleDateString();

    localStorage.setItem("currentUser", name);

    await saveTicket({
      name,
      department,
      title,
      description,
      priority,
      date,
      status: "Open"
    });

    document.getElementById("success-message").textContent = "Application Submitted!";
    setTimeout(() => {
      document.getElementById("success-message").textContent = "";
    }, 3000);

    this.reset();
    renderUserTickets();
  });
}

if (isAdmin) {
  renderAdminTickets();
} else {
  window.addEventListener("load", renderUserTickets);
  document.getElementById("name")?.addEventListener("input", renderUserTickets);
}
