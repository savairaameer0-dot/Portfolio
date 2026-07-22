// script.js — the file I actually touch every day.
// New devlog entry goes on top, then commit + push.

const devlog = [
  {
    day: "Day 2",
    title: "Built a portfolio assistant chatbox",
    detail: "Added a rule-based chat widget that answers visitor questions about my skills, projects, and how to get in touch — all client-side, no backend yet."
  },
  {
    day: "Day 1",
    title: "Started the build-in-public portfolio",
    detail: "Got the basic structure up — terminal-style hero, devlog section, nothing fancy yet. Next up: real skills list and an actual project instead of placeholder text."
  }
  // newest entries go above this line
  // { day: "Day 3", title: "...", detail: "..." },
];

const stack = ["HTML", "CSS", "JavaScript"];
// add stuff here as you actually learn/use it — React, Node, whatever's next

const projects = [
  {
    name: "Portfolio Assistant (chatbox)",
    description: "A rule-based chat widget in the bottom-right corner that answers questions about my skills, projects, and how to reach me.",
    tags: ["JavaScript", "DOM"]
  },
  {
    name: "This portfolio",
    description: "The site you're on right now. Built and updated as I go.",
    tags: ["HTML", "CSS", "JS"]
  }
];

const links = {
  github: "https://github.com/savairaameer0-dot",
  email: "mailto:savairaameer0@gmail.com"
};

function renderLog() {
  const list = document.getElementById("log-list");
  let html = "";
  for (const entry of devlog) {
    html += `
      <div class="log-entry">
        <div class="log-day">${entry.day}</div>
        <div class="log-content">
          <h3>${entry.title}</h3>
          <p>${entry.detail}</p>
        </div>
      </div>`;
  }
  list.innerHTML = html;
}

function renderStack() {
  const grid = document.getElementById("stack-grid");
  grid.innerHTML = stack.map(item => `<div class="stack-item">${item}</div>`).join("");
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  grid.innerHTML = projects.map(p => {
    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join("");
    return `
      <div class="project-card">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        ${tags}
      </div>`;
  }).join("");
}

function renderLinks() {
  document.getElementById("link-github").href = links.github;
  document.getElementById("link-email").href = links.email;
}

function renderDaysCounter() {
  const el = document.getElementById("days-counter");
  el.textContent = devlog.length === 1
    ? "1 day logged so far."
    : `${devlog.length} days logged so far.`;
}

renderLog();
renderStack();
renderProjects();
renderLinks();
renderDaysCounter();

// Portfolio assistant — rule-based chat widget.
// Pulls answers from the data above (stack, projects, devlog, links)
// so it stays in sync as I add more. Runs fully in the browser,
// no API key or backend needed yet.

const chatToggle = document.getElementById("chat-toggle");
const chatPanel = document.getElementById("chat-panel");
const chatClose = document.getElementById("chat-close");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

let chatOpened = false;

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "msg typing";
  typing.id = "typing-indicator";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function getBotReply(userText) {
  const text = userText.toLowerCase();

  if (/(hi|hello|hey)\b/.test(text)) {
    return "Hey! Ask me about my skills, projects, or how to get in touch.";
  }
  if (text.includes("skill") || text.includes("stack") || text.includes("tech")) {
    return `My current stack: ${stack.join(", ")}.`;
  }
  if (text.includes("project")) {
    const names = projects.map(p => p.name).join(", ");
    return `I've built: ${names}. Check the Projects section above for details.`;
  }
  if (text.includes("contact") || text.includes("email") || text.includes("reach")) {
    return "You can reach out via the Contact section above — GitHub and email are both there.";
  }
  if (text.includes("hire") || text.includes("job") || text.includes("opportun")) {
    return "I'm actively open to opportunities! Best way in is through the Contact section — GitHub or email.";
  }
  if (text.includes("devlog") || text.includes("progress") || text.includes("day")) {
    return `I'm on ${devlog.length} day(s) of building in public so far — check the Devlog section for the full log.`;
  }
  if (text.includes("thank")) {
    return "You're welcome! Anything else you'd like to know?";
  }
  return "I'm a simple rule-based assistant for now — try asking about my skills, projects, devlog, or how to contact me.";
}

function handleUserMessage(text) {
  addMessage(text, "user");
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage(getBotReply(text), "bot");
  }, 700 + Math.random() * 500);
}

chatToggle.addEventListener("click", () => {
  chatPanel.hidden = !chatPanel.hidden;
  if (!chatOpened && !chatPanel.hidden) {
    chatOpened = true;
    addMessage("Hi! I'm this portfolio's assistant. Ask me about skills, projects, or how to get in touch.", "bot");
  }
});

chatClose.addEventListener("click", () => {
  chatPanel.hidden = true;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  handleUserMessage(text);
});
