const rules = [
  { name: "fecha_ingreso", type: "date", max: "today", required: true },
  { name: "fecha_instalacion", type: "date", max: "today", required: true },
  { name: "prod_gral[]", type: "string", required: true, alias: "producto" },
  { name: "barrio", type: "string", min: 5, max: 50, required: true },
  { name: "estrato", type: "numeric", min: 1, max: 10, required: true },
  { name: "direccion", type: "string", min: 8, max: 50, required: true },
  {
    name: "cliente_id",
    type: "numeric",
    min: 1,
    max: 999999999999999,
    required: false,
    nit: true,
    alias: "cédula",
  },
  { name: "nombre_cliente", type: "string", min: 8, max: 50, required: true },
  {
    name: "canal_id",
    type: "numeric",
    min: 100,
    max: 99999999,
    required: true,
  },
  { name: "regional", type: "string", required: true },
  { name: "est_departamento", type: "string", required: true },
  { name: "tecnologia", type: "string", required: true },
];

/**
 * Restringe en el calendario del formulario que se selecciones fechas mayor al día actual.
 * @param {HTMLInputElement} input
 * @returns {string} Si el input no es valido.
 */
export const minDateInput = (input) => {
  if (!input) return "Campo no valido";
  input.max = new Date().toLocaleString("sv").split(" ")[0];
};

/**
 * Valida que un número se encuentre entre los valores min y max, y si es un nit, válida que solo
 * tenga números y el guion medio (-).
 * @param {int} number Número a validar
 * @param {int} min
 * @param {int} max
 * @param {boolean} nit
 * @returns {array}
 */
const validateNumber = (number, min = 1, max = 99999999, nit = false) => {
  const regex = new RegExp("^[0-9-]+$");
  let error = true,
    msg = `El campo debe tener un valor entre ${min} y ${max}.`;

  if (nit === true && regex.test(number) === false) {
    return {
      error: true,
      msg: "El campo solo admite valores numéricos y el guion medio (-) en caso de un NIT.",
    };
  }

  number = parseInt(number);
  if (number >= min && number <= max) {
    error = false;
    msg = "Validación exitosa";
  }

  return { error, msg };
};

/**
 * Valida que el string contenga caracteres entre el valor mínimo y el máximo
 * @param {string} string
 * @param {int} min
 * @param {int} max
 * @returns {array}
 */
const validateString = (string, min = 1, max = 100) => {
  let error = true,
    msg = `El campo debe tener mínimo ${min} y máximo ${max} caracteres`;

  if (string.length >= min && string.length <= max) {
    error = false;
    msg = "Validación exitosa.";
  }

  return { error, msg };
};

/**
 * Valida que la fecha no sea mayor a la fecha actual
 * @param {string} dateValue
 * @returns {array}
 */
const validateDate = (dateValue) => {
  const date = new Date();
  const today = date.toLocaleString("sv").split(" ")[0];

  if (dateValue > today)
    return {
      error: true,
      msg: "La fecha no debe ser mayor a la fecha actual.",
    };

  return {
    error: false,
    msg: "Validación exitosa.",
  };
};

/**
 * Validar que todos los campos del formulario cumplan con las reglas que están definidas.
 * @param {FormData} formData
 * @returns {array}
 */
export const validateInputs = (formData) => {
  for (const rule of rules) {
    const value = formData.get(rule.name);
    const nameField = rule.alias ? rule.alias : rule.name;

    if (rule.required === true && !value) {
      return {
        error: true,
        msg: `El campo ${nameField} es obligatorio`,
        field: nameField,
      };
    }

    let result = "";
    switch (rule.type) {
      case "date":
        result = validateDate(value);
        break;
      case "string":
        result = validateString(value, rule?.min, rule?.max);
        break;
      case "numeric":
        result = validateNumber(value, rule?.min, rule?.max, rule?.nit);
        break;
    }

    if (result.error) return { ...result, field: nameField };
  }

  return { error: false, msg: "Todos los campos cumplen con las reglas." };
};
