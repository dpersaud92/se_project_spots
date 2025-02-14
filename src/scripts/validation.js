export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  if (errorMsgEl) {
    errorMsgEl.textContent = errorMsg;
    errorMsgEl.classList.add(config.errorClass);
  }
  inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  if (errorMsgEl) {
    errorMsgEl.textContent = "";
    errorMsgEl.classList.remove(config.errorClass);
  }
  inputEl.classList.remove(config.inputErrorClass);
};

export const checkInputValidity = (formEl, inputEl, config) => {
  inputEl.validity.valid
    ? hideInputError(formEl, inputEl, config)
    : showInputError(formEl, inputEl, inputEl.validationMessage, config);
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonEl, config) => {
  if (!buttonEl) {
    console.error("Button element not found for toggleButtonState.");
    return; // Exit early if the button is not found
  }

  const isInvalid = inputList.some((input) => !input.validity.valid);
  buttonEl.disabled = isInvalid;
  buttonEl.classList.toggle(config.inactiveButtonClass, isInvalid);
};

const resetValidation = (formEl, config) => {
  const inputList = [...formEl.querySelectorAll(config.inputSelector)];
  const submitButton = formEl.querySelector(config.submitButtonSelector);

  if (!submitButton) {
    console.error("Submit button not found in resetValidation.");
    return;
  }

  inputList.forEach((inputEl) => hideInputError(formEl, inputEl, config));
  toggleButtonState(inputList, submitButton, config);
};

const setEventListeners = (formEl, config) => {
  const inputList = [...formEl.querySelectorAll(config.inputSelector)];
  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonEl, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonEl, config);
    });
  });
};

export const enableValidation = (config) => {
  document
    .querySelectorAll(config.formSelector)
    .forEach((formEl) => setEventListeners(formEl, config));
};

export { toggleButtonState, resetValidation };
