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

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardAddButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileFormElement = document.querySelector(".modal__form");
const nameInput = document.querySelector("#profile-name-input");
const jobInput = document.querySelector("#profile-description-input");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editModalCloseButton =
  editProfileModal.querySelector(".modal__close-btn");
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardTemplate = document.querySelector("#card-template").content;
const cardsContainer = document.querySelector(".cards");
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__preview_close-btn"
);

// Modal utility functions
const openModal = (modal) => modal.classList.add("modal_opened");
const closeModal = (modal) => modal.classList.remove("modal_opened");

// Profile form handler
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editProfileModal);
};

// Card form handler
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const cardName = cardForm.querySelector("#add-card-name-input").value;
  const cardLink = cardForm.querySelector("#add-card-link-input").value;

  const newCard = createCardElement({ name: cardName, link: cardLink });
  cardsContainer.prepend(newCard);

  closeModal(cardModal);
  cardForm.reset();
};

// Render initial cards
const renderInitialCards = () => {
  initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData);
    cardsContainer.append(cardElement);
  });
};

// Create card element
const createCardElement = (data) => {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", (event) => {
    const cardToDelete = event.target.closest(".card");
    cardToDelete?.remove();
  });

  return cardElement;
};

// Open preview modal
const openPreviewModal = (imageSrc, imageAlt) => {
  previewImage.src = imageSrc;
  previewImage.alt = imageAlt;
  previewCaption.textContent = imageAlt;
  openModal(previewModal);
};

// Event listeners
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
profileEditButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfileModal);
});
editModalCloseButton.addEventListener("click", () =>
  closeModal(editProfileModal)
);
cardAddButton.addEventListener("click", () => openModal(cardModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
cardsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("card__image")) {
    openPreviewModal(event.target.src, event.target.alt);
  }
});
previewCloseButton.addEventListener("click", () => closeModal(previewModal));
previewModal.addEventListener("click", (event) => {
  if (event.target === previewModal) closeModal(previewModal);
});

// Initialize
renderInitialCards();
