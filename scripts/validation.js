// const settings = {
//   formSelector: ".modal__form",
//   inputSelector: ".modal__input",
//   submitButtonSelector: ".modal__submit-btn",
//   inactiveButtonClass: "modal__submit-btn_disabled",
//   inputErrorClass: "modal__input_type_error",
//   errorClass: "modal__error_visible",
// };

// const showInputError = (formEl, inputEl, errorMsg, config) => {
//   const errorMsgId = `${inputEl.id}-error`;
//   const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);
//   if (errorMsgEl) {
//     errorMsgEl.textContent = errorMsg;
//     errorMsgEl.classList.add(config.errorClass);
//   }
//   inputEl.classList.add(config.inputErrorClass);
// };

// const hideInputError = (formEl, inputEl, config) => {
//   const errorMsgId = `${inputEl.id}-error`;
//   const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);
//   if (errorMsgEl) {
//     errorMsgEl.textContent = "";
//     errorMsgEl.classList.remove(config.errorClass);
//   }
//   inputEl.classList.remove(config.inputErrorClass);
// };

// const checkInputValidity = (formEl, inputEl, config) => {
//   if (!inputEl.validity.valid) {
//     showInputError(formEl, inputEl, inputEl.validationMessage, config);
//   } else {
//     hideInputError(formEl, inputEl, config);
//   }
// };

// const hasInvalidInput = (inputList) => {
//   return inputList.some((input) => !input.validity.valid);
// };

// const toggleButtonState = (inputList, buttonEl, config) => {
//   if (hasInvalidInput(inputList)) {
//     buttonEl.disabled = true;
//     buttonEl.classList.add(config.inactiveButtonClass);
//   } else {
//     buttonEl.disabled = false;
//     buttonEl.classList.remove(config.inactiveButtonClass);
//   }
// };

// const resetValidation = (formEl, config) => {
//   const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
//   inputList.forEach((inputEl) => {
//     hideInputError(formEl, inputEl, config);
//   });
//   const buttonEl = formEl.querySelector(config.submitButtonSelector);
//   toggleButtonState(inputList, buttonEl, config);
// };

// const setEventListeners = (formEl, config) => {
//   const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
//   const buttonEl = formEl.querySelector(config.submitButtonSelector);
//   toggleButtonState(inputList, buttonEl, config);

//   inputList.forEach((inputEl) => {
//     inputEl.addEventListener("input", () => {
//       checkInputValidity(formEl, inputEl, config);
//       toggleButtonState(inputList, buttonEl, config);
//     });
//   });
// };

// const resetCardForm = (formEl, config) => {
//   resetValidation(formEl, config);
//   formEl.reset(); // Reset form fields
// };

// const resetEditForm = (formEl, config, profileData) => {
//   resetValidation(formEl, config);
//   const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
//   inputList.forEach((inputEl) => {
//     const inputId = inputEl.id.replace("-input", "");
//     inputEl.value = profileData[inputId] || "";
//   });
// };

// const enableValidation = (config) => {
//   const formList = Array.from(document.querySelectorAll(config.formSelector));
//   formList.forEach((formEl) => {
//     setEventListeners(formEl, config);
//   });
// };

// document.querySelectorAll(".modal").forEach((modal) => {
//   modal.addEventListener("click", (event) => {
//     if (event.target === modal) closeModal(modal);
//   });
// });

// const closeModal = (modal) => {
//   modal.classList.remove("modal_opened");
//   document.removeEventListener("keydown", handleEscapeKey);
// };

// // Initialize validation
// enableValidation(settings);

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMsgId = `${inputEl.id}-error`;
  const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);
  if (errorMsgEl) {
    errorMsgEl.textContent = errorMsg;
    errorMsgEl.classList.add(config.errorClass);
  }
  inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgId = `${inputEl.id}-error`;
  const errorMsgEl = formEl.querySelector(`#${errorMsgId}`);
  if (errorMsgEl) {
    errorMsgEl.textContent = "";
    errorMsgEl.classList.remove(config.errorClass);
  }
  inputEl.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasInvalidInput(inputList)) {
    buttonEl.disabled = true;
    buttonEl.classList.add(config.inactiveButtonClass);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(config.inactiveButtonClass);
  }
};

const resetValidation = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  inputList.forEach((inputEl) => hideInputError(formEl, inputEl, config));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonEl, config);
};

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonEl, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonEl, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => setEventListeners(formEl, config));
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
});

// Initialize validation
enableValidation(settings);
