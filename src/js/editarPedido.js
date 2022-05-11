import { minDateInput, validateInputs } from "./helpers/Validations.js";

const $form = document.querySelector("#form-edit");
const $registerDate = document.querySelector("#txtRegistrationDate");
const $instalationDate = document.querySelector("#txtInstalationDate");
const $checkboxes = document.querySelectorAll(".Form__Checkbox");

const handleChange = (e) => {
  const $containerParent = e.target.parentElement.parentElement;

  if ($containerParent) {
    const $containerRadio = $containerParent.querySelector(".Form__Radio");

    $containerRadio.classList.toggle("d-none");
  }
};

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

/**
 * Inicio de la app
 */
const init = () => {
  minDateInput($registerDate); //Restringir fechas en el calendario del formulario
  minDateInput($instalationDate);

  //Añadir evento cuando se cambia algún checkbox del formulario.
  [...$checkboxes].map((checkbox) => {
    checkbox.addEventListener("change", handleChange);
  });

  $form.addEventListener("submit", handleSubmit);
};

window.addEventListener("DOMContentLoaded", () => {
  if ($form) {
    init();
  }
});
