"use strict";

/* All displayed content is a curated, source-linked public excerpt.
 * It is intentionally not a mirror of the private GitHub repository. */

const available = ["story","timeline","people","sources"];
const tabs = Array.from(document.querySelectorAll("[data-tab]"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));

function activate(name, updateHash) {
  if (!available.includes(name)) name = "story";
  tabs.forEach(function (button) {
    const active = button.dataset.tab === name;
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  panels.forEach(function (panel) {
    panel.hidden = panel.id !== name;
  });
  if (updateHash && location.hash !== "#" + name) {
    history.replaceState(null, "", "#" + name);
  }
}

tabs.forEach(function (tab, index) {
  tab.addEventListener("click", function () {
    activate(tab.dataset.tab, true);
  });
  tab.addEventListener("keydown", function (event) {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    activate(next.dataset.tab, true);
    next.focus();
  });
});

document.querySelectorAll("[data-tab-go],[data-tab-link]").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const target = link.dataset.tabGo || link.dataset.tabLink;
    activate(target, true);
    window.scrollTo({ top: document.querySelector(".tabs-wrap").offsetTop, behavior: "smooth" });
  });
});

window.addEventListener("hashchange", function () {
  const name = location.hash.substring(1);
  if (available.includes(name)) activate(name, false);
});

const starting = location.hash.substring(1);
activate(available.includes(starting) ? starting : "story", false);

/* Timeline filtering */
const chips = Array.from(document.querySelectorAll("[data-filter]"));
chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    const filter = chip.dataset.filter;
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
    document.querySelectorAll(".event").forEach(function (event) {
      event.hidden = filter !== "all" && event.dataset.group !== filter;
    });
  });
});

/* Small public layer-3 notes: deliberately selected rather than
 * pulling arbitrary private Markdown files into a public site. */
const notes = {
  arthur: {
    title: "Arthur Lazarus",
    body: [
      "Arthur was born in Stargard in 1886. In his memoir he tells of his mother’s early death and years of childhood spent with relatives. He later built a business career in Germany and married Käte in 1913.",
      "His recollection of the Dahlem family home is full of concrete details: gardens, fruit trees, school life and family holidays. After the Nazi rise in 1933, he and Käte began considering Palestine, leaving Germany in November 1936.",
      "The memoir ends in 1953 with gratitude for the family’s survival, mixed feelings about the country in which he lived, and a wish not to burden his children as he grew older."
    ],
    cite: "Arthur memoir, PDF pp. 2–3, 6, 14–20. Written 1953; translated into English in 2006."
  },
  kaete: {
    title: "Käte Lazarus",
    body: [
      "Käte, born in 1893, married Arthur in 1913. They raised Walter, Kurt and Brigitte. Her story in the surviving 1948 letters is first and foremost the story of being unable to reach family members while Jerusalem was isolated.",
      "She writes of spring, disrupted mail, worry for children and grandchildren, the enormous relief of receiving good news, and then the small return of everyday pleasures in June.",
      "The letters were originally in German and are preserved here through a Hebrew family translation produced in 2006. This public narrative paraphrases that translation rather than claiming to reproduce her original voice."
    ],
    cite: "Käte letters, PDF pp. 1–2, 31, 35–36; Arthur memoir, PDF pp. 6, 14–18."
  },
  dahlem: {
    title: "A home in Dahlem",
    body: [
      "Arthur and Käte moved into a house they had built in Dahlem, Berlin, in December 1922. Arthur describes a prosperous period in which the children played in a garden and the family could travel.",
      "A photograph shows the house in summer 1925. Another shows Käte with the children in 1924. Arthur’s chapter title for this period, written with knowledge of what followed, is 'Ever forward and upward to the downfall.'",
      "The family began planning their departure after 1933. Their life in the house remained part of the narrative they carried into exile."
    ],
    cite: "Arthur memoir, PDF pp. 14–17."
  },
  departure: {
    title: "Leaving Germany, 1933–1936",
    body: [
      "Arthur’s memoir marks April 1933 as the moment when he understood his children’s future in Germany was in danger. The children embarked on different training and education paths during the years that followed.",
      "In September 1933, Arthur and Käte sailed on the SS Roma to investigate Palestine as a potential new home. He remembers finding the climate and landscape unfamiliar, yet seeing a possible distance from persecution.",
      "He dates the family’s eventual departure to November 1936. That distinction matters: preparations began in 1933, emigration took place later. The account does not confirm that all family members moved on the same day."
    ],
    cite: "Arthur memoir, PDF pp. 16–17."
  },
  shaar: {
    title: "The house at Shaar Hefer",
    body: [
      "After the siege of Jerusalem, Arthur recalls that his sons, particularly Walter, encouraged the parents to move to Shaar Hefer. The new house was meant to offer peace.",
      "He writes that declining eyesight and age-related difficulties made rural life harder than expected and says Käte never entirely settled into it.",
      "There is a small archival mystery: what appears to be the same house photograph is dated 1950 in Arthur’s memoir and 1951 in the letters compilation. Both captions are preserved; neither date has been declared definitive."
    ],
    cite: "Arthur memoir, PDF p. 18; Käte letters, PDF p. 35."
  }
};

const detail = document.getElementById("note-detail");
document.querySelectorAll("[data-note]").forEach(function (button) {
  button.addEventListener("click", function () {
    const note = notes[button.dataset.note];
    if (!note) return;
    const paragraphs = note.body.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    detail.innerHTML = '<div class="label">Selected research note</div><h3>' +
      note.title + "</h3>" + paragraphs +
      '<div class="source-note">' + note.cite + "</div>";
    detail.hidden = false;
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
    detail.focus({ preventScroll: true });
  });
});

/* One-tap public URL sharing. No backend or tracking. */
const share = document.getElementById("share-button");
share.addEventListener("click", async function () {
  try {
    await navigator.clipboard.writeText(location.href);
    share.textContent = "Link copied ✓";
  } catch (error) {
    share.textContent = "Use your browser Share menu";
  }
});