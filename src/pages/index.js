// ------------------- IMPORTS -------------------
import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  toggleButtonState,
} from "../scripts/validation.js";
import Api from "../utils/API.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

// ------------------- IMAGE UPDATES -------------------
import logoSrc from "../images/Logo.svg";
import pencilSrc from "../images/pencil.svg";
import plusSrc from "../images/plus.svg";

const updateImageSrc = (selector, src) => {
  const element = document.querySelector(selector);
  if (element) element.src = src;
};
updateImageSrc("#top-logo", logoSrc);
updateImageSrc("#pencil-img", pencilSrc);
updateImageSrc("#plus-img", plusSrc);

// ------------------- UTILITY FUNCTIONS -------------------
const isLikedByUser = (likes = []) =>
  Array.isArray(likes) &&
  likes.some((user) => user._id === "LOGGED_IN_USER_ID");

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
    const modal = document.querySelector(".modal_opened");
    if (modal) closeModal(modal);
  }
};

// ------------------- SELECTORS -------------------

const avatarInput = document.querySelector("#profile-avatar-input");
const cardNameInput = document.querySelector("#add-card-name-input");
const cardLinkInput = document.querySelector("#add-card-link-input");

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
  avatarModal: document.querySelector("#avatar-modal"),
  avatarPic: document.querySelector("#avatar-pic"),
  deleteModal: document.querySelector("#delete-modal"),
  cancelButton: document.querySelector(".modal__submit-btn--cancel"),
};

const avatarSaveButton =
  selectors.avatarModal.querySelector(".modal__submit-btn");
const cardSaveButton = selectors.cardForm.querySelector(".modal__submit-btn");
const profileSaveButton =
  selectors.profileForm.querySelector(".modal__submit-btn");

// ------------------- API INSTANCE -------------------
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9f30f391-d4f2-4310-8bf1-91aea0358dfd",
    "Content-Type": "application/json",
  },
});

// ------------------- FETCH & RENDER DATA -------------------
api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    console.log("Cards fetched:", cards);
    selectors.profileName.textContent = userInfo.name;
    selectors.profileDescription.textContent = userInfo.about;
    selectors.avatarPic.src = userInfo.avatar;
    cards.forEach((card) => renderCard(card, "append"));
  })
  .catch(console.error);

// ------------------- FORM HANDLERS -------------------
const resetFormAndButton = (form, submitButton = null) => {
  if (form && typeof form.reset === "function") {
    form.reset();
    const inputList = [...form.querySelectorAll(settings.inputSelector)];
    const button =
      submitButton || form.querySelector(settings.submitButtonSelector);

    if (!button) {
      console.error("Submit button not found in resetFormAndButton.");
      return;
    }

    toggleButtonState(inputList, button, settings);
    resetValidation(form, settings);
  } else {
    console.error("Invalid form element passed to resetFormAndButton.");
  }
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  const avatarUrl = avatarInput.value;
  const saveButton = selectors.avatarModal.querySelector(".modal__submit-btn");
  saveButton.textContent = "Saving...";
  saveButton.disabled = true;

  api
    .updateUserAvatar({ avatar: avatarUrl })
    .then((updatedUserInfo) => {
      selectors.avatarPic.src = updatedUserInfo.avatar;
      closeModal(selectors.avatarModal);
      resetFormAndButton(avatarForm);
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
      saveButton.disabled = false;
    })
    .catch(console.error)
    .finally(() => {
      saveButton.textContent = "Save";
    });
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const saveButton = document.querySelector(".modal__submit-btn");
  saveButton.textContent = "Saving...";

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
      saveButton.textContent = "Save";
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const cardName = cardNameInput.value;
  const cardLink = cardLinkInput.value;

  cardSaveButton.textContent = "Saving...";
  cardSaveButton.disabled = true;

  api
    .addCard({ name: cardName, link: cardLink })
    .then((newCard) => {
      renderCard(newCard, "prepend");
      closeModal(selectors.cardModal);
      resetFormAndButton(selectors.cardForm);
    })
    .catch((err) => {
      console.error("Error adding card:", err);
      cardSaveButton.disabled = false;
    })
    .finally(() => {
      cardSaveButton.textContent = "Save";
    });
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
  openModal(deleteModal);
};

const handleDeleteSubmit = (event) => {
  event.preventDefault();
  const deleteButton = event.target.querySelector(".modal__submit-btn--delete");
  deleteButton.textContent = "Deleting...";
  deleteButton.disabled = true;

  api
    .removeCard(selectedCardId)
    .then(() => {
      if (selectedCard instanceof HTMLElement) {
        selectedCard.remove();
      }
      closeModal(deleteModal);
      resetFormAndButton(deleteForm);
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
      deleteButton.disabled = false; // Re-enable on error
    })
    .finally(() => {
      deleteButton.textContent = "Delete";
    });
};

enableValidation(settings);
// ------------------- CARD CREATION & RENDERING -------------------
const createCardElement = ({
  name,
  link,
  _id,
  isLiked = false,
  likes = [],
}) => {
  const cardElement = selectors.cardTemplate.cloneNode(true).firstElementChild;

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cancelButton = selectors.cancelButton;

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  if (isLiked) {
    likeCount.textContent = 1;
    likeButton.classList.add("card__like-button_active");
  } else {
    likeCount.textContent = 0;
  }

  likeCount.remove();

  likeButton.addEventListener("click", () => {
    const isCurrentlyLiked = likeButton.classList.contains(
      "card__like-button_active"
    );
    const apiCall = isCurrentlyLiked ? api.removeLike(_id) : api.addLike(_id);

    apiCall
      .then((updatedCard) => {
        const newIsLiked = updatedCard.isLiked;
        const newLikes =
          parseInt(likeCount.textContent, 10) + (newIsLiked ? 1 : -1);

        likeButton.classList.toggle("card__like-button_active", newIsLiked);
        if (likeCount) likeCount.textContent = newLikes;
      })
      .catch((err) => console.error("Error updating like:", err));
  });

  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, _id)
  );
  cardImage.addEventListener("click", () => openPreviewModal(link, name));

  return cardElement;
};

const openPreviewModal = (imageSrc, imageAlt) => {
  selectors.previewImage.src = imageSrc;
  selectors.previewImage.alt = imageAlt;
  selectors.previewCaption.textContent = imageAlt;
  openModal(selectors.previewModal);
};

const renderCard = (item, method = "prepend") => {
  const card = createCardElement(item);
  card.setAttribute("data-id", item._id); // Use data attribute to track the card
  console.log("Card element created:", card);
  selectors.cardsContainer[method](card);
};

// ------------------- EVENT LISTENERS -------------------
const avatarEditButton = document.querySelector(".profile__avatar-btn");
const avatarForm = selectors.avatarModal.querySelector(".modal__form");

const deleteForm = document.querySelector("#delete-card-form");

avatarEditButton.addEventListener("click", () =>
  openModal(selectors.avatarModal)
);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
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

deleteForm.addEventListener("submit", handleDeleteSubmit);
selectors.cancelButton.addEventListener("click", () => closeModal(deleteModal));

// ------------------- MODAL CLOSE EVENTS -------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal").forEach((modal) => {
    const closeButton = modal.querySelector(".modal__close");
    if (closeButton) {
      closeButton.addEventListener("click", () => closeModal(modal));
    }
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });
});
