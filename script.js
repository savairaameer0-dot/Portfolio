// =========================================================
// EDIT THIS FILE EVERY DAY. Add one new entry to `devlog`
// at the TOP of the array, commit, and push. That's it —
// that's your daily contribution.
// =========================================================

const devlog = [
  {
    day: "Day 3",
    title: "Added a working contact form",
    detail: "Wired up the contact form using Formspree so visitors can message me directly, with real success/error feedback instead of a page reload."
  },
  {
    day: "Day 2",
    title: "Built a portfolio assistant chatbox",
    detail: "Added a rule-based chat widget that answers visitor questions about my skills, projects, and how to get in touch — all client-side, no backend yet."
  },
  {
    day: "Day 1",
    title: "Started the build-in-public portfolio",
    detail: "Set up the site structure, terminal-style hero, and devlog section. Tomorrow: fill in real skills and first project."
  }
  // Add new entries above this line, newest first, e.g.:
  // { day: "Day 3", title: "...", detail: "..." },
];

const stack = [
  "HTML", "CSS", "JavaScript",
  // add more as you learn them, e.g. "React", "Node.js", "Express", "MongoDB", "Git"
];

const projects = [
  {
    name: "Portfolio Assistant (chatbox)",
    description: "A rule-based chat widget (bottom-right corner) that answers questions about my skills, projects, and how to reach me.",
    tags: ["JavaScript", "DOM"]
  },
  {
    name: "This portfolio",
    description: "The site you're looking at right now — built and updated daily.",
    tags: ["HTML", "CSS", "JS"]
  }
  // add real projects here as you build them:
  // { name: "Project Name", description: "What it does.", tags: ["Tech1", "Tech2"] }
];

const links = {
  github: "https://github.com/YOUR-USERNAME",
  linkedin: "https://linkedin.com/in/YOUR-USERNAME",
  email: "mailto:you@example.com"
};

// =========================================================
// Rendering logic below — no need to touch this part
// =========================================================

function renderLog() {
  const list = document.getElementById("log-list");
  list.innerHTML = devlog.map(entry => `
    <div class="log-entry">
      <div class="log-day">${entry.day}</div>
      <div class="log-content">
        <h3>${entry.title}</h3>
        <p>${entry.detail}</p>
      </div>
    </div>
  `).join("");
}

function renderStack() {
  const grid = document.getElementById("stack-grid");
  grid.innerHTML = stack.map(item => `<div class="stack-item">${item}</div>`).join("");
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
    </div>
  `).join("");
}

function renderLinks() {
  document.getElementById("link-github").href = links.github;
  document.getElementById("link-linkedin").href = links.linkedin;
  document.getElementById("link-email").href = links.email;
}

function renderDaysCounter() {
  document.getElementById("days-counter").textContent = `${devlog.length} day(s) logged so far.`;
}

renderLog();
renderStack();
renderProjects();
renderLinks();
renderDaysCounter();

// =========================================================
// Portfolio Assistant — a rule-based "AI-style" chat widget.
// It answers using the data already defined above (stack,
// projects, devlog, links) so it stays in sync automatically
// as you add more entries. No API key needed, runs fully
// in the browser. Swap in a real LLM API later once you
// add a backend.
// =========================================================

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
    return "You can reach out via the Contact section above — links to GitHub, LinkedIn, and email are all there.";
  }
  if (text.includes("hire") || text.includes("job") || text.includes("opportun")) {
    return "I'm actively open to opportunities! Best way in is through the Contact section — GitHub, LinkedIn, or email.";
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

// =========================================================
// Contact form — sends via Formspree (no backend needed).
// Replace the form's `action` URL in index.html with your
// own Formspree endpoint: https://formspree.io/f/YOUR_FORM_ID
// =========================================================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".form-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.hidden = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        formStatus.textContent = "Message sent — thanks for reaching out!";
        formStatus.className = "form-status success";
        contactForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please try again.";
        formStatus.className = "form-status error";
      }
    } catch (err) {
      formStatus.textContent = "Network error. Please try again.";
      formStatus.className = "form-status error";
    } finally {
      formStatus.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
}
