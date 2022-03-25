//VARIABLES
const formulario = document.querySelector('#agregar-gasto');
const listado = document.querySelector('.list-group');

//EVENTOS
cargarEventListeners();
function cargarEventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', validarFormulario);
}   

//CLASES
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad,0);
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}
class UI {
    insertarPresupuesto(cantidad){
        const {restante, presupuesto} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    mostrarMensaje(mensaje, tipo){
        const div = document.createElement('DIV');
        const principal = document.querySelector('.primario');
        div.classList.add('alert','text-center');
        div.textContent = mensaje;
        if(tipo === 'error'){   
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success');
        }
        principal.insertBefore(div, formulario);
        setTimeout(()=>{
            div.remove();
        },3000);
    }
    mostrarGastos(gastos){
        this.limpiarHTML();
        gastos.forEach(gasto => {
            const {nombre, cantidad, id} = gasto;
            //Crea un li
            const li = document.createElement('LI');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id;
            //Agrega el HTML del gasto
            li.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill" > $${cantidad} </span> `;
            //Crear botón
            const btnBorrar = document.createElement('BUTTON');
            //btnBorrar.textContent = 'Borrar';
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            //Agregar al LI
            li.appendChild(btnBorrar);
            //Agrega el gasto al HTML
            listado.appendChild(li);
        });
    }
    limpiarHTML(){
        while(listado.firstChild){
            listado.removeChild(listado.firstChild);
        }
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        if((presupuesto / 4) >= restante){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto/2) >= restante){
            restanteDiv.classList.remove('alert-success','alert-danger');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el restante es menor o igual a 0
        if(restante <= 0){
            ui.mostrarMensaje('Presupuesto Agotado', 'error');
            document.querySelector('button[type="submit"]').disabled = true;
        }else{
            document.querySelector('button[type="submit"]').disabled = false;
        }
    }
}
//INSTANCIAS
const ui = new UI();
let presupuesto;

//FUNCIONES
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');
    if(presupuestoUsuario === '' || presupuestoUsuario === null || presupuestoUsuario <= 0 || isNaN(presupuestoUsuario)){
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}
function validarFormulario(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    if(nombre === '' || cantidad === ''){
        ui.mostrarMensaje('Ambos campos son obligatorios', 'error');
        return;
    }else if(isNaN(cantidad) || cantidad <= 0){        
        ui.mostrarMensaje('Cantidad no válida', 'error');
        return;
    }
    ui.mostrarMensaje('Gasto agregado correctamente', 'exito');
    formulario.reset();
    //Lo contrario a destructuring object
    const gastosa = {nombre, cantidad, id: Date.now()};
    presupuesto.nuevoGasto(gastosa);
    //Destructuring a presupuesto
    const {gastos} = presupuesto;
    //Mostrar gastos en listado.
    ui.mostrarGastos(gastos);
    ui.insertarPresupuesto(presupuesto);
    ui.comprobarPresupuesto(presupuesto);
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos} = presupuesto;
    ui.mostrarGastos(gastos)
    ui.insertarPresupuesto(presupuesto);
    ui.comprobarPresupuesto(presupuesto);
}