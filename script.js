// pulling devlog straight from my github commits now instead of
// typing it out every day. no auth needed since the repos are public,
// github's rest api just works for this.

const GH_USERNAME = "savairaameer0-dot";
const GH_REPOS = ["Portfolio", "-Ai-interior-design-assistant", "Expense-Tracker", "portfolio-backend"];

const stack = [
  "HTML", "CSS", "JavaScript",
  // add more as i pick them up
];

async function getProjectInfo(repo) {
  const res = await fetch(`https://api.github.com/repos/${GH_USERNAME}/${repo}`);
  if (!res.ok) {
    console.log("couldn't grab info for", repo);
    return null;
  }
  const data = await res.json();
  return {
    name: data.name.replace(/^-/, ""),
    description: data.description || "no description yet",
    language: data.language,
    url: data.html_url,
    updated: data.pushed_at
  };
}

async function loadProjects() {
  const results = [];
  for (const repo of GH_REPOS) {
    const info = await getProjectInfo(repo);
    if (info) results.push(info);
  }
  results.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  return results;
}

const links = {
  github: "https://github.com/savairaameer0-dot",
  email: "mailto:savairaameer0@gmail.com"
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function getCommitsFor(repo) {
  const res = await fetch(`https://api.github.com/repos/${GH_USERNAME}/${repo}/commits?per_page=10`);
  if (!res.ok) {
    console.log("couldn't grab commits for", repo);
    return [];
  }
  const data = await res.json();
  return data.map(c => ({
    repo: repo,
    message: c.commit.message.split("\n")[0],
    date: c.commit.author.date,
    url: c.html_url
  }));
}

async function loadDevlog() {
  let allCommits = [];
  for (const repo of GH_REPOS) {
    const commits = await getCommitsFor(repo);
    allCommits = allCommits.concat(commits);
  }
  allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
  return allCommits;
}

function renderLog(commits) {
  const list = document.getElementById("log-list");
  list.innerHTML = commits.slice(0, 15).map(entry => `
    <div class="log-entry">
      <div class="log-day">${formatDate(entry.date)}</div>
      <div class="log-content">
        <h3>${entry.message}</h3>
        <p>${entry.repo.replace(/^-/, "")} — <a href="${entry.url}" target="_blank">view commit</a></p>
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
  document.getElementById("link-email").href = links.email;
}

function renderDaysCounter(commits) {
  document.getElementById("days-counter").textContent = `${commits.length} commit(s) logged so far.`;
}

async function start() {
  renderStack();
  renderLinks();
  const commits = await loadDevlog();
  renderLog(commits);
  renderDaysCounter(commits);
  const projectList = await loadProjects();
  renderProjects(projectList);
}
start();

// chat widget — just keyword matching against the data above,
// no model or api call behind it
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
    return "hey — ask me about my skills, projects, or how to get in touch.";
  }
  if (text.includes("skill") || text.includes("stack") || text.includes("tech")) {
    return `right now i'm working with ${stack.join(", ")}.`;
  }
  if (text.includes("project")) {
    const names = projects.map(p => p.name).join(", ");
    return `so far i've built: ${names}. scroll up to the projects section for details.`;
  }
  if (text.includes("contact") || text.includes("email") || text.includes("reach")) {
    return "easiest way to reach me is the contact section above — github and email are both linked there.";
  }
  if (text.includes("hire") || text.includes("job") || text.includes("opportun")) {
    return "i'm open to opportunities right now — best way in is through the contact section.";
  }
  if (text.includes("devlog") || text.includes("progress") || text.includes("day")) {
    return "devlog pulls straight from my github commits now — check the section above for the full log.";
  }
  if (text.includes("thank")) {
    return "no problem! anything else you want to know?";
  }
  return "i'm just a simple keyword bot for now — try asking about skills, projects, the devlog, or how to contact me.";
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
    addMessage("hey, i'm the assistant for this site. ask me about skills, projects, or how to get in touch.", "bot");
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

// contact form posts straight to formspree, no backend needed for this
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
