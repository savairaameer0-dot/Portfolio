// script.js
// this is the file I touch pretty much every day.
// new devlog entry goes on top of the array, then commit + push.

const devlog = [
  {
    day: "Day 1",
    title: "Started the build-in-public portfolio",
    detail: "Got the basic structure up — terminal-style hero, devlog section, nothing fancy yet. Next up: real skills list and an actual project instead of placeholder text."
  }

];

const stack = ["HTML", "CSS", "JavaScript"];


const projects = [
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
