interface Event {
  id: number;
  name: string;
  description: string;
  slug: string;
  date: string;
  categoryId: number;
  location: string;
  cost: number;
  img: string;
}

interface ApiResponse {
  data: Event[];
}

const API_URL = "https://cse-211-final-project-group12.vercel.app/api/events";
let allEvents: Event[] = [];
let currentEvent: Event | null = null;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function fetchEvents(): Promise<void> {
  const loading = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const tableContainer = document.getElementById("tableContainer");

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const result: ApiResponse = await response.json();

    allEvents = (result.data || []).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    renderTable();
    loading?.classList.add("hidden");
    tableContainer?.classList.remove("hidden");
  } catch (err) {
    loading?.classList.add("hidden");
    errorEl?.classList.remove("hidden");
    const msg = document.getElementById("errorMessage");
    if (msg) msg.textContent = "Unable to connect to the Event-X server.";
  }
}

function renderTable(): void {
  const tbody = document.getElementById("eventsBody");
  const count = document.getElementById("resultCount");
  if (!tbody) return;

  if (count) count.textContent = allEvents.length.toString();
  tbody.innerHTML = "";

  allEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.className = "group border-b border-white/[0.03] hover:bg-white/[0.02] transition-all cursor-pointer";

    row.innerHTML = `
      <td class="px-6 py-5">
        <div class="flex items-center space-x-4">
          <div class="h-12 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-800 border border-white/10 shadow-lg">
            <img src="${event.img}" alt="${event.name}" class="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                 onerror="this.src='https://placehold.co/400x300/111827/50a2ff?text=Event'">
          </div>
          <div>
            <span class="block text-sm font-bold text-white group-hover:text-[#50a2ff] transition-colors leading-tight">
              ${escapeHtml(event.name)}
            </span>
            <span class="text-[10px] text-gray-500 uppercase tracking-widest font-bold lg:hidden">
              ${event.location}
            </span>
          </div>
        </div>
      </td>
      <td class="px-6 py-5">
        <span class="text-xs font-mono text-gray-400">
          ${formatDate(event.date)}
        </span>
      </td>
      <td class="px-6 py-5 hidden md:table-cell">
        <div class="flex items-center text-xs text-gray-400">
          <svg class="w-3 h-3 mr-2 text-[#50a2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/></svg>
          ${escapeHtml(event.location)}
        </div>
      </td>
      <td class="px-6 py-5">
        <span class="text-sm font-black text-white">
          ${event.cost.toLocaleString()} <span class="text-[10px] text-gray-500 font-bold ml-1">EGP</span>
        </span>
      </td>
      <td class="px-6 py-5 text-right">
        <button class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white border border-white/10 group-hover:border-[#50a2ff] px-4 py-2 rounded-lg transition-all">
          Details
        </button>
      </td>
    `;

    row.onclick = () => openModal(event);
    tbody.appendChild(row);
  });
}

function openModal(event: Event): void {
  currentEvent = event;
  const modal = document.getElementById("eventModal");
  if (modal) {
    document.getElementById("modalTitle")!.textContent = event.name;
    document.getElementById("modalDescription")!.textContent = event.description;
    document.getElementById("modalDate")!.textContent = formatDate(event.date);
    document.getElementById("modalLocation")!.textContent = event.location;
    document.getElementById("modalCost")!.textContent = `${event.cost.toLocaleString()} EGP`;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(): void {
  const modal = document.getElementById("eventModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("closeModal")?.addEventListener("click", closeModal);
  document.getElementById("registerBtn")?.addEventListener("click", () => {
    if (currentEvent) window.location.href = `/pages/registration.html?id=${currentEvent.id}`;
  });
  
  const modal = document.getElementById("eventModal");
  modal?.addEventListener("click", (e) => e.target === modal && closeModal());
  
  fetchEvents();
});