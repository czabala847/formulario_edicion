import { minDateInput, validateInputs } from "./helpers/Validations.js";
import { rulesFormEdit } from "./rules/index.js";

const $form = document.querySelector("#form-edit");
const $registerDate = document.querySelector("#txtRegistrationDate");
const $instalationDate = document.querySelector("#txtInstalationDate");
const $checkboxes = document.querySelectorAll(".Form__Checkbox");
let rules = rulesFormEdit;

const handleChange = (e) => {
  const checkbox = e.target;
  const $containerParent = checkbox.parentElement.parentElement;

  //Mostrar los radioButton de la categoría seleccionada.
  if ($containerParent) {
    const $containerRadio = $containerParent.querySelector(".Form__Radio");
    $containerRadio.classList.toggle("d-none");

    if (checkbox.checked) {
      const newRule = {
        name: checkbox.dataset.nameRadio,
        required: true,
        alias: `tipo ${checkbox.dataset.category}`,
        customMsg: `Debe seleccionar un producto para la categoría de ${checkbox.dataset.category}`,
      };

      // Cuando se seleccione una categoría añadir a la regla de validación que sus radioButton son
      // obligatorios.
      rules = [...rules, newRule];
    } else {
      //Deseleccionar los radios activos.
      const $radios = $containerRadio.querySelectorAll("input[type='radio']");
      [...$radios].forEach((radio) => {
        radio.checked = false;
      });
      //Eliminar la regla si existe.
      rules = rules.filter((rule) => rule.name !== checkbox.dataset.nameRadio);
    }
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  const fd = new FormData($form);
  const { error, msg, field = "" } = validateInputs(fd, rules);
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
