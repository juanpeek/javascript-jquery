"use strict";
let id,frmDialog,fila;
let botAcc="<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'/></button><button type='button' class='eliminar btn btn-danger'><i class='fas fa-trash'/></button>";
$(() => {
    configTabla();
    cargarPerros();
    confFrmMod();
    confFrmValid();
    $("#add").on("click",addPerr);
    $("#cancelar").on("click",cerrarVentana);
})

function configTabla(){
    $('.table').DataTable({
        "ajax":"php/mostrarPaginador.php",
        "columns":[{
            "data":"chip"
        },{
            "data":"nombre",
        },{
            "data":"raza",
        },{
            "data":"fechaNac",
        },{
            "defaultContent":botAcc
        }],
        "sPaginationType":"full_numbers",
        "language":{
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
                },
            }
    });
    //establecer los eventos a los botones
    $("tbody").on("click",".editar",editar);
    $("tbody").on("click",".eliminar",eliminar);
}
function cargarPerros(){
    $.ajax({
        data: { perro:""},
        url:"php/mostrar.php",
        method:"POST",
        dataType:"json"
    })
    .done((response, textStatus, jqXHRs)=>{
        if(textStatus == 'success'){
            console.log(response);
            $("tbody tr").remove();//limpiar
            $(response.data).each((ind,ele)=>{
                $("tbody").append("<tr><td>"+ele.chip+"</td><td>"+ele.nombre+"</td><td>"+ele.raza+"</td><td>"+ele.fechaNac+"</td><td>"+botAcc+"</td></tr>");

            })
            //mostrar mensaje si no hay registros
            if($("tbody tr").length==0){
                $("tbody").append("<tr><td colspan=4 class='text-center'>No hay registros</td></tr>");
            }
            $(".editar").on("click",editar);
            $(".eliminar").on("click",eliminar);
        }
    })
    .fail((response,textStatus,errorThrow)=>{

    })

}

function editar(){
    fila = $(this).parents("tr");
    //cargar el formulario
    $(fila).find("td").each(function (ind,ele){
        switch(ind){
            case 0:
                $("#chip").val($(ele).text());
                break;
            case 1:
                $("#nombre").val($(ele).text());
                break;
            case 2:
                $("#raza").val($(ele).text());
                break;
            case 3:
                $("#fechaN").val($(ele).text());
                break;
        }
    })
    frmDialog.dialog("option","title","Editar perro");
    frmDialog.dialog("open");
}
function eliminar(){
    fila = $(this).parents("tr");
    console.log("hola");
    Swal.fire({
        title:'¿Desea eliminar el registro?',
        text:'Chip->'+fila.find("td:first").text(),
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor:'#d33',
        cancelButtonColor:'#3085d6',
        confirmButtonText:'Eliminar',
        cancelButtonText:'Cancelar',
        focusCancel: true,
    }).then((result)=>{
        if(result.value){
            $.ajax({
                data: { chip:fila.find("td:first").text()},
                url:"php/eliminar.php",
                method:"POST",
            })
            .done((response, textStatus, jqXHRs)=>{
                Swal.fire(
                    'El perro '+fila.find("td:nth-child(2)").text()+' con chip '+fila.find("td:first").text()+' ha sido eliminado de la base de datos'    
                )
                $(fila).remove()// eliminar fila de la tabla
            })
            .fail((response,textStatus,errorThrow)=>{
                Swal.fire(
                    
                )
            })
        }
    })
}
function addPerr(){
    //Abrir el formulario en la ventana modal
    frmDialog.dialog("option","title","Añadir perro");
    frmDialog.dialog("open");
}
function confFrmMod(){
    frmDialog = $( ".form-horizontal" ).dialog({
      autoOpen: false,
      width: 500,
      modal: true,
      resizable: false
    });
}
function confFrmValid(){
    $(".form-horizontal").validate({
        errorElement:"em",
        errorPlacement: function(error,element){
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight:function(element){ //cuando se produce un error
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight:function(element){ 
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        rules:{
            chip:{
                required:true,
                minlength:4,
                maxlength:14,
            },
            nombre:'required',
            raza:{
                required:true,
                minlength:3,
                maxlength:20,
                //email:true
            },
            fechaN:{
                required:true,
                date:true
            },

        },
        messages:{
            chip: "El chip del perro es obligatorio",
            raza:{
                required:"La raza del perro es obligatoria",
                minlength:"El min de caracteres es 3",
                maxlength:"El min de caracteres es 20",
            }
        },
        submitHandler: function(form){
            if(frmDialog.dialog("option","title")=="Editar perro"){
                editSaveReg();
            }else{
                saveReg();
            }
        }

    })
}
function saveReg(){
    let datos = $(".form-horizontal").serialize();
    $.ajax({
        data: datos,
            //chip: $("#chip").val(), con serialize tenemos todos los campos
            //nombre: $("#chip").val(),
        url:"php/insertar.php",
        method:"POST",
        dataType:"json"
    })
    .done((response, textStatus, jqXHRs)=>{
        if($(response.mensaje)[0]!="Error"){
            Swal.fire({
                title: "Registro insertado",
                icon:"success",
                confirmButtonText:"ok"
            }).then(result=>{
                $("tbody").append("<tr><td>"+$("#chip").val()+"</td><td>"+$("#nombre").val()+"</td><td>"+$("#raza").val()+"</td><td>"+$("#fechaNac").val()+"</td><td>"+botAcc+"</td></tr>");
                $("tbody").on("click",".editar",editar);
                $("tbody").on("click",".eliminar",eliminar);
                cerrarVentana();
            })
        }
    })
    .fail((response,textStatus,errorThrow)=>{

    })
}
function cerrarVentana(){
    frmDialog.dialog("close");
    $(".form-horizontal input").val("");
    $(".form-horizontal input").removeClass("is-valid");

}
function editSaveReg(){
    let datos = $(".form-horizontal").serialize();
    $.ajax({
        data: datos,
        url:"php/editar.php",
        method:"POST",
        dataType:"json"
    })
    .done((response, textStatus, jqXHRs)=>{
        if($(response.mensaje)[0]!="Error"){
            Swal.fire({
                title: "Registro Modificado",
                icon:"success",
                confirmButtonText:"ok"
            }).then(result=>{
                //modificar el registro en la tabla
                $(fila).find("td:nth-child(1)").text($("#chip").val());
                $(fila).find("td:nth-child(2)").text($("#nombre").val());
                $(fila).find("td:nth-child(3)").text($("#raza").val());
                $(fila).find("td:nth-child(4)").text($("#fechaN").val());
                cerrarVentana();
            })
        }
    })
    .fail((response,textStatus,errorThrow)=>{

    })
}