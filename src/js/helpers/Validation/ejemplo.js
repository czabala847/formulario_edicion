function getData() {
    var idPdv = $("#idPdv").val();
    var valorAutorizado = $("#valorAutorizado").cleanVal();
    var financiacion = $('#financiacion').val();
    var listaPrecios = $('#lista-precios').val();
    var observaciones = $('#observaciones').val();
    return [
        {name: 'idPdv', alias: 'ID PDV', value: idPdv, rules: ['notEmpty', 'number', 'minLength:4']},
        {name: 'valorAutorizado', alias: 'Valor Autorizado', value: valorAutorizado, rules: ['notEmpty', 'number']},
        {name: 'financiacion', alias: 'Financiación', value: financiacion, rules: ['notEmpty', 'number']},
        {name: 'listaPrecios', alias: 'Lista De Precios', value: listaPrecios, rules: ['notEmpty', 'number']},
        {name: 'observaciones', alias: 'Observaciones', value: observaciones, rules: []}
    ];
}


var frmDataReg = getData();
var Validation = validateDataFrm(frmDataReg);
if (Validation.success){
    var data = GetDataFrm(frmDataReg);
}else{
    var msg = Validation.msg;
   
}