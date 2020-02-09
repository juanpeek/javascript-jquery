"use strict";
let xmlHttp, table = $("#inmuebles");
$(() => {
    xmlHttp = crearXML();
    if (xmlHttp == undefined) {
        Swal.fire('El navegador no soporta XMLHttpRequest!')
    }
    cargarZonas();

    $(table).find("tbody").on('click', 'tr', function() {
        $(this).toggleClass('selected');
    });
});

function alquilar() {
    if ($(".formInmo").valid()) {
        let rows = table.DataTable().rows(".selected").data();
        $(rows).each((ind,value) => {
            fetch("php/reservas.php", {
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                }),
                method: "POST",
                body: `dni=${$("#dni").val()}&inmueble=${value.idinmuebles}`
            }).then(response => response.json).then(response => {
                if (response.mensaje) {
                    Swal.fire("Ha habido un error");
                } else {
                    $("input, select").val("");
                    $("input, select").removeClass("is-valid");
                    table.DataTable().destroy();
                    $(table).children().remove();
                    location.reload();
                }
            });
        });
    }
}

function cargarZonas() {
    xmlHttp.open("GET", "php/zonas.php");
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            $("#zona").children(":not(:first)").remove();
            let response = JSON.parse(xmlHttp.responseText);
            $(response.data).each((key, value) =>{
                $("#zona").append(`<option value=${value.idzona}>${value.descripcion}</option>`);
            });
            validateBuscar();
        }
    }
    xmlHttp.send();
}

function cargarInmuebles() {
    if ($.fn.DataTable.isDataTable($(table))) {
        $(table).DataTable().ajax.reload();
    } else {
        $(table).find("thead").append(`
            <tr>
                <th>Domicilio</th>
                <th>Habitaciones</th>
                <th>Precio</th>
            </tr>
        `);
        table.DataTable({
            ajax: {
                url: "php/inmuebles.php",
                data: function(d) {
                    d.zona = $(".formInmo select[name='zona']").val(),
                    d.habitaciones = $(".formInmo input[name='numhab']:checked").val(),
                    d.precio = $(".formInmo select[name='precio']").val()
                }
            },
            "columns": [{
                "data": "domicilio"
            },{
                "data": "habitaciones"
            },{
                "data": "precio"
            }],
            "sPaginationType": "full_numbers",
            "language": {
                "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ registros",
                "sZeroRecords":    "No se encontraron resultados",
                "sEmptyTable":     "Ningún dato disponible en esta tabla =(",
                "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":    "",
                "sSearch":         "Buscar:",
                "sUrl":            "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Último",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });

        $("#inmuebles_wrapper").append(`<button class="btn btn-info" id="alq">Alquilar</button>`);
        $("#alq").on("click", alquilar);
    }
}

function validateBuscar() {
    $.validator.addMethod('validDni', function(value,element){
        return this.optional(element) || validDni(value);
    });
    $(".formInmo").validate({
        errorElement: "em", //elemento error, en este caso <em></em>
        errorPlacement: function(error, element) { //colocacion de error
            if ($(element).is("input[type='radio']")) {
                $(element).parent().parent().append(error);
                error.addClass("invalid-feedback");
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function(element) { //cuando se produce un error
            if (!$(element).is("input[type='radio']")) {
                $(element).addClass("is-invalid").removeClass("is-valid");
            }
        },
        unhighlight: function(element) {
            if (!$(element).is("input[type='radio']")) {
                $(element).addClass("is-valid").removeClass("is-invalid");
            }
        },
        rules:{
            dni: {
                required: true,
                validDni: true
            },
            zona: "required",
            numhab: "required",
            precio: "required"
        },
        messages: {
            dni: {
                validDni: "Formato incorrecto"
            },
            numhab: "Selecciona una opción"
        },
        submitHandler: function(form) {
            cargarInmuebles();
        }
    });
}

function validDni(value) {
    let validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
    let regexp = /^[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    let str = value.toString().toUpperCase();
  
    if (!regexp.test(str)) return false;
  
    //Reemplaza X por 0, se devuelve la str y reemplaza Y por 1 y despues Z por 2
    let nie = str
        .replace(/^[X]/, '0')
        .replace(/^[Y]/, '1')
        .replace(/^[Z]/, '2');
  
    let letter = str.substr(-1); //Ultimo carácter
    let charIndex = parseInt(nie.substr(0, 8)) % 23;
  
    if (validChars.charAt(charIndex) === letter) return true;
  
    return false;
}