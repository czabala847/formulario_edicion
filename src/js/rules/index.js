export const rulesFormEdit = [
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
