const CONFIG = {
  weddingDate: "2027-07-17T10:00:00+07:00",
  calendarStart: "20270717T100000",
  calendarEnd: "20270717T160000",
  calendarTitle: "The Wedding of Agustin & Ahmad Arifin",
  venue: "Lapangan PB Kemang, Gg. Sabar, Rangkapan Jaya, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16435",
  mapsUrl: "https://maps.app.goo.gl/fbhnJiMfCUA7Hio5A",
  appsScriptUrl: "https://script.google.com/macros/s/AKfycby7-0wLwLq2dIuH4Qyeqwt6ltcmjx5n4xNWf4YLIPWbNhBC37zMcn2yF3vEwxH8QZDx/exec"
};

const $ = (s) => document.querySelector(s);

function setupCalendar() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: CONFIG.calendarTitle,
    dates: `${CONFIG.calendarStart}/${CONFIG.calendarEnd}`,
    location: CONFIG.venue,
    ctz: "Asia/Jakarta"
  });
  $("#calendarLink").href = `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function updateCountdown() {
  const diff = new Date(CONFIG.weddingDate).getTime() - Date.now();
  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => $(`#${id}`).textContent = "00");
    return;
  }
  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  $("#days").textContent = String(days).padStart(2,"0");
  $("#hours").textContent = String(hours).padStart(2,"0");
  $("#minutes").textContent = String(minutes).padStart(2,"0");
  $("#seconds").textContent = String(seconds).padStart(2,"0");
}

function setupMusic() {
  const audio = $("#bgMusic");
  const btn = $("#musicToggle");
  const open = $("#openInvitation");

  const play = async () => {
    try {
      await audio.play();
      btn.classList.add("playing");
      btn.setAttribute("aria-pressed","true");
    } catch {}
  };
  open.addEventListener("click", async () => {
    await play();
    document.querySelector("#rsvp").scrollIntoView({behavior:"smooth"});
  });
  btn.addEventListener("click", async () => {
    if (audio.paused) await play();
    else {
      audio.pause();
      btn.classList.remove("playing");
      btn.setAttribute("aria-pressed","false");
    }
  });
}

async function submitRSVP(event) {
  event.preventDefault();
  const name = $("#guestName").value.trim();
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
  const message = $("#guestMessage").value.trim();
  const status = $("#formStatus");

  if (!name || !attendance || !message) {
    status.textContent = "Mohon lengkapi nama, kehadiran, dan ucapan.";
    return;
  }

  const button = event.submitter;
  button.disabled = true;
  status.textContent = "Mengirim RSVP…";

  try {
    const body = JSON.stringify({name, attendance, message});
    await fetch(CONFIG.appsScriptUrl, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body
    });
    status.textContent = "Terima kasih. RSVP dan ucapan kamu sudah terkirim. ♡";
    $("#rsvpForm").reset();
    setTimeout(loadWishes, 1200);
  } catch (err) {
    status.textContent = "RSVP belum terkirim. Silakan coba lagi.";
  } finally {
    button.disabled = false;
  }
}

function renderWishes(items) {
  const list = $("#wishesList");
  if (!items.length) {
    list.innerHTML = '<p class="muted centered">Belum ada ucapan. Jadilah yang pertama. ♡</p>';
    return;
  }
  list.innerHTML = items.slice().reverse().map(item => `
    <article class="wish">
      <strong>${escapeHtml(item.name)}</strong>
      <p>“${escapeHtml(item.message)}”</p>
    </article>
  `).join("");
}

async function loadWishes() {
  try {
    const response = await fetch(CONFIG.appsScriptUrl, {cache:"no-store"});
    const data = await response.json();
    if (Array.isArray(data)) renderWishes(data);
    else renderWishes([]);
  } catch {
    $("#wishesList").innerHTML = '<p class="muted centered">Ucapan akan tampil setelah koneksi Google Sheets tersedia.</p>';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

function setupCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.textContent;
        btn.textContent = "Copied ✓";
        setTimeout(() => btn.textContent = old, 1400);
      } catch {}
    });
  });
}

setupCalendar();
setupMusic();
setupCopyButtons();
$("#rsvpForm").addEventListener("submit", submitRSVP);
updateCountdown();
setInterval(updateCountdown, 1000);
loadWishes();
