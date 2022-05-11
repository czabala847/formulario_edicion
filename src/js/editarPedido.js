import { minDateInput, validateInputs } from "./helpers/Validations.js";

const $form = document.querySelector("#form-edit");
const $registerDate = document.querySelector("#txtRegistrationDate");
const $instalationDate = document.querySelector("#txtInstalationDate");

const handleSubmit = (e) => {
  e.preventDefault();

  const fd = new FormData($form);
  const { error, msg, field = "" } = validateInputs(fd);
  const $responseContainer = document.querySelector("#responseValidate");

  if (error) {
    $responseContainer.classList.replace("d-none", "d-block");
    $responseContainer.classList.replace("alert-success", "alert-danger");
    $responseContainer.textContent = `El campo ${field} no cumple con la validación.
    ${msg}  
    `;
  } else {
    $responseContainer.classList.replace("alert-danger", "alert-success");
    $responseContainer.textContent = msg;
  }
};

const init = () => {
  minDateInput($registerDate);
  minDateInput($instalationDate);

  $form.addEventListener("submit", handleSubmit);
};

window.addEventListener("DOMContentLoaded", () => {
  if ($form) {
    init();
  }
});
