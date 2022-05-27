var loaderImg = `<img src="../img/loaders/grid.svg" width="70" />`;

var showMsg = function (type, title, msg, confirmButtonText, fnf = null) {
  if (!confirmButtonText) {
    confirmButtonText = "Cerrar";
  }
  var cssClassConfirmButton = type === "success" ? "btn-success" : "btn-danger";
  Swal.fire({
    title: title,
    text: msg,
    icon: type,
    confirmButtonText: confirmButtonText,
    buttonsStyling: false,
    customClass: {
      confirmButton: `btn btn-lg ${cssClassConfirmButton}`,
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (fnf) {
        fnf();
      }
    }
  });
};

var SwShowHtml = function (html) {
  Swal.fire({
    html: html,
    icon: undefined,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
  });
};

var GetTemplate = function (url, data, ctn, fnf = null) {
  axios
    .post(url, data)
    .then((res) => {
      var response = res.data;
      $(ctn).html(response);
      if (fnf) {
        fnf();
      }
      Swal.close();
    })
    .catch(function (error) {
      showMsg(
        "warning",
        "Lo sentimos!",
        `Error en la conexión a internet. Intente nuevamente.`
      );
    });
};

const stringToDate = (dateStr) => {
  const regEdx = /^\d{4}-\d{2}-\d{2}$/;

  if (regEdx.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day);

    return {
      success: true,
      date,
    };
  }

  return {
    success: false,
    msg: "La fecha no cumple con el formato YYYY-MM-DD.",
  };
};

var validateDataFrm = function (data) {
  let arrayData = [];
  var success = true;
  var msg = "";
  $.each(data, function (index, Item) {
    var name = Item.name;
    var Rules = Item.rules;
    var value = Item.value;
    var alias = Item.alias;
    var customMsg = Item.customMsg;
    var acceptEmptyValue =
      $.inArray("acceptEmptyValue", Rules) >= 0 && value.length === 0;
    $.each(Rules, function (j, Rule) {
      var ruleConfig = Rule.split(":");
      var ruleName = ruleConfig[0];

      switch (ruleName) {
        case "notEmpty":
          if (value === null) {
            success = false;
            msg = customMsg ? customMsg : `El campo ${alias} es obligatorio.`;
          } else if (value.length === 0) {
            success = false;
            msg = `El campo ${alias} está vacío.`;
          }

          if (!$.isNumeric(value)) {
            value = value.replace("\t", "").trim();
          }

          break;
        case "number":
          if (!acceptEmptyValue) {
            if (!$.isNumeric(value)) {
              success = false;
              msg = `El campo ${alias} debe tener solo números.`;
            }
          }
          break;

        case "maxf":
          if (!acceptEmptyValue) {
            var fieldCompName = ruleConfig[1];
            var fieldComp = data.find(function (El) {
              return El.name === fieldCompName;
            });
            if (fieldComp) {
              var valComp = fieldComp.value;
              if (!$.isNumeric(valComp) || !$.isNumeric(value)) {
                success = false;
                msg = `Los campos ${alias} y ${fieldComp.alias} deben tener solo números.`;
              } else {
                if (value > valComp) {
                  success = false;
                  msg = `El valor de ${alias} No puede ser superior al de ${fieldComp.alias}.`;
                }
              }
            } else {
              success = false;
              msg = `El campo ${fieldCompName} que se tomará como comparación, no existe.`;
            }
          }
          break;
        case "minLength":
          if (!acceptEmptyValue) {
            var minLength = ruleConfig[1];
            if (String(value).length < minLength) {
              success = false;
              msg = `El campo ${alias} debe tener mínimo ${minLength} caracteres.`;
            }
          }
          break;
        case "maxLength":
          if (!acceptEmptyValue) {
            var maxLength = ruleConfig[1];
            if (String(value).length > maxLength) {
              success = false;
              msg = `El campo ${alias} debe tener máximo ${maxLength} caracteres.`;
            }
          }
          break;
        case "startsWith":
          if (!acceptEmptyValue) {
            var strSearch = ruleConfig[1];
            if (!value.startsWith(strSearch)) {
              success = false;
              msg = `El campo ${alias} debe empezar por ${strSearch}.`;
            }
          }
          break;

        //Validar que la fecha no sea mayor a la fecha actual
        case "dateNoLater":
          if (!acceptEmptyValue) {
            const date = new Date();
            const today = date.toLocaleString("sv").split(" ")[0];

            if (value > today) {
              success = false;
              msg = `El campo ${alias} no debe se mayor a la fecha actual.`;
            }
          }
          break;

        //Validar dígito minimo.
        case "minNumber":
          if (!acceptEmptyValue) {
            if (!$.isNumeric(value)) {
              success = false;
              msg = `El campo ${alias} deben tener solo números.`;
            } else {
              if (Number(value) < Number(ruleConfig[1])) {
                success = false;
                msg = `El valor de ${alias} debe ser mayor o igual a ${ruleConfig[1]}.`;
              }
            }
          }
          break;

        //Validar dígito maximo.
        case "maxNumber":
          if (!acceptEmptyValue) {
            if (!$.isNumeric(value)) {
              success = false;
              msg = `El campo ${alias} deben tener solo números.`;
            } else {
              if (Number(value) > Number(ruleConfig[1])) {
                success = false;
                msg = `El valor de ${alias} debe ser menor o igual a ${ruleConfig[1]}.`;
              }
            }
          }
          break;

        //Validar un nit
        case "nit":
          if (!acceptEmptyValue) {
            const nitRegex = new RegExp("^[0-9]+(-?[0-9kK])?$");
            if (!nitRegex.test(value)) {
              success = false;
              msg = `El campo ${alias} solo debe contener números, en caso de ser un NIT solo se permite un guion medio seguido de un digito.`;
            }
          }
          break;

        case "depend":
          if (!acceptEmptyValue) {
            var fieldCompName = ruleConfig[1];
            var fieldCompValue = ruleConfig[2];
            var fieldComp = data.find(function (El) {
              return El.name === fieldCompName;
            });

            if (fieldComp) {
              var valComp = fieldComp.value;
              if (valComp != fieldCompValue) {
                success = false;
                msg = `El campo ${alias} require que el valor de ${fieldComp.alias} sea ${fieldCompValue}.`;
              }
            } else {
              success = false;
              msg = `El campo ${fieldCompName} que se tomará como comparación, no existe.`;
            }
          }
          break;

        case "minDate":
          if (!acceptEmptyValue) {
            const date = stringToDate(value);
            const minDate = stringToDate(ruleConfig[1]);

            if (date.success && minDate.success) {
              if (minDate.date > date.date) {
                success = false;
                msg = `La fecha del campo ${alias} debe ser mayor o igual a ${ruleConfig[1]}.`;
              }
            } else {
              success = false;
              msg = `${date?.msg}. ${minDate?.msg}`;
            }
          }
          break;
        case "maxDate":
          if (!acceptEmptyValue) {
            const date = stringToDate(value);
            const maxDate = stringToDate(ruleConfig[1]);

            if (date.success && maxDate.success) {
              if (maxDate.date < date.date) {
                success = false;
                msg = `La fecha del campo ${alias} debe ser menor o igual a ${ruleConfig[1]}.`;
              }
            } else {
              success = false;
              msg = `${date?.msg}. ${maxDate?.msg}`;
            }
          }
          break;
        default:
        // console.log('Regla no creada');
      }
      if (!success) {
        return false;
      }
    });
    if (!success) {
      return false;
    }

    arrayData.push([name, value]);
  });

  return {
    success: success,
    msg: msg,
    data: arrayData,
  };
};

var GetDataFrm = function (data) {
  var obj = {};
  data.forEach(function (Item) {
    obj[Item.name] = Item.value;
  });
  return obj;
};

$(function () {
  $(".mod-link").click(function (e) {
    e.preventDefault();
    var url = $(this).data("link");
    var html = `<h2 class="bold-text">Por favor espere</h2>${loaderImg}`;
    SwShowHtml(html);
    GetTemplate(url, {}, "#ctn-content");
  });
});
