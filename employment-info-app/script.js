// Employment Information App
// This file uses DOM manipulation to:
// - Read values from the form
// - Create new list items dynamically
// - Add event listeners for "complete" and "remove"
// - Update the page without reloading
//
// You should be able to explain these key ideas in class:
// - We select elements using getElementById()
// - We listen for events using addEventListener()
// - We create new DOM nodes using createElement()
// - We insert/remove nodes using appendChild(), prepend(), and remove()

// Get elements from the page using ids
const entryForm = document.getElementById("entryForm");
const entryList = document.getElementById("entryList");
const emptyState = document.getElementById("emptyState");

const categoryEl = document.getElementById("category");
const titleEl = document.getElementById("title");
const organizationEl = document.getElementById("organization");
const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const notesEl = document.getElementById("notes");
const photoUrlEl = document.getElementById("photoUrl");
const pdfUrlEl = document.getElementById("pdfUrl");
const clearButton = document.getElementById("clearButton");

function setEmptyStateVisibility() {
  // If there are no <li> items, show the empty message; otherwise hide it.
  emptyState.style.display = entryList.children.length === 0 ? "block" : "none";
}

function formatDates(startValue, endValue) {
  // Dates are stored as "YYYY-MM". We keep a simple display format here.
  const startLabel = startValue ? startValue : "Start: (not set)";
  const endLabel = endValue ? endValue : "End: (not set)";
  return `${startLabel} → ${endLabel}`;
}

function createEntryElement(entry) {
  // This function builds ONE entry card (<li>) completely in JavaScript.
  // That is "DOM manipulation": building HTML elements dynamically.

  const li = document.createElement("li");
  li.className = "item";

  // Left side: photo thumbnail (optional)
  const mediaWrapper = document.createElement("div");
  mediaWrapper.className = "media-wrapper";

  if (entry.photoUrl) {
    const img = document.createElement("img");
    img.src = entry.photoUrl;
    img.alt = `${entry.title} logo or related photo`;
    mediaWrapper.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "media-placeholder";
    placeholder.textContent = "No photo";
    mediaWrapper.appendChild(placeholder);
  }

  // Right side: the entry content
  const content = document.createElement("div");

  const meta = document.createElement("div");
  meta.className = "meta";

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = entry.category;

  const title = document.createElement("p");
  title.className = "title";
  title.textContent = entry.title;

  meta.appendChild(badge);
  meta.appendChild(title);

  const org = document.createElement("p");
  org.className = "org";
  org.textContent = entry.organization;

  const dates = document.createElement("p");
  dates.className = "dates";
  dates.textContent = formatDates(entry.startDate, entry.endDate);

  const notes = document.createElement("p");
  notes.className = "notes";
  notes.textContent = entry.notes ? entry.notes : "Notes: (none)";

  // Optional PDF/document link
  const links = document.createElement("div");
  links.className = "links";

  if (entry.pdfUrl) {
    const pdfLink = document.createElement("a");
    pdfLink.href = entry.pdfUrl;
    pdfLink.target = "_blank";
    pdfLink.rel = "noopener noreferrer";
    pdfLink.textContent = "View related document (PDF)";
    links.appendChild(pdfLink);
  }

  // Buttons: Complete/Undo + Remove
  const actions = document.createElement("div");
  actions.className = "item-actions";

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.className = "small complete";
  completeButton.textContent = "Complete";

  // This event listener runs when the user clicks the button.
  // It changes the DOM by toggling a CSS class on the <li>.
  completeButton.addEventListener("click", () => {
    li.classList.toggle("completed");
    completeButton.textContent = li.classList.contains("completed")
      ? "Undo"
      : "Complete";
  });

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "small remove";
  removeButton.textContent = "Remove";

  // This event listener removes the <li> from the page.
  removeButton.addEventListener("click", () => {
    li.remove();
    setEmptyStateVisibility();
  });

  actions.appendChild(completeButton);
  actions.appendChild(removeButton);

  // Assemble content
  content.appendChild(meta);
  content.appendChild(org);
  content.appendChild(dates);
  content.appendChild(notes);
  if (links.children.length > 0) content.appendChild(links);
  content.appendChild(actions);

  li.appendChild(mediaWrapper);
  li.appendChild(content);

  return li;
}

function clearForm() {
  // Clears the form inputs so the user can type a new entry quickly.
  categoryEl.value = "Work Experience";
  titleEl.value = "";
  organizationEl.value = "";
  startDateEl.value = "";
  endDateEl.value = "";
  notesEl.value = "";
  photoUrlEl.value = "";
  pdfUrlEl.value = "";
  titleEl.focus();
}

// When the user submits the form (click "Add entry" or press Enter)
entryForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevents the page from reloading

  const entry = {
    category: categoryEl.value.trim(),
    title: titleEl.value.trim(),
    organization: organizationEl.value.trim(),
    startDate: startDateEl.value,
    endDate: endDateEl.value,
    notes: notesEl.value.trim(),
    photoUrl: photoUrlEl.value.trim(),
    pdfUrl: pdfUrlEl.value.trim(),
  };

  // Basic validation: required fields are title + organization
  if (!entry.title || !entry.organization) return;

  const entryElement = createEntryElement(entry);
  entryList.prepend(entryElement);
  setEmptyStateVisibility();
  clearForm();
});

// Clear form button
clearButton.addEventListener("click", clearForm);

// Initial UI state
setEmptyStateVisibility();
