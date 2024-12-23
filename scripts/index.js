// Open and close modal functions
const openModal = (modal) => {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
};

const closeModal = (modal) => {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
};

// Handle Escape key for closing modals
const handleEscapeKey = (event) => {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
};

// Initial card data
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Landscape",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

// DOM selectors
const selectors = {
  profileEditButton: document.querySelector(".profile__edit-btn"),
  cardAddButton: document.querySelector(".profile__add-btn"),
  profileName: document.querySelector(".profile__name"),
  profileDescription: document.querySelector(".profile__description"),
  profileForm: document.querySelector(".modal__form"),
  nameInput: document.querySelector("#profile-name-input"),
  jobInput: document.querySelector("#profile-description-input"),
  editProfileModal: document.querySelector("#edit-profile-modal"),
  cardModal: document.querySelector("#add-card-modal"),
  cardForm: document.querySelector("#add-card-form"),
  cardTemplate: document.querySelector("#card-template").content,
  cardsContainer: document.querySelector(".cards"),
  previewModal: document.querySelector("#preview-modal"),
  previewImage: document.querySelector(".modal__image"),
  previewCaption: document.querySelector(".modal__caption"),
};

// Handle card form submission
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const cardName = selectors.cardForm.querySelector(
    "#add-card-name-input"
  ).value;
  const cardLink = selectors.cardForm.querySelector(
    "#add-card-link-input"
  ).value;

  renderCard({ name: cardName, link: cardLink }, "prepend");

  closeModal(selectors.cardModal);

  resetFormAndButton(selectors.cardForm); // Reset form and button state
};

// Reset the form and button state
const resetFormAndButton = (form) => {
  form.reset();

  const inputList = Array.from(form.querySelectorAll(settings.inputSelector));
  const buttonElement = form.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, settings); // Toggle button state
  resetValidation(form, settings); // Reset validation states
};

// Create a card element
const createCardElement = ({ name, link }) => {
  const cardElement = selectors.cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  likeButton.addEventListener("click", () =>
    likeButton.classList.toggle("card__like-button_active")
  );

  deleteButton.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (card) card.remove();
  });

  cardImage.addEventListener("click", () => openPreviewModal(link, name));

  return cardElement;
};

// Render a card to the DOM
const renderCard = (item, method = "prepend") => {
  const cardElement = createCardElement(item);
  selectors.cardsContainer[method](cardElement);
};

// Open preview modal
const openPreviewModal = (imageSrc, imageAlt) => {
  selectors.previewImage.src = imageSrc;
  selectors.previewImage.alt = imageAlt;
  selectors.previewCaption.textContent = imageAlt;
  openModal(selectors.previewModal);
};

// Handle profile form submission
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  selectors.profileName.textContent = selectors.nameInput.value;
  selectors.profileDescription.textContent = selectors.jobInput.value;
  closeModal(selectors.editProfileModal);
};

// Render initial cards
const renderInitialCards = () => {
  initialCards.forEach((card) => renderCard(card, "append"));
};

// Event listeners
selectors.profileForm.addEventListener("submit", handleProfileFormSubmit);
selectors.cardForm.addEventListener("submit", handleCardFormSubmit);

selectors.profileEditButton.addEventListener("click", () => {
  selectors.nameInput.value = selectors.profileName.textContent;
  selectors.jobInput.value = selectors.profileDescription.textContent;
  openModal(selectors.editProfileModal);
  resetValidation(selectors.profileForm, settings);
});

selectors.cardAddButton.addEventListener("click", () => {
  openModal(selectors.cardModal);
  selectors.cardForm.reset(); // Reset form inputs
  const inputList = Array.from(
    selectors.cardForm.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = selectors.cardForm.querySelector(
    settings.submitButtonSelector
  );
  toggleButtonState(inputList, buttonElement, settings);
});

// Add event listeners for modals
[
  selectors.editProfileModal,
  selectors.cardModal,
  selectors.previewModal,
].forEach((modal) => {
  modal
    .querySelector(".modal__close")
    .addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

// Initialize application
renderInitialCards();
