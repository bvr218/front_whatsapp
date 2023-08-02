function abrirEnPestana(url) {
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.click();
}


/*$("*:not(#sidebar").on("click", function(){
 if ($(".sidebar_offcanvas").hasClass("active")){
 $("#sidebar").removeClass("active");
 //$("#sidebar").slideUp();
 console.log("cerrnadi");
 }
 });*/

function vaciar_fitro(vaciar=false){
    $('#filtro_tabla input').val('');
    $('#filtro_tabla .selectpicker').val('');
    $('#filtro_tabla .selectpicker').selectpicker('refresh');
    if (vaciar) {
        form=$('#form').val();
        $('#'+form).submit();
    }

}


function toggediv(element){
    if ($("#"+element+":visible").length > 0) {
        hidediv(element);
    }
    else{
        showdiv(element);
    }
}

/*
 *Muestra un elemento oculto
 */
function showdiv(element){
    $('#'+element).show();
}


/*
*Muestra dos elementos oculto
*/
function showdivtwo(element){
  $('.'+element).show();
   document.getElementById('saldo123').style.display = "none";
}

/*
* Oculta dos elementos
*/

function hidedivtwo(element)
{
    $('.'+element).hide();
    $('#tipo1').click();
    document.getElementById('saldo123').style.display = "block";
}


/*
 * Oculta un elemento y si tiene formulario lo reinicia
 */
function hidediv(element, form=null){
    $('#'+element).hide();
    if (form) {
        document.getElementById(form).reset();
        $("#"+form+' .selectpicker').val('').trigger('change');
        $("#"+form).validator('destroy');
        $("#"+form).validator();
    }
}

function nodisabled(form, remove=true, validate=false){
    if (remove) {
        $("#"+form+" input").removeAttr("disabled");
        showdiv('modificar');
        hidediv('boton');
        if (validate) {
            $("#"+form).validate({language: 'es'});
            if ($('#pass').length > 0) {
                if ($('#cambiar').val()==1) {

                    $('#pass').show();
                }
            }

        }


    }
    else{
        $("#"+form+" input").attr("disabled", 'disabled');
        showdiv('boton');
        hidediv('modificar');
        if (validate) {
            $("#"+form).validate('destroy');


        }

    }

}

function number_format(number, seccion=true) {
    decimals=$('#precision').val();
    dec_point=$('#sep_dec').val();
    thousands_sep=$('#sep_miles').val();
    number  = number*1;//makes sure `number` is numeric value
    number = parseFloat(number).toFixed(decimals);
    if (seccion) {
        number = number.replace(".", dec_point);
        var splitNum = number.split(dec_point);
        splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);
        number = splitNum.join(dec_point);
    }

    return number;
}


function modal_show(url, modal){
    $.ajax({
        url: url,
        success: function(data){
            /*
             * Se ejecuta cuando termina la petición y esta ha sido
             * correcta
             * */
            $('#modal-'+modal+'-div').html(data);
            $('#modal-'+modal).modal('show');

        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function enviarForm(form, e){
    e.preventDefault();
}


/* Funciones del modulo de inventario*/

function form_inventario(){

    $("#form-inventario").validate({language: 'es',
        submitHandler: function(form) {
            $('#precio').removeAttr("disabled");
            $('#table_lista_precios tbody tr').each(function() {
                var idlist=$(this).attr('id').split("_")[2];
                $('#preciolistavalor'+idlist).removeAttr("disabled");

            });
            form.submit();
        }
    });
}
function agregarlista_precios(){
    listas=$('#json_precios').val();
    listas=JSON.parse(listas);
    if(listas.length==0)
    {
        $('#error-listas').html('Usted no posee lista de precios');
        $('#error-listas').show();
    }

    nro=$('#table_lista_precios tbody tr').length +1 ;
    if ($('#tr_lista_'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#tr_lista_'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    $('#table_lista_precios tbody').append(
        `<tr id="tr_lista_${nro}">
        <td width="20%"><label class="control-label">Lista de precios <span class="text-danger">*</span></label></td>
        <td width="30%"><select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" name="preciolista[]" id="preciolista${nro}" onchange="change_precio_lista(${nro});" required=""></select></td>
        <td width="30%" class="monetario"><input type="number" class="form-control form-control-sm" id="preciolistavalor${nro}" name="preciolistavalor[]" placeholder="Precio" required="" maxlength="24" min="0"></td>
        <td width="5%"><button type="button" class="btn btn-link" onclick="Eliminar('tr_lista_${nro}');">X</button></td>
      </tr>`
    );
    comprobar_lista_precios(nro);
}

function comprobar_lista_precios(nro, comprobar=false){
    listas=$('#json_precios').val();
    listas=JSON.parse(listas);
    var newlistas=[];
    comprobado=0;

    $('#table_lista_precios tbody tr').each(function() {
        var idlist=$(this).attr('id').split("_")[2];
        list=$('#preciolista'+idlist).val();
        if (list) {
            if (comprobar==list && nro!=idlist && !comprobado) {comprobado=1}
            newlistas.push(parseInt(list));
        }
    });

    if (!comprobar || comprobado) {
        $('#preciolista'+nro+' option').remove();
        $.each( listas, function( key, value ){
            if (newlistas.indexOf(parseInt(value.id))<0) {
                nombre=value.nombre;
                if (value.tipo==1) { nombre+=' ('+value.porcentaje+'%)';}
                $('#preciolista'+nro).append($('<option>',
                    {
                        value: value.id,
                        text: nombre
                    }));
            }
        });
        $('#preciolista'+nro).selectpicker('refresh');
    }
}

function change_precio_lista(nro, new_input=true){
    listas=$('#json_precios').val();
    listas=JSON.parse(listas);
    var lista={};
    precio=$('#precio').val();
    option=$('#preciolista'+nro).val();
    comprobar_lista_precios(nro, option);
    if (option) {
        $.each( listas, function( key, value ){
            if (parseInt(value.id)==parseInt(option)) {
                lista=value;
            }
        });
        if (precio && lista.tipo==1) {
            precio=number_format(precio-(precio*(lista.porcentaje/100)), false);
            $('#preciolistavalor'+nro).val(precio);

        }

        if (lista.tipo==1) {$('#preciolistavalor'+nro).attr('disabled', 'disabled')}
        else{$('#preciolistavalor'+nro).removeAttr('disabled'); if (new_input) {$('#preciolistavalor'+nro).val('');$('#preciolistavalor'+nro).focus();}}
    }

}

function change_precio_listas(){
    $('#table_lista_precios tbody tr').each(function() {
        var idlist=$(this).attr('id').split("_")[2];
        change_precio_lista(idlist, false);
    });
}

function agregarbodega_inventario(){
    bodegas=$('#json_bodegas').val();
    bodegas=JSON.parse(bodegas);
    if(bodegas.length==0)
    {
        $('#error-bodegas').html('Usted no posee lista de precios');
        $('#error-bodegas').show();
    }

    nro=$('#table_bodega tbody tr').length +1 ;
    if ($('#tr_bodega_'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#tr_bodega_'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    var URLactual = window.location.pathname;
    console.log(URLactual);
    /*if(URLactual == '/empresa/facturasp/create' || URLactual == '/empresa/remisiones/create'){
     var tr =`<tr id="tr_bodega_${nro}">
     <td width="15%"><label class="control-label">Bodega <span class="text-danger">*</span></label></td>
     <td width="30%"><select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" name="bodega[]" id="bodega${nro}" required="" onchange="comprobar_bodegas(${nro}, this.value)"></select></td>

     <td width="5%">`;
     }else{*/
    var tr =`<tr id="tr_bodega_${nro}">
        <td width="15%"><label class="control-label">Bodega <span class="text-danger">*</span></label></td>
        <td width="25%"><select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" name="bodega[]" id="bodega${nro}" required="" onchange="comprobar_bodegas(${nro}, this.value)"></select></td> 
        <td width="25%" class="text-center"><label class="control-label">Cantidad Inicial <span class="text-danger">*</span></label></td>
        <td width="25%" class="monetario"><input type="number" min="1" class="form-control form-control-sm" id="bodegavalor${nro}" name="bodegavalor[]" required="" maxlength="24" min="0"></td>
        <td width="5%">`;
    //}


    if (nro!=1) {
        tr+=` <button type="button" class="btn btn-link" onclick="Eliminar('tr_bodega_${nro}');">X</button>`;
    }
    tr+=`</td></tr>`;
    $('#table_bodega tbody').append(tr);
    comprobar_bodegas(nro);
}

function eliminarbodega_inventario(){
    $('#table_bodega tbody tr').each(function() {
        var idlist=$(this).attr('id');
        Eliminar(idlist);
    });
}
function comprobar_bodegas(nro, comprobar=false){
    bodegas=$('#json_bodegas').val();
    bodegas=JSON.parse(bodegas);
    var newbodegas=[];
    comprobado=0;

    $('#table_bodega tbody tr').each(function() {
        var idlist=$(this).attr('id').split("_")[2];
        list=$('#bodega'+idlist).val();
        if (list) {
            if (comprobar==list && nro!=idlist && !comprobado) {comprobado=1}
            newbodegas.push(parseInt(list));
        }
    });
    if (!comprobar || comprobado) {
        $('#bodega'+nro+' option').remove();
        $.each( bodegas, function( key, value ){
            if (newbodegas.indexOf(parseInt(value.id))<0) {
                $('#bodega'+nro).append($('<option>',
                    {
                        value: value.id,
                        text: value.bodega
                    }));
            }
        });
        $('#bodega'+nro).selectpicker('refresh');
    }
}

/* Funciones del modulo de transferencia entre bodegas*/
function diferentes_bodegas(entrada){
    $('#bodega_origen-error').html('');
    $('#bodega_destino-error').html('');
    if ($('#bodega_origen').val() == $('#bodega_destino').val()) {
        $('#boton_guardar').attr('disabled', 'disabled');
        $('#'+entrada+'-error').html('La bodega de origen y la bodega de destino no pueden ser la misma');
    }
    else{
        $('#boton_guardar').removeAttr('disabled');
    }

    $('#nombre_bodega').html($('#bodega_origen option:selected').text());
    if (entrada=='bodega_origen') {
        selected=$('#bodega_origen').val();

        final=$('#url').val()+'/empresa/inventario/bodegas/'+selected+'/json';
        $.ajax({
            url: final,
            beforeSend: function(){
                cargando(true);
            },
            success: function(data){
                /*
                 * Se ejecuta cuando termina la petición y esta ha sido
                 * correcta
                 * */
                $('#json_inventario').val(data);
                data=JSON.parse(data);
                //table_form_transferencia
                $('#table_form_transferencia  tbody tr').each(function() {
                    id=$(this).attr('id');
                    $('#item'+id+' option').remove();
                    $('#ref'+id).html('');
                    $('#cantI'+id).html('');
                    $('#cantT'+id).html('');
                    $('#cant'+id).val('');
                    $('#cantTB'+id).html('');

                    var $select = $('#item'+id);
                    $select.find('option').remove();
                    $.each(data,function(key, value)
                    {
                        //$select.append('<option value=' + value.id_producto + '>' + value.producto + '</option>');
                        $select.append('<option value=' + value.id_producto + '>' + value.producto +' - ('+value.ref+')' +'</option>');
                    });
                    $select.selectpicker('refresh');
                });
                cargando(false);
            },
            error: function(data){
                /*
                 * Se ejecuta si la peticón ha sido erronea
                 * */
                alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
            }
        });


    }

}



function createRowTransferencia() {
    var nro=$('#table_form_transferencia tbody tr').length +1 ;
    if ($('#'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    $('#table_form_transferencia tbody').append(
        `<tr  id="${nro}">` +
        `<td>
      <select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="item[]" id="item${nro}" required="" onchange="ritemtrans(${nro}, this.value);"></select>
      <label id="item${nro}-error" class="error" for="item${nro}"></label></td>
      <td id="ref${nro}"></td>
      <td id="cantI${nro}"></td>
      <td id="cantT${nro}"></td>
      <td><input type="number" class="form-control form-control-sm" id="cant${nro}" name="cant[]" placeholder="Cantidad" onchange="total_transferir(${nro});" min="0" required=""></td>
      <td id="cantTB${nro}"></td>
      <td><button type="button" class="btn btn-link btn-icons" onclick="Eliminar('${nro}'); comprobar_items_transferencia();">X</button></td>
    ` +
        `</tr>`
    );
    data=$('#json_inventario').val();
    console.log(data);
    data=JSON.parse(data);
    var $select = $('#item'+nro);
    $.each(data,function(key, value)
    {
        //$select.append('<option value=' + value.id_producto + '>' + value.producto + '</option>');
        $select.append('<option value=' + value.id_producto + '>' + value.producto +' - ('+value.ref+')' +'</option>');
    });

    $select.selectpicker('refresh');
}

function comprobar_items_transferencia(){
    array=[];
    entro=true;
    $('#table_form_transferencia  tbody tr').each(function() {
        id=$(this).attr('id');
        selected=$('#item'+id).val();
        if (selected) {
            if (array.indexOf(selected)>=0) {
                $('#item'+id+'-error').html('Esta repetido el item');
                $('#boton_guardar').attr('disabled', 'disabled');
                entro=false;
            }
            else{
                $('#item'+id+'-error').html(' ');
            }
            array.push(selected);
        }
    });
    if(entro){
        $('#boton_guardar').removeAttr('disabled');

    }
    return entro;
}

function ritemtrans(nro, selected){
    if (!comprobar_items_transferencia()) {return false;}
    data=$('#json_inventario').val();
    data=JSON.parse(data);
    $.each(data,function(key, value)
    {
        if (value.id_producto==selected) {
            $('#ref'+nro).html(value.ref);
            $('#cantI'+nro).html(value.inicial);
            $('#cantT'+nro).html(value.nro);
            $('#cant'+nro).attr("max", value.nro);
        }
    });

}

function total_transferir(nro){
    total=$('#cantT'+nro).html();
    total-=$('#cant'+nro).val();
    $('#cantTB'+nro).html(total);

}

function traer_inventario(){
    selected=$('#bodega').val();
    final=$('#url').val()+'/empresa/inventario/bodegas/'+selected+'/json';
    $.ajax({
        url: final,
        beforeSend: function(){
            cargando(true);
        },
        success: function(data){
            /*
             * Se ejecuta cuando termina la petición y esta ha sido
             * correcta
             * */
            $('#json_inventario').val(data);
            data=JSON.parse(data);
            $('#item option').remove();
            $('#costo').val('');
            $('#cantA').val('');
            $('#cant').val('');
            $('#cantF').val('');
            var $select = $('#item');
            $select.find('option').remove();
            $select.find('option').remove();
            $.each(data,function(key, value)
            {
                $select.append('<option value=' + value.id_producto + '>' + value.producto+' - ('+value.ref+')' + '</option>');
            });
            $select.selectpicker('refresh');

            cargando(false);
        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function traer_item(){
    selected=$('#item').val();
    data=$('#json_inventario').val();
    data=JSON.parse(data);
    $.each(data,function(key, value)
    {
        if (value.id_producto==selected) {
            $('#costo').val(value.precio);
            $('#cantA').val(value.nro);
            $('#cant').val('');
            $('#cantF').val('');
        }
    });

}

function cantidadFinal(){
    tipo = $('input[name=ajuste]:checked').val();
    cant=parseFloat($('#cant').val());
    cantA=$('#cantA').val();
    total=0;
    if (cant && cantA) {
        cantA=parseFloat(cantA);
        if (tipo==0) {
            total=cantA-cant;
        }
        else{
            total=cantA+cant;
        }
        $('#cantF').val(total);
    }

    if (total<0) {
        $('#cant-error-error').html('No puede quedar la cantidad Final en números negativos');
        $('#boton_guardar').attr('disabled', 'disabled');
    }
    else{
        $('#cant-error-error').html(' ');
        $('#boton_guardar').removeAttr('disabled');
    }


}

function autocomplete(id){
    var search=JSON.parse($('#search'+id).val());
    $('#'+id+'-autocomplete').autoComplete({
        minChars: 1,
        source: function(term, suggest){
            term = term.toLowerCase();
            var choices = search;
            var matches = [];
            for (i=0; i<choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
            suggest(matches);
        }
    });
}

/* Funciones del modulo de facturas*/

function factura_pendiente(ingreso=false){
    if (($('input:radio[name=tipo]:checked').val()!=1 && $('#inputremision').length==0) || ($('#inputremision').length ==0 && $('#tipo1').length==0 ) ){

        return false;
    }
    if (!$('#cliente').val()) {
        $('#factura_pendiente').html('<p class="text-warning text-center">Para asociar este pago a una <b>factura de venta</b>, primero debes seleccionar un cliente que tenga facturas de venta pendientes por pagar </p>');
        return false;
    }
    url =$('#url').val()+'/empresa/ingresos';
    if ($('#inputremision').length>0) {
        url+='r';
    }
    final =url+'/pendiente/'+$('#cliente').val();
    if ($('#factura').length > 0 ) {
        final=final+'/'+$('#factura').val();
    }

    if (ingreso) {
        final =url+'/ingpendiente/'+$('#cliente').val()+'/'+ingreso;
    }
    $.ajax({
        url: final,
        success: function(data){
            /*
             * Se ejecuta cuando termina la petición y esta ha sido
             * correcta
             * */
            $('#factura_pendiente').html(data);

            $('.precio').mask('0000000000.00', {reverse: true});

        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function createRowContato() {
    var nro=$('#table-form-contacto tbody tr').length +1 ;
    if ($('#'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    $('#table-form-contacto tbody').append(
        `<tr  id="${nro}">` +
        `<td>
        <input type="text" name="nombre_contacto[]"  id="nombre${nro}" class="form-control form-control-sm" required="" placeholder="Nombre y Apellido" maxlength="200">
      </td>
      <td>
        <input type="email" name="email_contacto[]" id="email${nro}" class="form-control form-control-sm"  placeholder="Correo Electrónico" maxlength="200">
      </td>
      <td>
        <input type="text" name="telefono_contacto[]" id="telefono${nro}" class="form-control form-control-sm telefono" required="" placeholder="Teléfono">
      </td>
      <td>
        <input type="text" name="celular_contacto[]" id="celular${nro}" class="form-control form-control-sm telefono" placeholder="Celular">
      </td>
      <td>
        <input type="hidden" name="notificacion[]" id="notificacion${nro}" value="0">
        <div class="form-check form-check-flat" style="    margin-left: 33%;">
          <label class="form-check-label" style="padding: 0; width: 20%;">
          <input type="checkbox" class="form-check-input" name="notif[]" id="notif${nro}" value="1" onchange="notif('${nro}');">Si
          <i class="input-helper"></i></label>
        </div>
      </td>
      <td><button type="button" onclick="Eliminar(${nro});" class="btn btn-outline-secondary btn-icons">X</button></td>
    ` +
        `</tr>`
    );

    $('.telefono').mask('+00 000000000000');
    $("#form-contacto").validate({language: 'es'});

}


function notif(id){
    if($("#notif"+id).is(':checked')) {
        $('#notificacion'+id).val(1);
    }
    else{
        $('#notificacion'+id).val(0);
    }
}




/*Funciones de Facturas*/

/* Muestra la identificacion y el telefono del contacto */
/*function contacto(selected, modificar=false){
    url=$('#url').val()+'/empresa/contactos/'+selected+'/json';

    $.ajax({
        url: url,
        beforeSend: function(){
            cargando(true);
        },
        success: function(data){
            data=JSON.parse(data);
            if ($('#ident').length > 0) {
                $('#ident').val(data.nit);
                $('#telefono').val(data.telefono1);
            }
            if (!modificar) {
                $('#vendedor').val(data.vendedor);
                $('#vendedor').selectpicker('refresh');
                if (!data.lista_precio) {
                    $("#lista_precios").val($("#lista_precios option:first").val()).trigger('change');
                }
                else{
                    $('#lista_precios').val(data.lista_precio).trigger('change');
                }
                $('#lista_precios').selectpicker('refresh');
            }

            cargando(false);
        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });


}*/

function contacto(selected, modificar=false){
    url=$('#url').val()+'/empresa/contactos/'+selected+'/json';

    $.ajax({
        url: url,
        beforeSend: function(){
            cargando(true);
        },
        success: function(data){
            data=JSON.parse(data);
            //console.log(data);
            if (data.fk_iddepartamento == null || data.fk_idpais == null  || data.fk_idmunicipio == null) {
                var route = "/getDataClient/"+data.id;
                $.get(route, function(client)
                {
                    $("#conte-modalesedit").empty(client);

                    $("#modaleditDirection").modal("show");

                    $("#conte-modalesedit").append(client);

                    tippy('#tippycodigo',{
                        content: 'Si desconoces tu código postal <a target=\'_blank\' href=\'http://visor.codigopostal.gov.co/472/visor/\'>haz click aquí</a>',
                        animation: 'perspective',
                        arrow: true,
                        arrowType: 'sharp',
                        interactive: true,
                    });
                    $("#pais").selectpicker('refresh');
                    $("#departamento").selectpicker('refresh');
                    $("#municipio").selectpicker('refresh');

                    //action = "/updatedirection/client"
                    //document.getElementById("form-editDirection").action = action;
                })  
            }else{
             if ($('#ident').length > 0) {
                $('#ident').val(data.nit);
                $('#telefono').val(data.telefono1);
            }
            if (!modificar) {
                $('#vendedor').val(data.vendedor);
                $('#vendedor').selectpicker('refresh');
                if (!data.lista_precio) {
                    $("#lista_precios").val($("#lista_precios option:first").val()).trigger('change');
                }
                else{
                    $('#lista_precios').val(data.lista_precio).trigger('change');
                }
                $('#lista_precios').selectpicker('refresh');
            }
        }
        cargando(false);
    },
    error: function(data){
        alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
    }
});


}
/* Refresca el array de contactos del select */
function contactos(url, input){
    $.ajax({
        url: url,
        beforeSend: function(){
            cargando(true);
        },
        success: function(data){
            data=JSON.parse(data);
            var $select = $('#'+input);
            $select.find('option').remove();
            $.each(data,function(key, value)
            {
                $select.append('<option value=' + value.id + '>' + value.nombre + '</option>');
            });

            $select.selectpicker('refresh');
            $('#ident').val('');
            $('#telefono').val('');
            cargando(false);
        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}



/* Refresca el array de inventario (Item) del select */
function inventario(input){
    data={'precios':$('#lista_precios').val(), 'bodega': $('#bodega').val()};
    $.ajax({
        url: $('#jsonproduc').val(),
        data:data,
        beforeSend: function(){
            cargando(true);
        },
        success: function(data){
            $('#allproductos').val(data);
            data=JSON.parse(data);
            var $select = $('#item'+input);
            $select.find('option').remove();
            $.each(data,function(key, value)
            {
                $select.append('<option value=' + value.id + '>' + value.producto + ' - ' + '('+ value.ref +')'+ '</option>');
            });
            $select.selectpicker('refresh');
            $('#ref'+input).val('');
            $('#precio'+input).val('');
            $('#desc'+input).val('');
            $('#descripcion'+input).val('');
            $('#cant'+input).val('');
            $('#total'+input).val('');
            $("#impuesto"+input).val('').trigger('change');
            $("#impuesto"+input).selectpicker('refresh');
            cargando(false);
        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

/* Agrega una nueva fila a la tabla facturas */
function createRow() {
    $('#error-items').hide();
    var nro = $('#table-form tbody tr').length + 1;
    if ($('#' + nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#' + i).length == 0) {
                nro = i;
                break;
            }
        }
    }
    factura = true;
    ref = true;
    prove = false;
    if ($('#cotizacion_si').length > 0) {
        factura = false;
        prove = true;
    }
    if ($('#orden_si').length > 0) {
        ref = false;
    }
    datos = `<tr  id="${nro}">`;
    if (factura) {
        datos += `<td class="no-padding"><a class="btn btn-outline-secondary btn-icons" title="Actualizar" onclick="inventario('${nro}');" id="actualizar${nro}"><i class="fas fa-sync"></i></a></td>`;

    }
    datos += `<td class="no-padding"><select required="" class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="item[]" id="item${nro}" onchange="rellenar(` + nro + `, this.value);">
        </select >`;
    if (factura || prove) {
        datos += `<p style="text-align: left;     margin: 0;"> 
        <a href="" data-toggle="modal" data-target="#modalproduct" class="modalTr" tr="${nro}"><i class="fas fa-plus"></i> Nuevo Producto</a></p>`;

    }

    if (ref) {
        datos += `<input type="hidden" name="camposextra[]" value="${nro}"></td>
     <td >
      <input type="text" class="form-control form-control-sm" id="ref${nro}" name="ref[]" placeholder="Referencia" required="">
    </td>`;
    }
    datos += ` 
    <td class="monetario">
      <input type="number" class="form-control form-control-sm" id="precio${nro}" maxlength="24" min="0" name="precio[]" placeholder="Precio Unitario" onkeyup="total(${nro})" required="">
    </td>
            <td>
      <input type="text" class="form-control form-control-sm nro" id="desc${nro}" name="desc[]" maxlength="5" placeholder="%"  onkeyup="total(${nro})">
    </td>
            <td>
      <select class="form-control form-control-sm selectpicker" name="impuesto[]" id="impuesto${nro}" title="Impuesto" onchange="total(${nro})" required="">
                
              </select>
    </td>
            <td  style="padding-top: 1% !important;">                           
      <textarea  class="form-control form-control-sm" id="descripcion${nro}" name="descripcion[]" placeholder="Descripción"></textarea>
            </td>
            <td>
      <input type="number" class="form-control form-control-sm" id="cant${nro}" name="cant[]" placeholder="Cantidad"  maxlength="24" onchange="total(${nro});" min="1" required="">
      <p class="text-danger nomargin" id="pcant${nro}"></p></td>
            <td>
      <input type="text" class="form-control form-control-sm text-right" id="total${nro}" value="0" disabled=""></td>
      <td><button type="button" onclick="Eliminar(${nro});" class="btn btn-outline-secondary btn-icons">X</button></td>
    ` +
        `</tr>`;
    $('#table-form tbody').append(datos);
    var impuestos = JSON.parse($('#impuestos').val());
    $.each(impuestos, function (key, value) {
        $('#impuesto' + nro).append($('<option>',
            {
                value: value.id,
                text: value.nombre + "-" + value.porcentaje + "%"
            }));
    });

    var obj = JSON.parse($('#allproductos').val());
    var optios = '';
    if ($('#orden_si').length > 0) {
        optios += "<optgroup  label='Ítems inventariables'>";
    }

    $.each(obj, function (key, value) {
        optios += "<option  value='" + value.id + "'>"+ value.producto + ' - ' + '('+ value.ref +')'+ " </option>";
    });

    if ($('#orden_si').length > 0) {
        optios += " </optgroup>";
        optios += $('#allcategorias').val();

    }

    $('#item' + nro).append(optios);

    $('.precio').mask('0000000000.00', {reverse: true});
    $('.nro').mask('000');
    $('#item' + nro).selectpicker();
    $('#impuesto' + nro).selectpicker();

}

/* Funcion para agregar filas en la tabla de facturas de proveedores */
function createRowInceru() {
    $('#error-items').hide();
    var nro = $('#table-form tbody tr').length + 1;
    if ($('#' + nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#' + i).length == 0) {
                nro = i;
                break;
            }
        }
    }
    factura = true;
    ref = true;
    if ($('#cotizacion_si').length > 0) {
        factura = false;
    }
    if ($('#orden_si').length > 0) {
        ref = false;
    }
    datos = `<tr  id="${nro}">`;
    if (factura) {
        datos += `<td class="no-padding"><a class="btn btn-outline-secondary btn-icons" title="Actualizar" onclick="inventario('${nro}');" id="actualizar${nro}"><i class="fas fa-sync"></i></a></td>`;

    }
    datos += `<td class="no-padding"><select required="" class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="item[]" id="item${nro}" onchange="rellenarinceru(` + nro + `, this.value);">
        </select >`;
    if (factura) {
        datos += `<p style="text-align: left;     margin: 0;"> 
        <a href="" data-toggle="modal" data-target="#modalproduct" class="modalTr" tr="${nro}"><i class="fas fa-plus"></i> Nuevo Producto</a></p>`;

    }

    if (ref) {
        datos += `<input type="hidden" name="camposextra[]" value="${nro}"></td>
     <td >
      <input type="text" class="form-control form-control-sm" id="ref${nro}" name="ref[]" placeholder="Referencia" required="">
    </td>`;
    }
    datos += ` 
    <td class="monetario">
      <input type="number" class="form-control form-control-sm" id="precio${nro}" maxlength="24" min="0" name="precio[]" placeholder="Precio Unitario" onkeyup="total(${nro})" required="">
    </td>
            <td>
      <input type="text" class="form-control form-control-sm nro" id="desc${nro}" name="desc[]" maxlength="5" placeholder="%"  onkeyup="total(${nro})">
    </td>
            <td>
      <select class="form-control form-control-sm selectpicker" name="impuesto[]" id="impuesto${nro}" title="Impuesto" onchange="total(${nro})" required="">
                
              </select>
    </td>
            <td  style="padding-top: 1% !important;">                           
      <textarea  class="form-control form-control-sm" id="descripcion${nro}" name="descripcion[]" placeholder="Descripción"></textarea>
            </td>
            <td>
      <input type="number" class="form-control form-control-sm" id="cant${nro}" name="cant[]" placeholder="Cantidad"  maxlength="24" onchange="total(${nro});" min="1" required="">
      <p class="text-danger nomargin" id="pcant${nro}"></p></td>
            <td>
      <input type="text" class="form-control form-control-sm text-right" id="total${nro}" value="0" disabled=""></td>
      <td><button type="button" onclick="Eliminar(${nro});" class="btn btn-outline-secondary btn-icons">X</button></td>
    ` +
        `</tr>`;
    $('#table-form tbody').append(datos);
    var impuestos = JSON.parse($('#impuestos').val());
    $.each(impuestos, function (key, value) {
        $('#impuesto' + nro).append($('<option>',
            {
                value: value.id,
                text: value.nombre + "-" + value.porcentaje + "%"
            }));
    });

    var obj = JSON.parse($('#allproductos').val());
    var optios = '';
    if ($('#orden_si').length > 0) {
        optios += "<optgroup  label='Ítems inventariables'>";
    }

    $.each(obj, function (key, value) {
        optios += "<option  value='" + value.id + "'>"+ value.producto + ' - ' + '('+ value.ref +')'+ " </option>";
    });

    if ($('#orden_si').length > 0) {
        optios += " </optgroup>";
        optios += $('#allcategorias').val();

    }

    $('#item' + nro).append(optios);

    $('.precio').mask('0000000000.00', {reverse: true});
    $('.nro').mask('000');
    $('#item' + nro).selectpicker();
    $('#impuesto' + nro).selectpicker();

}
/*function createRow() {
 $('#error-items').hide();
 var nro=$('#table-form tbody tr').length +1 ;
 if ($('#'+nro).length > 0) {
 for (i = 1; i <= nro; i++) {
 if ($('#'+i).length == 0) {
 nro=i;
 break;
 }
 }
 }
 factura=true;
 ref=true;
 if ($('#cotizacion_si').length > 0) {
 factura=false;
 }
 if ($('#orden_si').length > 0) {
 ref=false;
 }
 datos=`<tr  id="${nro}">` ;
 if (factura) {
 datos+=`<td class="no-padding"><a class="btn btn-outline-secondary btn-icons" title="Actualizar" onclick="inventario('${nro}');"><i class="fas fa-sync"></i></a></td>`;

 }
 datos+= `<td class="no-padding"><select required="" class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="item[]" id="item${nro}" onchange="rellenar(`+nro+`, this.value);">
 </select >`;


 if (ref) {
 datos+=`<input type="hidden" name="camposextra[]" value="${nro}"></td>
 <td >
 <input type="text" class="form-control form-control-sm" id="ref${nro}" name="ref[]" placeholder="Referencia" required="">
 </td>`;
 }
 datos+=`
 <td class="monetario">
 <input type="number" class="form-control form-control-sm" id="precio${nro}" maxlength="24" min="0" name="precio[]" placeholder="Precio Unitario" onkeyup="total(${nro})" required="">
 </td>
 <td>
 <input type="text" class="form-control form-control-sm nro" id="desc${nro}" name="desc[]" maxlength="5" placeholder="%"  onkeyup="total(${nro})">
 </td>
 <td>
 <select class="form-control form-control-sm selectpicker" name="impuesto[]" id="impuesto${nro}" title="Impuesto" onchange="total(${nro})" required="">

 </select>
 </td>
 <td  style="padding-top: 1% !important;">
 <textarea  class="form-control form-control-sm" id="descripcion${nro}" name="descripcion[]" placeholder="Descripción"></textarea>
 </td>
 <td>
 <input type="number" class="form-control form-control-sm" id="cant${nro}" name="cant[]" placeholder="Cantidad"  maxlength="24" onchange="total(${nro});" min="1" required="">
 <p class="text-danger nomargin" id="pcant${nro}"></p></td>
 <td>
 <input type="text" class="form-control form-control-sm text-right" id="total${nro}" value="0" disabled=""></td>
 <td><button type="button" onclick="Eliminar(${nro});" class="btn btn-outline-secondary btn-icons">X</button></td>
 ` +
 `</tr>`;
 $('#table-form tbody').append( datos);
 var impuestos = JSON.parse($('#impuestos').val());
 $.each( impuestos, function( key, value ){
 $('#impuesto'+nro).append($('<option>',
 {
 value: value.id,
 text : value.nombre+"-"+ value.porcentaje+"%"
 }));
 });

 var obj = JSON.parse($('#allproductos').val());
 var optios='';
 if ($('#orden_si').length > 0) {
 optios+="<optgroup  label='Ítems inventariables'>";
 }

 $.each( obj, function( key, value ){
 optios+="<option  value='"+value.id+"'>"+value.producto+ "- ("+value.ref+") </option>";
 });

 if ($('#orden_si').length > 0) {
 optios+=" </optgroup>";
 optios+=$('#allcategorias').val();

 }



 $('#item'+nro).append(optios);


 $('.precio').mask('0000000000.00', {reverse: true});
 $('.nro').mask('000');
 $('#item'+nro).selectpicker();
 $('#impuesto'+nro).selectpicker();

 }*/

function contacto_rapido(reverse=false){
    if (!reverse) {
        showdiv('contacto-rapido'); hidediv('div-contacto');
        $('#clienterapido').prop("required", true);
        $('#cliente').removeAttr("required");
        $('#tipocliente').val(0);

        $('#cliente').val("");
        $('#cliente').selectpicker('refresh');
    }
    else{
        $('#tipocliente').val(1);
        hidediv('contacto-rapido'); showdiv('div-contacto');
        $('#clienterapido').removeAttr("required");
        $('#cliente').prop("required", true);
        $('#clienterapido').val("");
        $('#telefono').val("");
        $('#email').val("");

    }
}

function createRowNoInventario() {

    $('#error-items').hide();
    var nro=$('#table-form tbody tr').length +1 ;
    if ($('#'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    factura=true;

    var impuestos = JSON.parse($('#camposestras').val());
    if ($('#cotizacion_si').length > 0) {
        factura=false;
    }
    datos=`<tr  id="${nro}">` ;
    if (factura) {
        datos+=`<td class="no-padding"><a class="btn btn-outline-secondary btn-icons" title="Actualizar" onclick="inventario('${nro}');"><i class="fas fa-sync"></i></a></td>`;

    }
    datos+= `<td><input type="text" class="form-control form-control-sm" name="item[]" id="item${nro}" required="" placeholder="Nombre del Item">`;
    if (factura) {
        datos+= `<p style="text-align: left;     margin: 0;"> 
        <a href="`+$('#url').val()+`/empresa/inventario/create" target="_blanck"><i class="fas fa-plus"></i> Nuevo Producto</a></p>`;

    }
    else{
        if (impuestos.length>0) {
            datos+=`<p class="text-left" style="margin: 0;"> <button type="button" class="btn  btn-xs btn-sm btn-link" onclick="camposextras('${nro}');"><i class="fas fa-plus"></i>Agregar Campos Extras</button></p><div id="extra${nro}"></div>`;
        }

    }
    datos+=` <input type="hidden" name="camposextra[]" value="${nro}"></td>
     <td >
      <input type="text" class="form-control form-control-sm" id="ref${nro}" name="ref[]" placeholder="Referencia">
    </td>
    <td class="monetario">
      <input type="number" class="form-control form-control-sm" id="precio${nro}" min="0" maxlength="24" name="precio[]" placeholder="Precio Unitario" onkeyup="total(${nro})" required="">
    </td>
            <td>
      <input type="text" class="form-control form-control-sm nro" id="desc${nro}" name="desc[]" maxlength="5" placeholder="%"  onkeyup="total(${nro})">
    </td>
            <td>
      <select class="form-control form-control-sm selectpicker" name="impuesto[]" id="impuesto${nro}" title="Impuesto" onchange="total(${nro})" required="">
                
              </select>
    </td>
            <td  style="padding-top: 1% !important;">                           
      <textarea  class="form-control form-control-sm" id="descripcion${nro}" name="descripcion[]" placeholder="Descripción"></textarea>
            </td>
            <td>
      <input type="number" class="form-control form-control-sm" id="cant${nro}" name="cant[]" placeholder="Cantidad"  maxlength="24" onchange="total(${nro});" min="1" required="">
      <p class="text-danger nomargin" id="pcant${nro}"></p></td>
            <td>
      <input type="text" class="form-control form-control-sm text-right" id="total${nro}" value="0" disabled=""></td>
      <td><button type="button" onclick="Eliminar(${nro});" class="btn btn-outline-secondary btn-icons">X</button></td>
    ` +
        `</tr>`;
    $('#table-form tbody').append( datos
    );
    var impuestos = JSON.parse($('#impuestos').val());
    $.each( impuestos, function( key, value ){
        $('#impuesto'+nro).append($('<option>',
            {
                value: value.id,
                text : value.nombre+"-"+ value.porcentaje+"%"
            }));
    });
    $('.precio').mask('0000000000.00', {reverse: true});
    $('.nro').mask('000');
    $('#impuesto'+nro).selectpicker();

}

function camposextras(id){
    var nro=parseFloat($('#extra'+id+' > div').length)+1;
    if ($('#divextra'+id+'_'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#divextra'+id+'_'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    array=[];
    extra=$('#extra'+id+' > div').each(function() {
        div=$(this).attr('id');
        if ($('#'+div+' select').val()) {
            array.push($('#'+div+' select').val());}
    });
    var impuestos = JSON.parse($('#camposestras').val());
    $('#extra'+id).append( `<div id="divextra${id}_${nro}" class="row">
    <div class="col-sm-5 no-padding"><select required="" class="form-control form-control-sm selectpicker"  title="Seleccione" data-live-search="true" data-size="5" name="campoextra${id}[]" id="campoextra${id}_${nro}"></select> </div>
    <div class="col-sm-5 no-padding"><input type="text" class="form-control form-control-sm" style="margin-top: 3%;" name="datoextra${id}[]" id="datoextra${id}_${nro}" required="" placeholder="Dato"></div>
    <div class="col-sm-2 no-padding"><button type="button" onclick="Eliminar('divextra${id}_${nro}');" class="btn btn-link btn-icons">X</button></div>
    </div>`);
    $.each( impuestos, function( key, value ){
        idi=value.id;
        if (array.indexOf(idi.toString())<0) {
            $('#campoextra'+id+'_'+nro).append($('<option>',
                {
                    value: value.id,
                    text : value.nombre
                }));
        }
    });

    $('#campoextra'+id+'_'+nro).selectpicker();

}

/* Rellena la columna segun el item seleccionado (facturas) */
function rellenar(id, selected, producto=false){
    if (!$.isNumeric( selected )) { $('#precio'+id).focus(); return false;  }

    data={'precios':$('#lista_precios').val(), 'bodega': $('#bodega').val()};

    url=$('#url').val()+'/empresa/inventario/'+selected+'/json';
    $.ajax({
        data:data,
        url: url,
        success: function(data){


            $('#pcant'+id).html('');
            $('#cant'+id).removeAttr("max");
            data=JSON.parse(data);

            $('#ref'+id).val(data.ref);
            if (data.tipo_producto==1 && ('#orden_si').length==0) {
                if (data.nro>0) {
                    $('#cant'+id).attr("max", data.nro);
                }
                if (data.nro<11) {
                    $('#pcant'+id).html('Disp '+data.nro);
                }
            }
            console.log(data.inventariable);
            if(data.inventario<=0 && data.inventariable){
                jQuery('#noMore').append(`<div class="alert alert-warning alert-dismissible fade show" id="alertInventario" role="alert">
            <strong>¡Atención!</strong> Usted esta intentando facturar un producto que no tiene unidades en inventario.
             ¿Desea continuar? <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span> </button></div>`);
                setTimeout(function(){
                    $('#alertInventario').remove();
                }, 5000);
            }

            $('#precio'+id).val(data.precio);
            if (data.precio_secun) {
                $('#precio'+id).val(data.precio_secun);
            }
            $("#impuesto"+id+" option[value="+data.id_impuesto+"]").attr('selected', 'selected');
            $('#impuesto'+id).selectpicker('refresh');
            $('#cant'+id).val(1);
            total(id);
            totalall();

        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });

}

/*----- Rellenar en cero la tabla de nueva factura de compra -------*/

function rellenarinceru(id, selected, producto=false){
    if (!$.isNumeric( selected )) { $('#precio'+id).focus(); return false;  }

    data={'precios':$('#lista_precios').val(), 'bodega': $('#bodega').val()};

    url=$('#url').val()+'/empresa/inventario/'+selected+'/json';
    $.ajax({
        data:data,
        url: url,
        success: function(data){

            $('#pcant'+id).html('');
            $('#cant'+id).removeAttr("max");
            data=JSON.parse(data);
            //console.log(data);

            $('#ref'+id).val(data.ref);
            if (data.tipo_producto==1 && ('#orden_si').length==0) {
                if (data.nro>0) {
                    $('#cant'+id).attr("max", data.nro);
                }
                if (data.nro<11) {
                    $('#pcant'+id).html('Disp '+data.nro);
                }
            }
            console.log(data.inventariable);
            if(data.inventario<=0 && data.inventariable){
                jQuery('#noMore').append(`<div class="alert alert-warning alert-dismissible fade show" id="alertInventario" role="alert">
            <strong>¡Atención!</strong> Usted esta intentando facturar un producto que no tiene unidades en inventario.
             ¿Desea continuar? <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span> </button></div>`);
                setTimeout(function(){
                    $('#alertInventario').remove();
                }, 5000);
            }
            //data.precio = 0;
            $('#precio'+id).val(data.costo_unidad);
            if (data.precio_secun) {
                $('#precio'+id).val(data.precio_secun);
            }
            $("#impuesto"+id+" option[value="+data.id_impuesto+"]").attr('selected', 'selected');
            $('#impuesto'+id).selectpicker('refresh');
            $('#cant'+id).val(1);
            total(id);
            totalall();

        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });

}

function cambiar_precios(){
    data={'precios':$('#lista_precios').val(), 'bodega': $('#bodega').val()};
    $.ajax({
        url: $('#jsonproduc').val(),
        data:data,
        beforeSend: function(){
            cargando(true);
        },
        success: function(data){
            $('#allproductos').val(data);
            data=JSON.parse(data);
            $('#table-form  tbody tr').each(function() {
                id=$(this).attr('id');
                item=$('#item'+id).val();
                precio=$('#precio'+id).val();
                $.each( data, function( key, value ){
                    if (value.id==item) {
                        precio=value.precio;
                        if (value.precio_secun) {
                            precio=value.precio_secun;
                        }
                    }
                });
                $('#precio'+id).val(precio);
                total(id);
            });
            totalall();
            cargando(false);
        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function cambiar_bodega(){
    if ($('#orden_si').length > 0){
        data={'precios':$('#lista_precios').val(), 'bodega': $('#bodega').val(), 'inventariables': true};
    }
    else{
        data={'precios':$('#lista_precios').val(), 'bodega': $('#bodega').val()};
    }
    $.ajax({
        url: $('#jsonproduc').val(),
        data:data,
        beforeSend: function(){
            cargando(true);
        },
        success: function(data){
            $('#allproductos').val(data);
            data=JSON.parse(data);
            count=$('#table-form  tbody tr').length;
            $('#table-form  tbody tr').each(function() {
                id=$(this).attr('id');
                Eliminar(id);
            });
            for (var i = 1; i <=count; i++) {
                createRow();
            }
            totalall();
            cargando(false);
        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}
/*Saca el total de una columna en facturas*/
function total(id){
    var precio= $('#precio'+id).val();
    var cant= $('#cant'+id).val();
    if (precio>0 && cant>0) {
        var desc=$('#desc'+id).val();
        var total=precio*cant;

        if (desc.length>0) {
            if (desc>0) {
                desc=(total*desc)/100;
                total=total-desc;
            }
        }
        $('#total'+id).val(number_format(total));
    }
    totalall();
}

/*Saca la cuenta total de todos los items en facturas*/
function totalall(){
    var array= $('#impuestos').val();
    array=JSON.parse(array);
    $.each( array, function( key, value ){
        array[key].total=0;
    });
    var id;  var precio;  var cant; var fila; var desc; var impuesto;
    var total=0; var descuento=0; var tot = 0;
    $('#table-form  tbody tr').each(function() {
        id=$(this).attr('id');
        var impuesto= $('#impuesto'+id).val();
        var precio= $('#precio'+id).val();
        var cant= $('#cant'+id).val();
        var desc=$('#desc'+id).val();
        fila=precio*cant;
        total+=fila;
        if (desc.length>0) {
            if (desc>0) {
                desc=(fila*desc)/100;
            }
        }
        else{
            desc=0;
        }
        descuento+=desc;
        fila=fila-desc;
        if (impuesto>0) {
            $.each( array, function( key, value ){
                if (value.id==impuesto) {
                    impuesto=(fila*value.porcentaje)/100;
                    array[key].total+=impuesto;
                }
            });
        }
    });

    if ($('#subtotal_categoria_js').length>0 && $('#retenciones').length>0) {
        var retenciones = JSON.parse($('#retenciones').val());
        $.each( retenciones, function( key, value ){
            retenciones[key].total=0;
        });
    }

    if (total>0) {
        $('#subtotal').html(number_format(total));
        tot = total-descuento;
        if ($('#subtotal_categoria_js').length>0 && $('#retenciones').length>0) {
            $('#subtotal_categoria_js').val(number_format(tot, false));
            $('#subtotal2').html(number_format(tot));
            var retenciones = JSON.parse($('#retenciones').val());
            $.each( retenciones, function( key, value ){
                retenciones[key].total=0;
            });

            $('#table-retencion  tbody tr').each(function() {
                var id_reten=$(this).attr('id');
                id_reten=id_reten.substr(5,3);
                retencion=$('#retencion'+id_reten).val();
                if (retencion) {
                    $.each( retenciones, function( key, value ){
                        if (value.id==retencion) {
                            retencion_calculate(id_reten, retencion, false);
                            retenciones[key].total+=parseFloat($('#precio_reten'+id_reten).val());

                        }
                    });
                }

            });
            var reten=0;

            $('#subtotal').html(number_format(total));
            $.each( retenciones, function( key, value ){
                if (value.total>0) {reten+=value.total;}
                create_retenciones(value.total, key, value.nombre+' ('+value.porcentaje+'%)');
                total-=value.total;
            });
        }


        if (descuento>0) {$('#descuento').html('-'+$('#simbolo').val()+' '+number_format(descuento));}
        else{$('#descuento').html('0'); }

        var total= total- descuento;
        $('#subsub').html(number_format(total));
        $.each( array, function( key, value ){
            create_imp(value.total, key, value.nombre+' ('+value.porcentaje+'%)');
            total+=value.total;
        });

        $('#total').html(number_format(total));
        if ($('#total_value').length>0) {
            $('#total_value').val(number_format(total, false));
            $('#total_value').trigger("change");
        }
    }
    else{
        $('#subtotal').html('0');
        $('#descuento').html($('#simbolo').val()+' 0');
        $('#subsub').html('0');
        $('#subtotal2').html('0');
        $('#total').html('0');
        $.each( array, function( key, value ){
            if ($('#imp'+key).length > 0) {
                $("#" + 'imp'+key).remove();
            }
        });
        $('#table-retencion tbody tr').remove();
        $('#totalesreten tbody tr').remove();
        if ($('#total_value').length>0) {$('#total_value').val(0);
            $('#total_value').trigger("change");}

        if ($('#subtotal_categoria_js').length>0) {
            $('#subtotal_categoria_js').val(0);
        }
    }
}

/* Saca los impuestos para el total */
function create_imp(total, key, name){
    if ($('#imp'+key).length > 0) {
        if (total>0) {
            $('#totalimp'+key).html($('#simbolo').val()+' '+number_format(total));

        }
        else{
            $("#" + 'imp'+key).remove();
        }
    }
    else{
        if (total>0) {
            $('#totales tbody').append(
                `<tr  id="imp`+key+`">` +
                `<td >`+name+`</td><td id="totalimp`+key+`">`+$('#simbolo').val()+' '+number_format(total)+`</td></tr>`);
        }
    }

}

/* Remueve los tr de una tabla */
function Eliminar(i) {
    $("#" + i).remove();
    totalall();
    if($('#table-form').length > 0 && $('#totalesreten').length==0){
        totalall();
    }
}

function Chequeado(input, descheck){
    if($("#"+input).is(':checked')) {
        $("#"+descheck).prop('checked', false);
    }
}

/* Funciones de Ingresos */


function crearDivRetentionFact(id){
    var nro=$('#retenciones_factura_'+id+' div').length +1 ;
    if ($('#div_reten'+id+'_'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#div_reten'+id+'_'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }

    $('#retenciones_factura_'+id).append(
        `<div  id="div_reten${id}_${nro}" class="row no-padding">` +
        `
        <div  class="no-padding col-md-6">                          
          <select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="fact${id}_retencion[]" id="fact${id}_retencion${nro}" required="" onchange="retencion_calculate(${nro}, this.value, true, 'fact${id}_', ${id});" >
            
          </select>
        </div>
        <div class="monetario col-md-5 no-padding ">
          <input type="number" required="" style="display: inline-block; width: 80%;" class="form-control form-control-sm" onkeyup="totales_ingreso()" id="fact${id}_precio_reten${nro}" name="fact${id}_precio_reten[]" placeholder="Valor retenido" maxlength="24" onkeyup="fact_total_linea(${nro})" min="0" required="">
        </div>
      <div class="col-md-1 no-padding "><button type="button" class="btn btn-link btn-icons"  onclick="Eliminar('div_reten${id}_${nro}'); totales_ingreso()">X</button></div>
    ` +
        `</div>`
    );
    var retenciones = JSON.parse($('#retenciones').val());
    var newretenciones= [];
    $('#retenciones_factura_'+id+' div').each(function() {
        var id_reten=$(this).attr('id');
        if (id_reten) {
            id_reten= id_reten.split('_')[2];
            retencion=$('#fact'+id+'_retencion'+id_reten).val();
            if (retencion) {
                newretenciones.push(parseFloat(retencion));
            }
        }

    });
    $.each( retenciones, function( key, value ){
        if (newretenciones.indexOf(value.id)<0) {
            $('#fact'+id+'_retencion'+nro).append($('<option>',
                {
                    value: value.id,
                    text : value.nombre+" - "+ value.porcentaje+"%"
                }));
        }
    });
    $('#fact'+id+'_retencion'+nro).selectpicker('refresh');
    $("#fact"+id+"_precio_reten"+nro).attr("disabled", "disabled");

}

function max_value_valor_recibido(id, ides=null, pref=null ){
    total=parseFloat($('#totalfact'+id).val());
    $('#retenciones_factura_'+id+' div').each(function() {
        var id_reten=$(this).attr('id');
        if (id_reten) {
            id_reten= id_reten.split('_')[2];
            retencion=$('#fact'+id+'_precio_reten'+id_reten).val();
            if (retencion) {
                total-=parseFloat(retencion);
            }
        }

    });
    total=number_format(total,false);
    if ($('#editmonto'+id).val()==1 && pref) {
        $('#precio'+id).val(number_format(total,false));
        $('#precio'+id).trigger("change");
    }
    $("#precio"+id).attr('max', number_format(total,false));


    if (number_format(total,false)<0) {
        $('#p_error_'+id).html('El total de las retenciones es mayor al valor por pagar');
        if (!$('#button-guardar').attr("disabled")) {$('#button-guardar').attr("disabled", "disabled");} return false;
    }
    else{
        $('#p_error_'+id).html('');
        return true;
    }

}

function retencion_calculate(id, reten, recursividad=true, pref='', seccion=null){

    var subtotal='subtotal_categoria_js';
    //Valor a Pagar
    if (pref) {subtotal='subfact'+seccion;}
    if (parseFloat($('#'+subtotal).val())>0) {
        var retenciones = JSON.parse($('#retenciones').val());
        var total=0;
        $.each( retenciones, function( key, value ){
            if (value.id==reten) {
                if (pref) {
                    if(value.tipo != 1){
                        total=( parseFloat($('#'+subtotal).val())*value.porcentaje)/100;
                    }else{
                        var tmp = parseFloat($('#'+subtotal).val() * (19/100));
                        total=( tmp *value.porcentaje)/100;
                    }

                }
                else {

                    if(value.tipo != 1 ){
                        total=($('#'+subtotal).val()*value.porcentaje)/100;
                    }else{
                        var tmp = $('#'+subtotal).val() * (19/100);
                        total=( tmp *value.porcentaje)/100;
                    }
                }
            }
        });
        $("#"+pref+"precio_reten"+id).val(number_format(total,false));

        if ($('#fact_prov').length>0) {
            if (recursividad) {totalall();}
            return false;
        }


        if (recursividad && !pref) {
            total_categorias();
        }
        else{
            max_value_valor_recibido(seccion, id, pref);
            totales_ingreso();
        }
    }

}

function totales_ingreso(input=true){
    var total=0; var reten_may=0;

    $('#table-facturas  tbody tr').each(function() {
        id=$(this).attr('id');
        var precio=$('#precio'+id).val();
        if (precio) {
            total+=parseFloat(precio);
        }

        if (!max_value_valor_recibido(id)) {return false;}
        else{$('#button-guardar').removeAttr("disabled");}

    });

    var retenciones = JSON.parse($('#retenciones').val());
    $.each( retenciones, function( key, value ){
        retenciones[key].total=0;
    });
    if (total>0) {
        $('#subtotal_facturas_js').val(total);
        var subtotal=total;
        $('#table-facturas  tbody tr').each(function() {
            reten_may=0;
            id=$(this).attr('id');
            $('#retenciones_factura_'+id+' div').each(function() {
                var id_reten=$(this).attr('id');
                if (id_reten) {
                    id_reten= id_reten.split('_')[2];
                    retencion=$('#fact'+id+'_retencion'+id_reten).val();
                    if (retencion) {
                        $.each( retenciones, function( key, value ){
                            if (value.id==retencion) {
                                retencion_calculate(id_reten, retencion, false);

                                retenciones[key].total+=parseFloat($('#fact'+id+'_precio_reten'+id_reten).val());
                                reten_may+=parseFloat($('#fact'+id+'_precio_reten'+id_reten).val());
                            }
                        });
                    }
                }

            });
        });


        reten=0;
        $.each( retenciones, function( key, value ){
            create_retenciones(value.total, key, value.nombre+' ('+value.porcentaje+'%)', 'fact_');
            reten+=value.total;
        });
        $('#total').html(number_format(total));
        $('#subtotal').html(number_format(subtotal+reten));

    }
    else{
        $('#subtotal_facturas_js').val('0');
        $('#subtotal').html('0');
        $('#total').html('0');


        $.each( retenciones, function( key, value ){
            create_retenciones(value.total, key, value.nombre+' ('+value.porcentaje+'%)', 'fact_');
        });
    }

}




























function editmonto(id){
    if ($('#precio'+id).val()) {

        $('#editmonto'+id).val(0);
    }
    else{

        $('#editmonto'+id).val(1);
    }
}

function reduccion_precio(){

}




function enabled(id){
    if($("#precio_categoria"+id).attr('disabled')){
        $("#precio_categoria"+id).removeAttr("disabled");
        $("#impuesto_categoria"+id).removeAttr("disabled");
        $("#cant_categoria"+id).removeAttr("disabled");
        $("#descripcion_categoria"+id).removeAttr("disabled");
        $("#impuesto_categoria"+id).selectpicker('refresh');
        $("#cant_categoria"+id).val(1);
        $("#precio_categoria"+id).focus();
    }

}

function total_linea(id){
    var precio= $('#precio_categoria'+id).val();
    var cant= $('#cant_categoria'+id).val();
    if (precio>0 && cant>0) {
        var total=precio*cant;
        $('#total_categoria'+id).val(number_format(total));
    }
    total_categorias();
}

function pre_retencion_calculate(id){
    $('#retenciones_factura_'+id+' div').each(function() {
        var id_reten=$(this).attr('id');
        if (id_reten) {
            id_reten= id_reten.split('_')[2];
            retencion=$('#fact'+id+'_retencion'+id_reten).val();
            retencion_calculate(id_reten, retencion, false, pref='fact'+id+'_', id);
        }
    });
    totales_ingreso();
}




function total_categorias(){
    if ($('#fact_prov').length>0) {
        totalall();
        return false;
    }

    var total=0;
    var array= $('#impuestos').val();
    array=JSON.parse(array);
    $.each( array, function( key, value ){
        array[key].total=0;
    });
    $('#table-form  tbody tr').each(function() {
        id=$(this).attr('id');
        var precio=$('#precio_categoria'+id).val();
        var cant=$('#cant_categoria'+id).val();
        var impuesto= $('#impuesto_categoria'+id).val();
        if (precio) {
            fila=precio*cant;
            total+=parseFloat(fila);
            if (impuesto>0) {
                $.each( array, function( key, value ){
                    if (value.id==impuesto) {
                        impuesto=(fila*value.porcentaje)/100;
                        array[key].total+=impuesto;
                    }
                });
            }
        }
    });

    var retenciones = JSON.parse($('#retenciones').val());
    $.each( retenciones, function( key, value ){
        retenciones[key].total=0;
    });

    if (total>0) {
        $('#subtotal_categoria_js').val(total);
        $('#subtotal_categoria').html(number_format(total));
        $subtotal=total;
        $('#table-retencion  tbody tr').each(function() {
            var id_reten=$(this).attr('id');
            id_reten=id_reten.substr(5,3);
            retencion=$('#retencion'+id_reten).val();
            if (retencion) {
                $.each( retenciones, function( key, value ){
                    if (value.id==retencion) {
                        retencion_calculate(id_reten, retencion, false);
                        retenciones[key].total+=parseFloat($('#precio_reten'+id_reten).val());
                    }
                });
            }

        });
        var reten=0;
        $.each( retenciones, function( key, value ){
            if (value.total>0) {reten+=value.total;}
            create_retenciones(value.total, key, value.nombre+' ('+value.porcentaje+'%)');
        });


        $.each( array, function( key, value ){
            create_imp(value.total, key, value.nombre+' ('+value.porcentaje+'%)');
            total+=value.total;
        });


        if (reten>total) {$('#p_rentencion').html('El total de las retenciones es mayor al subtotal mas impuestos');
            $('#button-guardar').attr("disabled", "disabled"); return false;

        }
        else{$('#p_rentencion').html(''); $('#button-guardar').removeAttr("disabled"); }

        total-=reten;
        $('#total_categoria').html(number_format(total));
    }
    else{
        $('#subtotal_categoria_js').val('0');
        $('#subtotal_categoria').html('0');
        $('#total_categoria').html('0');
        $.each( retenciones, function( key, value ){
            if ($('#retentotal'+key).length > 0) {
                $('#retentotal'+key).remove();
            }
        });
        $.each( array, function( key, value ){
            if ($('#imp'+key).length > 0) {
                $("#" + 'imp'+key).remove();
            }
        });


    }

}

function create_retenciones(total, key, name, pref=''){
    if ($('#'+pref+'retentotal'+key).length > 0) {
        if (total>0) {
            $('#'+pref+'retentotalvalue'+key).html('-'+$('#simbolo').val()+' '+number_format(total));

        }
        else{
            $("#"+pref+'retentotal'+key).remove();
        }
    }
    else{
        if (total>0) {
            $('#'+pref+'totalesreten tbody').append(
                `<tr  id="`+pref+`retentotal`+key+`">` +
                `<td width="40%" style="font-size: 0.8em;">`+name+`</td><td id="`+pref+`retentotalvalue`+key+`">-`+$('#simbolo').val()+' '+number_format(total)+`</td></tr>`);
        }
    }
}
function CrearFilaCategorias() {
    var nro=$('#table-form tbody tr').length +1 ;
    if ($('#'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    $('#table-form tbody').append(
        `<tr  id="${nro}">` +
        `
        <td  class="no-padding">                          
          <select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="categoria[]" id="categoria${nro}" required="" onchange="enabled(${nro});" >
            `+$('#allcategorias').val()+`
          </select>
        </td>
        <td class="monetario">
          <input type="number" class="form-control form-control-sm" id="precio_categoria${nro}" name="precio_categoria[]" placeholder="Precio" onkeyup="total_linea(${nro})" required="" maxlength="24" min="0">
        </td>
        <td>
          <select class="form-control form-control-sm selectpicker" name="impuesto_categoria[]" id="impuesto_categoria${nro}" title="Impuesto" onchange="total_categorias();" required="">
          </select>
        </td>
        <td width="5%">
          <input type="number" class="form-control form-control-sm" id="cant_categoria${nro}" name="cant_categoria[]" placeholder="Cantidad" onchange="total_linea(${nro});" min="1" required="" maxlength="24">
        </td>
        <td  style="padding-top: 1% !important;">                           
          <textarea  class="form-control form-control-sm" id="descripcion_categoria${nro}" name="descripcion_categoria[]" placeholder="Observaciones"></textarea>
        </td>
        <td>
          <input type="text" class="form-control form-control-sm text-right" id="total_categoria${nro}" value="0" disabled="" > 
        </td>
      <td><button type="button" class="btn btn-outline-secondary btn-icons" onclick="Eliminar(${nro}); total_categorias();">X</button></td>
    ` +
        `</tr>`
    );
    var impuestos = JSON.parse($('#impuestos').val());
    $.each( impuestos, function( key, value ){
        $('#impuesto_categoria'+nro).append($('<option>',
            {
                value: value.id,
                text : value.nombre+"-"+ value.porcentaje+"%"
            }));
    });
    $('.precio').mask('0000000000.00', {reverse: true});
    $('#categoria'+nro).selectpicker();
    $('#impuesto_categoria'+nro).selectpicker();

    $("#precio_categoria"+nro).attr("disabled", "disabled");
    $("#impuesto_categoria"+nro).attr("disabled", "disabled");
    $("#cant_categoria"+nro).attr("disabled", "disabled");
    $("#descripcion_categoria"+nro).attr("disabled", "disabled");


}

function crearDivRetention(id){
    var nro=$('#retenciones_factura_'+id+' div').length +1 ;
    if ($('#div_reten'+id+'_'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#div_reten'+id+'_'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }

    $('#retenciones_factura_'+id).append(
        `<div  id="div_reten${id}_${nro}" class="row no-padding">` +
        `
        <div  class="no-padding col-md-6">                          
          <select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="fact${id}_retencion[]" id="fact${id}_retencion${nro}" required="" onchange="retencion_calculate(${nro}, this.value, true, 'fact${id}_', ${id});" >
            
          </select>
        </div>
        <div class="monetario col-md-5 no-padding ">
          <input type="hidden" value='0' id="fact${id}_lock_reten${nro}">
          <button type="button" class="btn btn-outline-secondary btn-icons" style="height: 27px !important;" id="fact${id}_button-reten${nro}" onclick="change_retencion('${nro}', 'fact${id}_', ${id})"><i class="fas fa-lock"></i></button>
          <input type="number" required="" style="display: inline-block; width: 80%;" class="form-control form-control-sm" onkeyup="totales_ingreso()" id="fact${id}_precio_reten${nro}" name="fact${id}_precio_reten[]" placeholder="Valor retenido" maxlength="24" min="0" onkeyup="fact_total_linea(${nro})" required="">
        </div>
      <div class="col-md-1 no-padding "><button type="button" class="btn btn-link btn-icons"  onclick="Eliminar('div_reten${id}_${nro}'); totales_ingreso()">X</button></div>
    ` +
        `</div>`
    );
    var retenciones = JSON.parse($('#retenciones').val());
    $.each( retenciones, function( key, value ){
        $('#fact'+id+'_retencion'+nro).append($('<option>',
            {
                value: value.id,
                text : value.nombre+" - "+ value.porcentaje+"%"
            }));
    });
    $('#fact'+id+'_retencion'+nro).selectpicker('refresh');
    $("#fact"+id+"_precio_reten"+nro).attr("disabled", "disabled");

}



function CrearFilaRetencion(){

    var nro=$('#table-retencion tbody tr').length +1 ;
    if ($('#reten'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#reten'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }
    $('#table-retencion tbody').append(
        `<tr  id="reten${nro}">` +
        `
        <td  class="no-padding">                          
          <select class="form-control form-control-sm selectpicker no-padding"  title="Seleccione" data-live-search="true" data-size="5" name="retencion[]" id="retencion${nro}" required="" onchange="retencion_calculate(${nro}, this.value);" >
            
          </select>
        </td>
        <td class="monetario">
          <input type="hidden" value='0' id="lock_reten${nro}">
          <input type="number" required="" style="display: inline-block; width: 80%;" class="form-control form-control-sm" maxlength="24" onkeyup="total_categorias()" id="precio_reten${nro}" name="precio_reten[]" placeholder="Valor retenido" onkeyup="total_linea(${nro})" required="" min="0">
        </td>
      <td><button type="button" class="btn btn-outline-secondary btn-icons" onclick="Eliminar('reten${nro}'); total_categorias();">X</button></td>
    ` +
        `</tr>`
    );
    var retenciones = JSON.parse($('#retenciones').val());
    $.each( retenciones, function( key, value ){
        $('#retencion'+nro).append($('<option>',
            {
                value: value.id,
                text : value.nombre+" - "+ value.porcentaje+"%"
            }));
    });
    $('#retencion'+nro).selectpicker('refresh');
    $('.precio').mask('0000000000.00', {reverse: true});
    $("#precio_reten"+nro).attr("disabled", "disabled");
}




function change_retencion(id, prefij='', nro=''){
    if ($('#'+prefij+'lock_reten'+id).val()==0) {
        $('#'+prefij+'lock_reten'+id).val(1);
        $('#'+prefij+'button-reten'+id).html('<i class="fas fa-lock-open"></i>');
        $("#"+prefij+"precio_reten"+id).removeAttr("disabled");
        $('#'+prefij+'precio_reten'+id).focus();


    }
    else{
        $('#'+prefij+'lock_reten'+id).val(0);
        $('#'+prefij+'button-reten'+id).html('<i class="fas fa-lock"></i>');
        $("#"+prefij+"precio_reten"+id).attr("disabled", "disabled");
        retencion_calculate(id, $('#'+prefij+'retencion'+id).val(), true, prefij, nro);
    }
}



// Reportes

function cambiar_fecha(){
    tipo=$('#fechas').val();
    var date = new Date();


    if (tipo) {
        if (tipo==0) { //HOY
            hoy=moment(date).format('DD-MM-YYYY');
            $('#desde').val(hoy);
            $('#hasta').val(hoy);
        }
        else if (tipo==1) { //ESTE MES
            var inicio = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('DD-MM-YYYY');
            var fin = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('DD-MM-YYYY');
            $('#desde').val(inicio);
            $('#hasta').val(fin);
        }
        else if (tipo==2) { //ESTE AÑO
            var inicio = moment(date.getFullYear()+'-01-01').format('DD-MM-YYYY');
            var fin = moment(date.getFullYear()+'-12-31').format('DD-MM-YYYY');
            $('#desde').val(inicio);
            $('#hasta').val(fin);
        }
        else if (tipo==3) { //AYER
            var ayer = moment(new Date(date.getTime() - 24*60*60*1000)).format('DD-MM-YYYY');
            $('#desde').val(ayer);
            $('#hasta').val(ayer);
        }
        else if (tipo==4) { //Semana Pasada
            var inicio = moment(new Date(date.getTime() - (24*60*60*1000)*7)).format('DD-MM-YYYY');
            var fin = moment(date).format('DD-MM-YYYY');
            $('#desde').val(inicio);
            $('#hasta').val(fin);
        }
        else if (tipo==5) { //MES ANTERIOR
            date.setMonth(date.getMonth() - 1);
            var inicio = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('DD-MM-YYYY');
            var fin = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('DD-MM-YYYY');
            $('#desde').val(inicio);
            $('#hasta').val(fin);
        }
        else if (tipo==6) { //AÑO ANTERIOR
            date.setYear(date.getFullYear() - 1);
            var inicio = moment(date.getFullYear()+'-01-01').format('DD-MM-YYYY');
            var fin = moment(date.getFullYear()+'-12-31').format('DD-MM-YYYY');
            $('#desde').val(inicio);
            $('#hasta').val(fin);
        }
    }
}





//NOTAS DE CREDITO

function onchangecliente(valor){
    $('#error-cliente').hide();
    $('#facturas-cliente  tbody tr').each(function() {
        //remove($(this).attr('id'));
        $('#facturas-cliente tbody tr').html('');
    });
    

    if ($('#fact_prov').length>0) {
        final =$('#url').val()+'/empresa/facturasp/proveedor/'+valor;
    }else{
        final =$('#url').val()+'/empresa/facturas/cliente/'+valor;
    }

    $.ajax({
        url: final,
        complete: function(data){
            /*
             * Se ejecuta cuando termina la petición y esta ha sido
             * correcta
             * */
            $('#json-facturas').val(data.responseText);
            facturas=JSON.parse(data.responseText);

        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
    mostrar();

}

function itemsfactncredito(id){

    if ($('#fact_prov').length>0) {
        url =$('#url').val()+'/empresa/notasdebito/items/'+id;
    }else{
        url =$('#url').val()+'/empresa/notascredito/items/'+id;
    }

    $.ajax({
        url: url,
        success: function(data){
            $('#items_factura_notac').html(data);
           
        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
    
    ocultar();
}



function agregardevolucion(){
    nro=$('#devoluciones-dinero tbody tr').length +1 ;
    if ($('#devol_'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#devol_'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }

    today=$('#todaytoday').val();
    $('#devoluciones-dinero tbody').append(
        `<tr id="devol_${nro}">
          <td class="form-group "><input type="text" class="form-control" name="fecha_dev[]" id="fecha_dev${nro}" value="${today}" disabled=""  style="border: 1px solid #a6b6bd52  !important;"></td>
          <td>
            <select class="form-control form-control-sm selectpicker" name="cuentaa_dev[]" id="cuenta${nro}" title="Seleccione" data-live-search="true" data-size="5">
              `+$('#allcategorias').val()+`
            </select>
          </td>
          <td class=""><input type="number" class="form-control form-control-sm" id="monto${nro}" name="montoa_dev[]" placeholder="Monto" onchange="function_totales_facturas();"></td>
          <td  style="padding-top: 1% !important;">                           
            <textarea  class="form-control form-control-sm" id="descripcion${nro}" name="descripciona_dev[]" placeholder="Descripción" ></textarea></td>
        

          <td>
            <button type="button" class="btn btn-link btn-icons" onclick="Eliminar('devol_${nro}');">X</button>
          </td>
        </tr>`
    );
    $('#cuenta'+nro).selectpicker();
    $('#fecha_dev'+nro).datepicker({
        locale: 'es-es',
        uiLibrary: 'bootstrap4',
        format: 'dd-mm-yyyy'
    });
}

function ocultar(){
     $('#ocultar').css('display','none');
}
function mostrar(){
     $('#ocultar').css('display','');
}


function agregarfactura(){
    $('#items_factura_notac').html('');
    if (!$('#cliente').val()) {
        $('#error-cliente').html('Debe escoger primero el cliente');
        $('#error-cliente').show();
        return false;
    }
    facturas=$('#json-facturas').val();
    facturas=JSON.parse(facturas);
    if(facturas.length==0)
    {
        $('#error-cliente').html('El cliente no posee facturas abiertas');
        $('#error-cliente').show();
    }

    nro=$('#facturas-cliente tbody tr').length +1 ;
    if ($('#tr_fact-client_'+nro).length > 0) {
        for (i = 1; i <= nro; i++) {
            if ($('#tr_fact-client_'+i).length == 0) {
                nro=i;
                break;
            }
        }
    }

    if ($('#fact_prov').length>0) {
        $('#facturas-cliente tbody').append(
            `<tr id="tr_fact-client_${nro}">
                  <td class="no-padding"><select class="form-control form-control-sm selectpicker no-padding" title="Seleccione" data-size="5" name="factura[]" id="cod_factura${nro}" onchange="rellenar_factp(${nro}, this.value);itemsfactncredito(this.value)" required=""></select></td>
                  <td id="totalfact${nro}"></td>
                  <td id="pagado${nro}"></td>
                  <td id="porpagar${nro}"></td>
                  <td class="monetario">
                    <input type="number" class="form-control form-control-sm" id="monto_fact${nro}" name="monto_fact[]" placeholder="Monto" onkeyup="total(${nro})" required="" maxlength="24" min="0" disabled onchange="function_totales_facturas();">
                  </td>
                  <td>
                    <button type="button" class="btn btn-link btn-icons" onclick="Eliminar('tr_fact-client_${nro}'); function_totales_facturas();">X</button>
                  </td>
            </tr>`
        );
    }else{
        $('#facturas-cliente tbody').append(
            `<tr id="tr_fact-client_${nro}">
                <td class="no-padding"><select class="form-control form-control-sm selectpicker no-padding" title="Seleccione" data-size="5" name="factura[]" id="cod_factura${nro}" onchange="rellenar_fact(${nro}, this.value);itemsfactncredito(this.value)" required=""></select></td>
                <td id="fecha${nro}"></td>
                <td id="vencimiento${nro}"></td>
                <td id="observaciones${nro}"></td>
                <td id="totalfact${nro}"></td>
                <td id="pagado${nro}"></td>
                <td id="porpagar${nro}"></td>
                <td class="monetario">
                    <input type="number" class="form-control form-control-sm" id="monto_fact${nro}" name="monto_fact[]" placeholder="Monto" onkeyup="total(${nro})" required="" maxlength="24" min="0" disabled onchange="function_totales_facturas();">
                </td>
                <td>
                    <button type="button" class="btn btn-link btn-icons" onclick="Eliminar('tr_fact-client_${nro}'); function_totales_facturas();">X</button>
                </td>
            </tr>`
        );
    }


    comprobar_factura(nro);
}

function comprobar_factura(nro, comprobar=false){
    facturas=$('#json-facturas').val();
    facturas=JSON.parse(facturas);
    var newfacturas= [];
    comprobado=0;

    $('#facturas-cliente tbody tr').each(function() {
        var id_fact=$(this).attr('id').split("_")[2];
        factura=$('#cod_factura'+id_fact).val();
        if (factura) {
            if (comprobar==factura && nro!=id_fact && !comprobado) {comprobado=1}
            newfacturas.push(parseInt(factura));
        }
    });

    if (!comprobar || comprobado) {
        $('#cod_factura'+nro+' option').remove();
        $.each( facturas, function( key, value ){
            if (newfacturas.indexOf(parseInt(value.nro))<0) {
                $('#cod_factura'+nro).append($('<option>',
                    {
                        value: value.id,
                        text : value.codigo
                    }));
            }
        });
        $('#cod_factura'+nro).selectpicker('refresh');
    }
}

function rellenar_fact(nro, value){
    comprobar_factura(nro, value);
    if ($('#cod_factura'+nro).length==0) {return false; }

    url=$('#url').val()+'/empresa/facturas/'+value+'/json';

    $.ajax({
        url: url,
        success: function(data){
            data=JSON.parse(data);
            $('#fecha'+nro).html(data.fecha);
            $('#vencimiento'+nro).html(data.vencimiento);
            $('#observaciones'+nro).html(data.observaciones);
            $('#totalfact'+nro).html(number_format(data.total));
            $('#pagado'+nro).html(number_format(data.pagado));
            $('#porpagar'+nro).html(number_format(data.porpagar));
            $('#monto_fact'+nro).attr('max', number_format((data.porpagar+data.pagado), false));
            $('#monto_fact'+nro).removeAttr("disabled");
            $('#monto_fact'+nro).focus();
        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function rellenar_factp(nro, value){
    comprobar_factura(nro, value);
    if ($('#cod_factura'+nro).length==0) {return false; }

    url=$('#url').val()+'/empresa/facturasp/'+value+'/json';

    $.ajax({
        url: url,
        success: function(data){
            data=JSON.parse(data);
            $('#totalfact'+nro).html(number_format(data.total));
            $('#pagado'+nro).html(number_format(data.pagado));
            $('#porpagar'+nro).html(number_format(data.porpagar));
            $('#monto_fact'+nro).attr('max', number_format((data.porpagar+data.pagado), false));
            $('#monto_fact'+nro).removeAttr("disabled");
            $('#monto_fact'+nro).focus();
        },
        error: function(data){
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}


function function_totales_facturas(){
    monto=0;
    $('#facturas-cliente tbody tr').each(function() {
        var id_fact=$(this).attr('id').split("_")[2];
        valor=$('#monto_fact'+id_fact).val();
        if (valor) {
            monto+=parseFloat(valor);
        }
    });
    error=false;
    if (monto>parseFloat($('#total_value').val())) {
        $('#error-cliente').html('El valor de las devoluciones y/o créditos a facturas de venta es mayor que el total de la nota crédito');
        $('#error-cliente').show();
        $('#boton-guardar').attr('disabled', 'disabled');
        error=true;
    }
    else{
        $('#boton-guardar').removeAttr('disabled');
        $('#error-cliente').hide();
    }

    $('#devoluciones-dinero tbody tr').each(function() {
        var id_fact=$(this).attr('id').split("_")[1];
        valor=$('#monto'+id_fact).val();
        if (valor) {
            monto+=parseFloat(valor);
        }
    });


    if (monto>parseFloat($('#total_value').val()) && !error) {
        $('#error-cliente').html('El valor de las devoluciones y/o créditos a facturas de venta es mayor que el total de la nota crédito');
        $('#error-cliente').show();
        $('#boton-guardar').attr('disabled', 'disabled');
        error=true;
    }
    else{
        $('#boton-guardar').removeAttr('disabled');
        $('#error-cliente').hide();
    }

}

//Funciones de logistica

function showfacturas(cliente){
    $('#select_factura option').remove();
    final =$('#url').val()+'/empresa/facturas/'+cliente+'/clientejson';
    $.ajax({
        url: final,
        beforeSend: function(){
            cargando(true);
        },
        complete: function(data){
            /*
             * Se ejecuta cuando termina la petición y esta ha sido
             * correcta
             * */
            facturas=JSON.parse(data.responseText);

            cliente=facturas.cliente;
            console.log(cliente);
            facturas=JSON.parse(facturas.items);
            $.each( facturas, function( key, value ){
                $('#select_factura').append($('<option>',
                    {
                        value: value.id,
                        text : value.codigo
                    }));
            });
            $('#select_factura').selectpicker('refresh');
            $('#items-factura-envio  tbody tr').each(function() {
                Eliminar($(this).attr('id'));
            });
            $('#cantidadtotal').html(0);

            $('#direccion').val(cliente.direccion);
            $('#receptor').val(cliente.nombre);
            $('#nitreceptor').val(cliente.nit);
            cargando(false);
        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function showitemsfactura(factura){
    final =$('#url').val()+'/empresa/facturas/'+factura+'/facturajson';
    $.ajax({
        url: final,
        beforeSend: function(){
            cargando(true);
        },
        complete: function(data){
            /*
             * Se ejecuta cuando termina la petición y esta ha sido
             * correcta
             * */
            nro=0;
            cantid=0;
            items=JSON.parse(data.responseText);
            $.each( items, function( key, value ){
                nro=nro+1;
                cantid+=value.cant;
                $('#items-factura-envio tbody').append(
                    `<tr id="tr_item_${nro}">
          <td>${value.producto}  <input type="hidden" name="producto[]" value="${value.id}"</td>
          <td>${value.ref}</td>
          <td><textarea  class="form-control form-control-sm" id="descripcion${nro}" name="descripcion_envio[]" placeholder="Descripción" ></textarea></td>
          <td><input type="number" class="form-control form-control-sm" id="cant_envio${nro}" name="cant_envio[]" placeholder="Cantidad" max="${value.cant}" value="${value.cant}" min="1" required="" maxlength="24" onchange="cantidadtotal();"></td>
          <td>
            <button type="button" class="btn btn-link btn-icons" onclick="Eliminar('tr_item_${nro}');cantidadtotal();">X</button>
          </td>
        </tr>`);

                $('#cantidadtotal').html(cantid);

            });
            cargando(false);
        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function  cantidadtotal() {
    total=0;
    $('#items-factura-envio  tbody tr').each(function() {
        var id_fact=$(this).attr('id').split("_")[2];
        total+=parseFloat($('#cant_envio'+id_fact).val());
    });
    alert(total);
    $('#cantidadtotal').html(total);
}
function orderby(order_by, order){
    $('#order_by').val(order_by);
    $('#order').val(order);
    form=$('#form').val();
    $('#'+form).submit();

}

function cargando(abierta){
    if (abierta) {$(".loader").show();}
    else{$(".loader").hide();}
}


/* Modulo de gastos*/
/* Funciones del modulo de facturas*/

function factura_proveedor_pendiente(ingreso=false){
    if (($('input:radio[name=tipo]:checked').val()!=1 && $('#inputremision').length==0) || ($('#inputremision').length ==0 && $('#tipo1').length==0 ) ){
        return false;
    }
    if (!$('#cliente').val()) {
        $('#factura_pendiente').html('<p class="text-warning text-center">Para asociar este pago a una <b>factura de compra</b>, primero debes seleccionar un proveedor que tenga facturas registradas </p>');
        return false;
    }
    url =$('#url').val()+'/empresa/pagos';
    if ($('#inputremision').length>0) {
        url+='r';
    }
    final =url+'/pendiente/'+$('#cliente').val();
    if ($('#factura').length > 0 ) {
        final=final+'/'+$('#factura').val();
    }

    if (ingreso) {
        final =url+'/ingpendiente/'+$('#cliente').val()+'/'+ingreso;
    }
    $.ajax({
        url: final,
        success: function(data){
            /*
             * Se ejecuta cuando termina la petición y esta ha sido
             * correcta
             * */
            $('#factura_pendiente').html(data);

        },
        error: function(data){
            /*
             * Se ejecuta si la peticón ha sido erronea
             * */
            alert('Disculpe, estamos presentando problemas al tratar de enviar el formulario, intentelo mas tarde');
        }
    });
}

function submitLimit(id) {
    var btn = document.getElementById(id);
    setTimeout(function() { btn.setAttribute('disabled', 'disabled'); }, 1);
    setTimeout(function() { btn.removeAttribute('disabled'); }, 5000);
}

function nameCategoriam(id,modal)
{
    name = $("#nombrecm").val();
    asociarCampo(name,id,modal);
}

function nameCategoriav(id,modal)
{
    name = $("#nombrecv").val();
    asociarCampo(name,id,modal);
}

function nameLineav(id,modal)
{
    name = $("#nombrelv").val();
    asociarCampo(name,id,modal);
}

function nameLineam(id,modal)
{
    name = $("#nombrelm").val();
    asociarCampo(name,id,modal);
}

function nameFabricantev(id,modal)
{
    name = $("#nombrefv").val();
    asociarCampo(name,id,modal);
}

function nameFabricantem(id,modal)
{
    name = $("#nombrefm").val();
    asociarCampo(name,id,modal);
}

function formulario(id)
{
    var btn = document.getElementById(id);
    setTimeout(function() { btn.setAttribute('disabled', 'disabled'); }, 1);
    setTimeout(function() { btn.removeAttribute('disabled'); }, 5000);
    asociarCampo(null,null,null);
    
}


function asociarCampo(nombre,id,modal)
{
    if (nombre != "") {
        $.ajax({
            url: '/asociarproveedor/campos',
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            method: 'POST',
            data:   {nombre:nombre, tipo:id},
            success: function(campo){

                $('#'+modal).modal('hide');


                if (campo.id == "") {
                   Swal.fire({
                  position: 'top-center',
                  type: 'error',
                  title: 'Campo ' + campo.nombre + ' ya ha sido creado',
                  showConfirmButton: false,
                  timer: 2500
                }) 
                }
                else
                {
                 Swal.fire({
                  position: 'top-center',
                  type: 'success',
                  title: 'Campo ' + campo.nombre + ' guardado correctamente',
                  showConfirmButton: false,
                  timer: 2500
                })

              $("#"+id).append('<option value=' + campo.id + ' selected>' + campo.nombre + '</option>');
              $("#"+id).selectpicker('refresh');
                }
            }
          });
    }
    else
    {
        $('#form-proveedores').submit();
    }
}

function tipoMV(id)
{
  var url = "/llenarbusquedaproveedor";

  var campo_id = id;//obtenemos el id que se esta seleccionando
      if ($.trim(campo_id) != ''){
        $.get(url, {campo_id:campo_id}, function(campos)
        {
            console.log(campos);
         $('#fabricante').empty();
          $('#linea').empty();
          $('#categoria').empty();
          $('#marca').empty();

          $.each(campos.marcas, function(index, value){
            $('#marca').append("<option value='"+value.id+"'>"+value.nombre+"</option>");
          })

          $.each(campos.lineas, function(index, value){
            $('#linea').append("<option value='"+value.id+"'>"+value.nombre+"</option>");
          })

          $.each(campos.categorias, function(index, value){
            $('#categoria').append("<option value='"+value.id+"'>"+value.nombre+"</option>");
          })

          $.each(campos.fabricantes, function(index, value){
            $('#fabricante').append("<option value='"+value.id+"'>"+value.nombre+"</option>");
          })


          $('#fabricante').selectpicker('refresh');
          $('#linea').selectpicker('refresh');
          $('#categoria').selectpicker('refresh');
          $('#marca').selectpicker('refresh');
        });
      }
}

function filtroproveedores(marca='',linea='',categoria='',fabricante='',tipo='')
{
    /*var tipo = $("#tipo").val();
    var marca = $("#marca").val();
    var linea = $("#linea").val();
    var categoria = $("#categoria").val();
    var fabricante = $("#fabricante").val();*/


    var dataTable = $("#tbproveedor").DataTable({
        processing:true,
        serverSide:true,
        responsive:true,
        'rowCallback': function(row, data, index){
        $(row).find('td:eq(1)').html('<div class="elipsis-short" style="width:235px;">'+data.nombre+'</div>');
         },
        ajax:{
            url: "busquedaproveedores/getdata",
            data: {tipo:tipo, marca:marca, linea:linea, categoria:categoria, fabricante:fabricante},
        },
        columns:[
        {data:  'id'},
        {data: 'nombre'},
        {data: 'telefono1'},
        {data: 'tipo_empresa'},
        {data: 'tipo_venta'},
        {
                 sortable: false,
                 "render": function ( data, type, full, meta ) {
                     var buttonID = full.id;
                     return `<a href="agregarmarcaprov/`+buttonID+`" class="btn btn-outline-info btn-icons" title="Asociar campos"><i class="fas fa-info-circle"></i></a>
                            <a href="empresa/contactos/`+buttonID+`" class="btn btn-outline-info btn-icons"><i class="far fa-eye"></i></i></a>`;
                     
                 }
        },
        ]
    });
}

function proveedoresxproducto(idproducto)
{
      var dataTable = $("#tbproveedor").DataTable({
        processing:true,
        serverSide:true,
        ajax:{
            url: "busquedaproveedores/getdataproduct",
            data: {id:idproducto},
        },
        columns:[
        {data: 'id'},
        {data: 'nombre'},
        {data: 'telefono1'},
        {data: 'tipo_empresa'},
        {data: 'tipo_venta'},
        {
                 sortable: false,
                 "render": function ( data, type, full, meta ) {
                     var buttonID = full.id;
                     return `<a href="agregarmarcaprov/`+buttonID+`" class="btn btn-outline-info btn-icons" title="Asociar campos"><i class="fas fa-info-circle"></i></a>
                            <a href="empresa/contactos/`+buttonID+`" class="btn btn-outline-info btn-icons"><i class="far fa-eye"></i></i></a>`;
                     
                 }
        },
        ]
    });
}

function searchDV(id)
{
    option = id;
    if (option == 6) {

        document.getElementById("dvnit").style.display = "block";
       valor = $("#dv").val(calculateDV($("#nit").val()));
        $("#dvoriginal").val(valor.val());

        $("#nit").keyup(function(){
        valor = $("#dv").val(calculateDV($(this).val()));
        $("#dvoriginal").val(valor.val());
    });
    }else{
        document.getElementById("dvnit").style.display = "none";
    }
}

function calculateDV(myNit)
{
        var vpri,
        x,
        y,
        z;

  // Se limpia el Nit
  myNit = myNit.replace ( /\s/g, "" ) ; // Espacios
  myNit = myNit.replace ( /,/g,  "" ) ; // Comas
  myNit = myNit.replace ( /\./g, "" ) ; // Puntos
  myNit = myNit.replace ( /-/g,  "" ) ; // Guiones
  
  // Se valida el nit
  if  ( isNaN ( myNit ) )  {
    console.log ("El nit/cédula '" + myNit + "' no es válido(a).") ;
    return "" ;
};

  // Procedimiento
  vpri = new Array(16) ; 
  z = myNit.length ;

  vpri[1]  =  3 ;
  vpri[2]  =  7 ;
  vpri[3]  = 13 ; 
  vpri[4]  = 17 ;
  vpri[5]  = 19 ;
  vpri[6]  = 23 ;
  vpri[7]  = 29 ;
  vpri[8]  = 37 ;
  vpri[9]  = 41 ;
  vpri[10] = 43 ;
  vpri[11] = 47 ;  
  vpri[12] = 53 ;  
  vpri[13] = 59 ; 
  vpri[14] = 67 ; 
  vpri[15] = 71 ;

  x = 0 ;
  y = 0 ;
  for  ( var i = 0; i < z; i++ )  { 
    y = ( myNit.substr (i, 1 ) ) ;
    // console.log ( y + "x" + vpri[z-i] + ":" ) ;

    x += ( y * vpri [z-i] ) ;
    // console.log ( x ) ;    
}

y = x % 11 ;
  // console.log ( y ) ;

  return ( y > 1 ) ? 11 - y : y ;
}


function validateCountry(id)
{
    if (id == 'CO') {
        document.getElementById("validatec1").style.display = "block";
        document.getElementById("validatec2").style.display = "block";
        document.getElementById("validatec3").style.display = "block";
    }
    else
    {
        document.getElementById("validatec1").style.display = "none";
        document.getElementById("validatec2").style.display = "none";
        document.getElementById("validatec3").style.display = "none";
    }
}

function searchMunicipality(id)
{
   $.ajax({
   url: '/searchMunicipality',
   headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
   method:'post',
   data:{departamento_id:id},
   success: function(municipios)
   {
    $("#municipio").empty();
     $.each(municipios, function(index, value){
      $("#municipio").append(`<option value=`+value.id+`>`+value.nombre+`</option>`)
    });
     $("#municipio").selectpicker('refresh');
   }
 })
}

function updateDirectionClient(id)
{
    //alert($("#pais").val());
    //alert(id);
    $.ajax({
        url: '/updatedirection/client',
        headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        method:'post',
        data:{
            cliente_id:id,
            cod_postal:$("#cod_postal").val(),
            pais:$("#pais").val(),
            departamento:$("#departamento").val(),
            municipio:$("#municipio").val(),
            direccion: $("#direccion").val(),
        },
        success: function(cliente)
        {
            $("#modaleditDirection").modal('hide');
           Swal.fire({
              position: 'top-center',
              type: 'success',
              title: 'Dirección del cliente ' + cliente.nombre + ' actualizada correctamente',
              showConfirmButton: false,
              timer: 3500
          });
           contacto(cliente.id);
       }
   })
}

