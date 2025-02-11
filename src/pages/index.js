import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  toggleButtonState,
} from "../scripts/validation.js";
import Api from "../utils/API.js";

// Import images
import logoSrc from "../images/Logo.svg";
import pencilSrc from "../images/pencil.svg";
import plusSrc from "../images/plus.svg";

// Function to update image sources dynamically
const updateImageSrc = (selector, src) => {
  const element = document.querySelector(selector);
  if (element) element.src = src;
};

updateImageSrc("#top-logo", logoSrc);
updateImageSrc("#pencil-img", pencilSrc);
updateImageSrc("#plus-img", plusSrc);

// Modal handling
const openModal = (modal) => {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
};

const closeModal = (modal) => {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
};

const handleEscapeKey = (event) => {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
};

// Selectors
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
  avatarPic: document.querySelector("#avatar-pic"),
};

// API Instance
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c16e16d6-257f-4d48-ba25-11e7e07c89e9",
    "Content-Type": "application/json",
  },
});

// Fetch and render initial data
api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    selectors.profileName.textContent = userInfo.name;
    selectors.profileDescription.textContent = userInfo.about;
    selectors.avatarPic.src = userInfo.avatar;

    cards.forEach((card) => renderCard(card, "append"));
  })
  .catch(console.error);

// Selectors for the avatar modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarEditButton = document.querySelector(".profile__avatar-btn");
const avatarForm = document.querySelector("#edit-avatar-form");

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  const avatarInput = document.querySelector("#profile-avatar-input").value;

  api
    .updateUserAvatar({ avatar: avatarInput })
    .then((updatedUserInfo) => {
      selectors.avatarPic.src = updatedUserInfo.avatar;
      closeModal(avatarModal);
      resetFormAndButton(avatarForm);
    })
    .catch(console.error);
};

// Reset form and button state
const resetFormAndButton = (form) => {
  form.reset();
  const inputList = [...form.querySelectorAll(settings.inputSelector)];
  const buttonElement = form.querySelector(settings.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, settings);
  resetValidation(form, settings);
};

let selectedCard = null;
let selectedCardId = null;
const deleteModal = document.querySelector("#delete-modal");

const handleDeleteCard = (cardElement, cardId) => {
  if (!cardId) {
    console.error("Card ID is invalid:", cardId);
    return;
  }

  selectedCard = cardElement;
  selectedCardId = cardId;

  console.log("Preparing to delete card with ID:", cardId);

  openModal(deleteModal);
};

const deleteForm = document.querySelector("#add-card-form");
const cancelDeleteButton = document.querySelector(".modal__submit-btn--cancel");

// Create and render a card
const createCardElement = ({ name, link, _id, likes = [] }) => {
  const cardElement = selectors.cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  if (deleteButton) {
    deleteButton.addEventListener("click", () =>
      handleDeleteCard(cardElement, _id)
    );
  }

  if (cardImage) {
    Object.assign(cardImage, { src: link, alt: name });
  }

  if (cardTitle) {
    cardTitle.textContent = name;
  }

  if (likeCount) {
    likeCount.textContent = likes.length;
  }

  if (likeButton) {
    // Check if already liked
    if (likes.some((user) => user._id === "YOUR_USER_ID")) {
      likeButton.classList.add("card__like-button_active");
    }

    likeButton.addEventListener("click", () => {
      const isLiked = likeButton.classList.contains("card__like-button_active");
      const apiCall = isLiked ? api.removeLike(_id) : api.addLike(_id);

      apiCall
        .then((updatedCard) => {
          likeButton.classList.toggle("card__like-button_active");
          if (likeCount) likeCount.textContent = updatedCard.likes.length;
        })
        .catch(console.error);
    });
  }

  cardImage.addEventListener("click", () => openPreviewModal(link, name));

  return cardElement;
};

const renderCard = (item, method = "prepend") => {
  selectors.cardsContainer[method](createCardElement(item));
};

// Open preview modal
const openPreviewModal = (imageSrc, imageAlt) => {
  Object.assign(selectors.previewImage, { src: imageSrc, alt: imageAlt });
  selectors.previewCaption.textContent = imageAlt;
  openModal(selectors.previewModal);
};

// Handle profile form submission
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const saveButton = document.querySelector(".modal__submit-btn");
  const deleteButton = document.querySelector(".modal__submit-btn--delete");
  saveButton.textContent = "Saving..."; // Change text to "Saving"
  deleteButton.textContent = "Deleting...";

  api
    .editUserInfo({
      name: selectors.nameInput.value,
      about: selectors.jobInput.value,
    })
    .then((updatedUserInfo) => {
      selectors.profileName.textContent = updatedUserInfo.name;
      selectors.profileDescription.textContent = updatedUserInfo.about;
      closeModal(selectors.editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      saveButton.textContent = "Save"; // Change text back to "Save"
      deleteButton.textContent = "Delete";
    });
};

cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteModal); // Close the delete modal
});

// Handle card form submission
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const cardName = selectors.cardForm.querySelector(
    "#add-card-name-input"
  ).value;
  const cardLink = selectors.cardForm.querySelector(
    "#add-card-link-input"
  ).value;

  renderCard(
    { name: cardName, link: cardLink, _id: Date.now().toString(), likes: [] },
    "prepend"
  );

  closeModal(selectors.cardModal);
  resetFormAndButton(selectors.cardForm);
};

// Event Listeners
avatarEditButton.addEventListener("click", () => openModal(avatarModal));
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
selectors.profileForm.addEventListener("submit", handleProfileFormSubmit);
selectors.cardForm.addEventListener("submit", handleCardFormSubmit);
selectors.profileEditButton.addEventListener("click", () =>
  openModal(selectors.editProfileModal)
);
selectors.cardAddButton.addEventListener("click", () =>
  openModal(selectors.cardModal)
);

enableValidation(settings);

const handleDeleteSubmit = (event) => {
  event.preventDefault();

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove(); // Remove the card from the DOM
      closeModal(deleteModal); // Close the modal
    })
    .catch((err) => {
      console.error(`Error deleting card: ${err}`);
    });
};

deleteForm.addEventListener("submit", handleDeleteSubmit);

// Modal Close Events
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal
      .querySelector(".modal__close")
      .addEventListener("click", () => closeModal(modal));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", handleEscapeKey);
});
