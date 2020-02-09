"use strict";
let xmlHttp, id, mesas, reservas = [], nombrereserva = [], idreservas = [] ,c, frmDialog , numeromesa,idres;

$(() => {
    cargarRestaurantes();
    confValid();
    xmlHttp = crearXML();
    $("#rest").on("change", cargarEmpleados);
    confFrmMod();
    $("#reservas").attr("display","hidden");
})

function cargarRestaurantes() {
    $.ajax({
            url: "php/restaurantes.php",
            method: "POST",
            dataType: "json"
        })
        .done((response, textStatus, jqXHRs) => {
            console.log(response);
            $("tbody tr").remove(); //limpiar
            $(response.data).each((ind, ele) => {
                $("#rest").append("<option value='"+ele.mesas+"' id=" + ele.idrest + ">" + ele.name + "</option>");
            })
        })
}

function cargarEmpleados() {
    xmlHttp.open("POST", "php/empleados.php");
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let objeto = JSON.parse(xmlHttp.responseText);
            // console.log(objeto);
            $("#emp>option").remove();
            $(objeto.data).each((ind, ele) => {
                $("#emp").append("<option id=" + ele.idemp + ">" + ele.nomape + "</option>");
            })
        }
    }
    id = $("#rest option:selected").attr("id");
    xmlHttp.send("id=" + id);
}

function confValid() {
    $(".form-horizontal").validate({
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element) { //cuando se produce un error
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        rules: {
            rest: 'required',
            emp: 'required',
        },
        messages: {
            rest: {
                required: "El curso es obligatorio",
            },
            emp: {
                required: "El modulo es obligatoria",
            }
        },
        submitHandler: function (form) {
            cargarMesas();
        }

    })
}

function cargarMesas() {
    reservas = [];
    nombrereserva = [];
    idreservas = [];
    $.ajax({
            url: "php/consReservas.php",
            data: {
                idrest: $("#rest option:selected").attr('id'),
                fecha: $("#fechaR").val(),
            },
            type: "GET",
            dataType: "json"
        })
    .done((response, textStatus, jqXHRs) => {
        $("#comedor").children().remove();
        $(response.data).each((ind, ele) => {
            reservas.push(ele.mesa);
            nombrereserva.push(ele.nomapecli);
            idreservas.push(ele.idreservas);
        })
        mesas = $("#rest option:selected").val();
        c = 0;
        for (let i = 0; i < mesas; i++) {
            if (reservas.indexOf(i+1) == -1) {
                $("#comedor").append("<img name='"+(i+1)+"' src='imagenes/mesaLibre.png' title='Mesa Disponible'>");
            } else {
                $("#comedor").append("<img name='"+(i+1)+"' id='"+idreservas[c]+"' src='imagenes/mesaOcupada.png' title='Reservado a: " + nombrereserva[c] + "'>");
                c++;
            }
        }
        $("img").tooltip();
        mesasLibres();
        mesasOcupadas();
    })

}

function mesasLibres() {

    $("img[src='imagenes/mesaLibre.png']").on("click", function() {
        numeromesa = $(this).attr("name");
        frmDialog.dialog("option", "title", "Reservar mesa");
        frmDialog.dialog("open");
    });
}

function mesasOcupadas() {
    $("img[src='imagenes/mesaOcupada.png']").on("click", function() {

            idres = $(this).attr("id");
            Swal.fire({
                title: 'Eliminar Reserva',
                text: "Si aceptas se eliminará la reserva de esta mesa",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar'
            }).then((result) => {
                if (result.value) {
                    Swal.fire(
                        'Eliminada!',
                        'La reserva se ha eliminado',
                        'success'
                    )
                    delReserva();
                    $(this).attr("src","imagenes/mesaLibre.png");
                    $(this).attr("data-original-title","Mesa Libre");
                    $("img").off("click");
                    mesasLibres();
                    mesasOcupadas();
                }
        })
    });
}

function delReserva(){
            $.ajax({
                    data: {
                        id : idres,
                    },
                    url: "php/delReservas.php",
                    method: "POST",
                    dataType: "json"
                })
                .done((response, textStatus, jqXHRs) => {

                })
        }8

function confFrmMod() {
    $('.frmReservas').validate({
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element) { //cuando se produce un error
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        rules: {
            nameApeCli: { required: true },
            numCom: { required: true }
        },
        messages: {
            nameApeCli: {
                required: "El nombre es obligatorio",
            },
            numCom: {
                required: "El nº de comensales es obligatorio",
            }
        },
        submitHandler: function (form) {
            reservarMesa();
        }
    });    
    frmDialog = $("#reservas").dialog({
        autoOpen: false,
        width: 500,
        modal: true,
        resizable: false,
        draggable: false,
    });
}

function reservarMesa(){
    frmDialog.dialog("close");
    let datos = $(".frmReservas").serialize() + "&rest=" + $("#rest option:selected").attr('id') + "&emp=" + $("#emp option:selected").attr('id') + "&fecha=" + $("#fechaR").val() + "&mesa=" + numeromesa;
    $.ajax({
        url: "php/saveReservas.php",
        data: datos,
        type: "GET",
        dataType: "json" //recibir
    })
    .done((response, textStatus, jqXHRs) => {
        console.log(response);
        Swal.fire({
            title: 'Reserva realizada',
            text: "Su reserva se ha completado correctamenta",
            icon: 'success',
            confirmButtonColor: 'blue',
            confirmButtonText: 'Ok'
        }).then((result) => {
            $( `img[name='${numeromesa}']` ).attr("src","imagenes/mesaOcupada.png");
            $( `img[name='${numeromesa}']` ).attr("data-original-title","Reservado");
            $( `img[name='${numeromesa}']` ).attr("id",response.id);
            $("img").off("click");
            mesasLibres();
            mesasOcupadas();
        })
        
    })
}