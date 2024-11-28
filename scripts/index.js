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

const openModal = (modal) => modal.classList.add("modal_opened");
const closeModal = (modal) => modal.classList.remove("modal_opened");

function renderCard(item, method = "prepend") {
  const cardElement = createCardElement(item);
  if (typeof selectors.cardsContainer[method] === "function") {
    selectors.cardsContainer[method](cardElement);
  } else {
    console.error(`Invalid method: ${method}. Use "prepend" or "append".`);
  }
}

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  selectors.profileName.textContent = selectors.nameInput.value;
  selectors.profileDescription.textContent = selectors.jobInput.value;
  closeModal(selectors.editProfileModal);
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const cardName = selectors.cardForm.querySelector(
    "#add-card-name-input"
  ).value;
  const cardLink = selectors.cardForm.querySelector(
    "#add-card-link-input"
  ).value;

  renderCard({ name: cardName, link: cardLink });

  closeModal(selectors.cardModal);
  selectors.cardForm.reset();
};

const renderInitialCards = () => {
  initialCards.forEach((cardData) => renderCard(cardData, "append"));
};

const createCardElement = (data) => {
  const cardElement = selectors.cardTemplate.cloneNode(true);
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
    const card = event.target.closest(".card");
    if (card) card.remove();
  });

  cardImage.addEventListener("click", () => {
    openPreviewModal(data.link, data.name);
  });

  return cardElement;
};

const openPreviewModal = (imageSrc, imageAlt) => {
  selectors.previewImage.src = imageSrc;
  selectors.previewImage.alt = imageAlt;
  selectors.previewCaption.textContent = imageAlt;
  openModal(selectors.previewModal);
};

selectors.profileForm.addEventListener("submit", handleProfileFormSubmit);
selectors.cardForm.addEventListener("submit", handleCardFormSubmit);
selectors.profileEditButton.addEventListener("click", () => {
  selectors.nameInput.value = selectors.profileName.textContent;
  selectors.jobInput.value = selectors.profileDescription.textContent;
  openModal(selectors.editProfileModal);
});
selectors.cardAddButton.addEventListener("click", () =>
  openModal(selectors.cardModal)
);
selectors.previewModal.addEventListener("click", (event) => {
  if (event.target === selectors.previewModal)
    closeModal(selectors.previewModal);
});

selectors.editProfileModal
  .querySelector(".modal__close")
  .addEventListener("click", () => closeModal(selectors.editProfileModal));
selectors.cardModal
  .querySelector(".modal__close")
  .addEventListener("click", () => closeModal(selectors.cardModal));
selectors.previewModal
  .querySelector(".modal__close")
  .addEventListener("click", () => closeModal(selectors.previewModal));

renderInitialCards();
