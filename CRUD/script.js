"use strict";
let id,frmDialog,fila;
let botAcc="<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'/></button><button type='button' class='eliminar btn btn-danger'><i class='fas fa-trash'/></button>";
$(() => {
    cargarPerros();
    confFrmMod();
    confFrmValid();
    $("#add").on("click",addPerr);
    $("#cancelar").on("click",cerrarVentana);
})

function cargarPerros(){
    let dato = new FormData;
    dato.append("perro","");
    fetch("php/mostrar.php",{
        method: 'POST',
        body: dato
    })
        .then(response => response.json())
        .then((response) => {
            $("tbody tr").remove();//limpiar
            $(response.data).each((ind,ele)=>{
                $("tbody").append("<tr><td>"+ele.chip+"</td><td>"+ele.nombre+"</td><td>"+ele.raza+"</td><td>"+ele.fechaNac+"</td><td>"+botAcc+"</td></tr>");

            })
            //mostrar mensaje si no hay registros
            if($("tbody tr").length==0){
                $("tbody").append("<tr><td colspan=4 class='text-center'>There aren't any results</td></tr>");
            }
            $(".editar").on("click",editar);
            $(".eliminar").on("click",eliminar);
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
    frmDialog.dialog("option","title","Edit dog");
    frmDialog.dialog("open");
}
function eliminar(){
    fila = $(this).parents("tr");
    Swal.fire({
        title:'Delete this entry?',
        text:'Chip->'+fila.find("td:first").text(),
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor:'#d33',
        cancelButtonColor:'#3085d6',
        confirmButtonText:'Delete',
        cancelButtonText:'Cancel',
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
                    'The dog '+fila.find("td:nth-child(2)").text()+' with chip '+fila.find("td:first").text()+' has been deleted from the database'
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
    $(".form-horizontal")[0].reset();
    frmDialog.dialog("option","title","Add dog");
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
            chip: {
                required:"The chip is mandatory",
                minlength:"Min. 4 characters",
                maxlength:"Max. 14 characters",
            },
            raza:{
                required:"The breed is mandatory",
                minlength:"Min. 3 characters",
                maxlength:"Max. 20 characters",
            }
        },
        submitHandler: function(form){
            if(frmDialog.dialog("option","title")=="Edit dog"){
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
        url:"php/insertar.php",
        method:"POST",
        dataType:"json"
    })
    .done((response, textStatus, jqXHRs)=>{
        if($(response.mensaje)[0]!="Error"){
            Swal.fire({
                title: "Inserted in DB",
                icon:"success",
                confirmButtonText:"ok"
            }).then(result=>{
                $("tbody").append("<tr><td>"+$("#chip").val()+"</td><td>"+$("#nombre").val()+"</td><td>"+$("#raza").val()+"</td><td>"+$("#fechaN").val()+"</td><td>"+botAcc+"</td></tr>");
                $("tr:last .editar").on("click",editar);
                $("tr:last .eliminar").on("click",eliminar);
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
                title: "Modified",
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