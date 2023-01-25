import "normalize.css/normalize.css";
import "./style.css";

const container = document.querySelector("main");
const addCardButton = container.querySelector("button");
const colorPalette = ["purple", "green", "yellow", "lime", "orange", "magenta", "oceanblue", "red", "cyan"];
const hintPalette = ["purple", "green", "lime", "magenta", "oceanblue", "red", "cyan"];
var currentColor;

const hintButton = document.querySelector(".hint");
const hintOverlay = document.querySelector(".overlay");
const hintBox = document.querySelector(".cmd-list");

// Cards

container.addEventListener("change", e => {
  if (e.target.tagName.toLowerCase() != "textarea") return;

  const id = e.target.id;
  const value = e.target.value;

  const cards = getCards();
  const target = cards.filter(card => card.id == id)[0];

  target.content = value;

  setCards(cards);
});

container.addEventListener("click", e => {
  // Delete Card
  if (e.ctrlKey && e.target.tagName.toLowerCase() == "textarea") {
    const doDelete = confirm("Tem certeza de que deseja excluir este sticky note?");

    if (doDelete) {
      const id = e.target.id;
      const card = e.target;

      const cards = getCards().filter(card => card.id != id);

      setCards(cards);

      container.removeChild(card);
    }

    return;
  }

  if (e.shiftKey && e.target.tagName.toLowerCase() == "button") {
    randomizeCardButtonColor();
    return;
  }

  // Add New Card
  if (e.target.tagName.toLowerCase() == "button") {
    const cards = getCards();
    const cardObject = {
      id: Date.now(),
      color: currentColor,
      content: "",
    };

    const cardElement = createCardElement(cardObject.id, cardObject.color, cardObject.content);

    randomizeCardButtonColor();
    container.insertBefore(cardElement, addCardButton);

    cards.push(cardObject);

    setCards(cards);
    return;
  }
});

function getCards() {
  return JSON.parse(localStorage.getItem("sticky-notes") || "[]");
}

function setCards(cards) {
  localStorage.setItem("sticky-notes", JSON.stringify(cards));
}

function createCardElement(id, color, content) {
  const card = document.createElement("textarea");

  card.draggable = true;
  card.classList.add("card");
  card.classList.add(color);
  card.value = content;
  card.placeholder = "Sticky Note Vazio";
  card.id = id;

  return card;
}

function randomizeCardButtonColor() {
  currentColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

  addCardButton.classList.toggle("purple", currentColor == "purple");
  addCardButton.classList.toggle("green", currentColor == "green");
  addCardButton.classList.toggle("yellow", currentColor == "yellow");
  addCardButton.classList.toggle("lime", currentColor == "lime");
  addCardButton.classList.toggle("orange", currentColor == "orange");
  addCardButton.classList.toggle("magenta", currentColor == "magenta");
  addCardButton.classList.toggle("oceanblue", currentColor == "oceanblue");
  addCardButton.classList.toggle("red", currentColor == "red");
  addCardButton.classList.toggle("cyan", currentColor == "cyan");
}

// Draggable

container.addEventListener("dragstart", e => {
  e.target.classList.add("dragging");
});

container.addEventListener("dragend", e => {
  e.target.classList.remove("dragging");

  const cards = [];

  [...container.querySelectorAll(".card")].forEach(card => {
    cards.push({
      id: card.id,
      color: card.className.replace("card", "").trim(),
      content: card.value,
    });
  });

  setCards(cards);
});

container.addEventListener("dragover", e => {
  e.preventDefault();

  const draggingCard = container.querySelector(".dragging");
  const targetCard = e.target;
  const targetCardPos = targetCard.getBoundingClientRect();

  if (targetCard.tagName.toLowerCase() == "main") return;
  if (targetCard.tagName.toLowerCase() == "button") {
    container.insertBefore(draggingCard, targetCard);
  } else if ((e.clientX - targetCardPos.left) / (targetCardPos.right - targetCardPos.left) > 0.5) {
    targetCard.parentNode.insertBefore(draggingCard, targetCard.nextSibling);
  } else {
    container.insertBefore(draggingCard, targetCard);
  }
});

// Boot code

document.querySelector(".hint").classList.add(hintPalette[Math.floor(Math.random() * hintPalette.length)]);
document.querySelector(".cmd-list").classList.add(hintPalette[Math.floor(Math.random() * hintPalette.length)]);

randomizeCardButtonColor();

getCards().forEach(card => {
  const cardElement = createCardElement(card.id, card.color, card.content);
  container.insertBefore(cardElement, addCardButton);
});

hintButton.addEventListener("click", () => {
  hintBox.style.display = "flex";
  hintOverlay.style.display = "block";
  hintBox.querySelector("button").addEventListener(
    "click",
    () => {
      hintBox.style.display = "none";
      hintOverlay.style.display = "none";
    },
    { once: true },
  );
  hintOverlay.addEventListener(
    "click",
    () => {
      hintBox.style.display = "none";
      hintOverlay.style.display = "none";
    },
    { once: true },
  );
});
