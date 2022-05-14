const $form = document.querySelector("#form-edit");
const $checkboxes = document.querySelectorAll(".Form__Checkbox");
let rulesProductChecked = [];

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
        alias: `Producto ${checkbox.dataset.category}`,
        value: undefined, //no se sabe aún que radio se seleccionó
        rules: ["notEmpty"],
      };

      // Cuando se seleccione una categoría añadir a la regla de validación que sus radioButton son
      // obligatorios.
      rulesProductChecked.push(newRule);
    } else {
      //   Deseleccionar los radios activos.
      const $radios = $containerRadio.querySelectorAll("input[type='radio']");
      [...$radios].forEach((radio) => {
        radio.checked = false;
      });

      //Eliminar la regla si existe.
      rulesProductChecked = rulesProductChecked.filter(
        (rule) => rule.name !== checkbox.dataset.nameRadio
      );
    }
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  const fd = new FormData($form);
  let frmDataReg = getDataRules(fd);

  if (rulesProductChecked.length > 0) {
    //actualizar el valor de las nuevas reglas.
    rulesProductChecked = rulesProductChecked.map((rule) => {
      return { ...rule, value: fd.get(rule.name) };
    });
  }

  frmDataReg = [...frmDataReg, ...rulesProductChecked];

  debugger;

  const { success, msg } = validateDataFrm(frmDataReg);
  const $responseContainer = document.querySelector("#responseValidate");

  if (!success) {
    $responseContainer.classList.replace("d-none", "d-block");
    $responseContainer.classList.replace("alert-success", "alert-danger");
    $responseContainer.textContent = msg;
  } else {
    $responseContainer.classList.replace("d-none", "d-block");
    $responseContainer.classList.replace("alert-danger", "alert-success");
    $responseContainer.textContent =
      "Todos los campos cumplen con la condición.";
  }

  $responseContainer.scrollIntoView(false);
};

const getDataRules = (formData) => {
  if (formData) {
    return [
      {
        name: "fecha_ingreso",
        alias: "Fecha de Ingreso",
        value: formData.get("fecha_ingreso"),
        rules: ["notEmpty", "dateNoLater"],
      },
      {
        name: "fecha_instalacion",
        alias: "Fecha de Instalación",
        value: formData.get("fecha_instalacion"),
        rules: ["notEmpty", "dateNoLater"],
      },
      {
        name: "prod_gral[]",
        alias: "Producto",
        value: formData.get("prod_gral[]"),
        rules: ["notEmpty"],
      },
      {
        name: "barrio",
        alias: "Barrio",
        value: formData.get("barrio"),
        rules: ["notEmpty", "minLength:5", "maxLength:50"],
      },
      {
        name: "estrato",
        alias: "Estrato",
        value: formData.get("estrato"),
        rules: ["notEmpty", "number", "minNumber:1", "maxNumber:10"],
      },
      {
        name: "direccion",
        alias: "Dirección del cliente",
        value: formData.get("direccion"),
        rules: ["notEmpty", "minLength:8", "maxLength:50"],
      },
      {
        name: "cliente_id",
        alias: "Cédula del cliente",
        value: formData.get("cliente_id"),
        rules: ["notEmpty", "nit", "maxLength:15"],
      },
      {
        name: "nombre_cliente",
        alias: "Nombre del cliente",
        value: formData.get("nombre_cliente"),
        rules: ["notEmpty", "minLength:8", "maxLength:50"],
      },
      {
        name: "canal_id",
        alias: "ID del canal",
        value: formData.get("canal_id"),
        rules: ["notEmpty", "number", "minLength:3", "maxLength:8"],
      },
      {
        name: "regional",
        alias: "Regional",
        value: formData.get("regional"),
        rules: ["notEmpty"],
      },
      {
        name: "est_departamento",
        alias: "Departamento",
        value: formData.get("est_departamento"),
        rules: ["notEmpty"],
      },
      {
        name: "tecnologia",
        alias: "Tecnologia",
        value: formData.get("tecnologia"),
        rules: ["notEmpty"],
      },
    ];
  }
};

/**
 * Inicio de la app
 */
const init = () => {
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
