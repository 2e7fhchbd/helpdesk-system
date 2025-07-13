
const isAdmin = window.location.pathname.includes("admin");

function getTickets() {
  return JSON.parse(localStorage.getItem("tickets") || "[]");
}

function saveTickets(tickets) {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

function renderUserTickets() {
  const container = document.getElementById("userTickets");
  const username = document.getElementById("name")?.value || localStorage.getItem("currentUser");
  if (!container || !username) return;

  const tickets = getTickets().filter(t => t.name === username);
  container.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "tickets-grid";
  tickets.forEach(ticket => {
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

function renderAdminTickets() {
  const container = document.getElementById("adminTickets");
  if (!container) return;

  const tickets = getTickets();
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
      <select onchange="updateStatus(${ticket.id}, this.value)">
        <option ${ticket.status === "Open" ? "selected" : ""}>Open</option>
        <option ${ticket.status === "In Progress" ? "selected" : ""}>In Progress</option>
        <option ${ticket.status === "Resolved" ? "selected" : ""}>Resolved</option>
      </select>
    `;
    grid.appendChild(div);
  });

  container.appendChild(grid);
}

function updateStatus(id, newStatus) {
  const tickets = getTickets();
  // Convert id to number to avoid type mismatch
  const ticketId = Number(id);

  const ticket = tickets.find(t => Number(t.id) === ticketId);
  if (ticket) {
    ticket.status = newStatus;
    saveTickets(tickets);
    renderAdminTickets();
  }
}

const form = document.getElementById("ticketForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tickets = getTickets();
    const id = Date.now();
    const name = document.getElementById("name").value.trim();
    localStorage.setItem("currentUser", name);     
    const department = document.getElementById("department").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const date = new Date().toLocaleDateString();

    tickets.push({
      id,
      name,
      department,
      title,
      description,
      priority,
      date,
      status: "Open"
    });

    saveTickets(tickets);
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
