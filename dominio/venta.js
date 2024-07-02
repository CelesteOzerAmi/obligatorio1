const venta = {
    // Función de inicio del objeto venta
    inicio: function () {
        // Lee la lista de ventas desde la memoria
        this.ventas = memoria.leer('ventas');

        // Lee la lista de muebles desde la memoria
        this.muebles = memoria.leer('muebles');

        // Lee el próximo ID de venta desde la memoria y lo inicializa en 1 si es menor que 1
        let id = memoria.leer('proximoId');
        if (id < 1) {
            memoria.escribir('proximoId', 1);
        }
        this.proximoId = memoria.leer('proximoId');

        // Inicializa el objeto mueble seleccionado como vacío
        this.muebleSel = {};

        // Inicializa el formulario y lista las ventas
        this.inicializar();
        this.listar();
    },

    // Función para crear un objeto venta con los datos proporcionados
    crear: function (codigo, mueble, cantidad, total) {
        return {
            codigo: codigo,
            mueble: mueble,
            cantidad: cantidad,
            total: total
        };
    },

    // Función para agregar una nueva venta
    agregar: function () {
        // Obtiene los valores de los campos del formulario
        let codigo = parseInt(document.getElementById('codigo').value);
        let mueble = document.getElementById('mueble').value;
        let cantidad = parseInt(document.getElementById('cantidad').value);
        let total = parseInt(document.getElementById('total').value);


        // valida que el código de venta no sea reutilizado
        for (let i = 0; i < this.ventas.length; i++) {

            if (codigo === this.ventas[i].codigo) {
                alert("Venta ya ingresada");
                return
            };
        }

        // Valida que se haya ingresado el código del mueble
        if (mueble == "") {
            alert("Ingrese el código del mueble");
            document.getElementById('mueble').focus();
            return;
        }

        // Valida que la cantidad sea un número
        if (isNaN(cantidad)) {
            alert("Ingrese la cantidad");
            document.getElementById('cantidad').focus();
            return;
        }


        // Valida el stock del mueble seleccionado antes de realizar la venta
        if (!this.validarStock()) {
            document.getElementById('cantidad').focus();
            return;
        }

        // Crea un objeto venta con los valores obtenidos
        const unaVenta = this.crear(codigo, mueble, cantidad, total);

        // Agrega la venta al arreglo de ventas
        this.ventas.push(unaVenta);

        // Guarda el arreglo actualizado en la memoria
        memoria.escribir('ventas', this.ventas);

        // Actualiza el stock del mueble vendido y lista nuevamente las ventas
        this.actualizarStock(mueble, cantidad, 'VENTA');
        this.listar();

        // Incrementa el ID para la próxima venta y reinicia el formulario
        this.incrementoId();
        this.inicializar();
    },

    // Función para modificar una venta existente
    modificar: function () {
        // Obtiene el código de la venta a modificar desde el formulario
        let codigo = parseInt(document.getElementById('codigo').value);

        let codMueble = 0;
        let cantMueble = 0;

        // Valida que el código no esté vacío
        if (!codigo) {
            alert("Seleccione la venta");
            return;
        }

        // Itera sobre el arreglo de ventas y actualiza los valores de la venta con el código correspondiente
        for (let objVenta of this.ventas) {
            if (objVenta.codigo == codigo) {

                // se guarda en variable "cant" la cantidad de la venta antes de modificarla
                let cant = objVenta.cantidad;

                objVenta.mueble = document.getElementById('mueble').value;
                objVenta.cantidad = parseInt(document.getElementById('cantidad').value);
                objVenta.total = parseInt(document.getElementById('total').value);

                codMueble = objVenta.mueble;
                cantMueble = objVenta.cantidad;
                

                // si la cantidad de la venta aumenta, el stock se actualiza como VENTA
                if (cant < document.getElementById('cantidad').value) {
                    cantMueble = cantMueble - cant;
                    this.actualizarStock(codMueble, cantMueble, 'VENTA');

                // si la cantidad de la venta disminuye, el stock se actualiza como DEVOLUCION
                } else if (cant > document.getElementById('cantidad').value) {
                    cantMueble = cant - cantMueble;
                    this.actualizarStock(codMueble, cantMueble, 'DEVOLUCION');
                }

            }
        }

        // Vuelve a listar las ventas actualizadas
        this.listar();

        // Guarda el arreglo actualizado en la memoria
        memoria.escribir('ventas', this.ventas);

        // Reinicia el formulario
        this.inicializar();
    },

    // Función para eliminar una venta
    eliminar: function () {
        // Obtiene el código de la venta a eliminar desde el formulario
        let codigo = document.getElementById('codigo').value;

        // Variables para almacenar la posición de la venta, el código del mueble y la cantidad de la venta
        let posicion = -1;
        let codMueble;
        let cantMueble;

        // Itera sobre el arreglo de ventas para encontrar la venta con el código correspondiente
        for (let i = 0; i < this.ventas.length; i++) {
            if (this.ventas[i].codigo == codigo) {
                posicion = i;
                codMueble = this.ventas[i].mueble;
                cantMueble = this.ventas[i].cantidad;
            }
        }

        // Si se encontró la venta, la elimina del arreglo y actualiza el stock del mueble correspondiente
        if (posicion >= 0) {
            this.ventas.splice(posicion, 1);
            this.actualizarStock(codMueble, cantMueble, 'DEVOLUCION');
        } else {
            alert("Codigo incorrecto");
        }

        // Lista nuevamente las ventas actualizadas
        this.listar();

        // Guarda el arreglo actualizado en la memoria
        memoria.escribir('ventas', this.ventas);

        // Reinicia el formulario
        this.inicializar();
    },

    // función para limpiar las cajas
    limpiar: function () {

        document.getElementById("dep").reset();
        document.getElementById("codigo").value = this.proximoId;

    },

    // Función para listar las ventas en el elemento select del HTML
    listar: function () {
        // Obtiene el elemento select del HTML
        let lista = document.getElementById('lista').options;
        // Elimina todos los elementos actuales del select
        lista.length = 0;

        // Itera sobre el arreglo de ventas y agrega cada venta como una opción en el select
        for (let objVenta of this.ventas) {
            let texto = 'ID: ' + objVenta.codigo + ' - Mueble: ' + objVenta.mueble + ' - Cantidad: ' + objVenta.cantidad + ' - Total: ' + objVenta.total;
            let elemento = new Option(texto, objVenta.codigo);
            lista.add(elemento);
        }
    },

    // Función para inicializar el formulario de ingreso de ventas
    inicializar: function () {
        // Asigna el próximo ID de venta al campo de código y establece el foco en el campo de mueble
        document.getElementById('codigo').value = this.proximoId;
        document.getElementById('mueble').focus();
    },

    // Función para incrementar el ID de la próxima venta
    incrementoId: function () {
        // Incrementa el ID de la próxima venta
        this.proximoId++;
        // Guarda el nuevo ID en la memoria
        memoria.escribir('proximoId', this.proximoId);
    },

    // Función para seleccionar una venta del select y llenar el formulario con sus datos
    seleccionar: function () {
        // Obtiene el código de la venta seleccionada desde el select
        let codigo = document.getElementById('lista').value;
        // Itera sobre el arreglo de ventas para encontrar la venta con el código correspondiente
        for (let objVenta of this.ventas) {
            if (objVenta.codigo == codigo) {
                // Llena los campos del formulario con los datos de la venta seleccionada
                document.getElementById('codigo').value = objVenta.codigo;
                document.getElementById('mueble').value = objVenta.mueble;
                this.buscarMueble();
                document.getElementById('cantidad').value = objVenta.cantidad;
                this.calcularTotal();
            }
        }
    },

    // Función para buscar el mueble seleccionado y mostrar sus detalles en el formulario
    buscarMueble: function () {
        // Obtiene el código del mueble desde el campo de mueble en el formulario
        let codigo = document.getElementById('mueble').value;
        // Itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let objM of this.muebles) {
            if (objM.codigo == codigo) {
                // Asigna el objeto mueble encontrado a la propiedad muebleSel y muestra sus detalles
                this.muebleSel = objM;
                document.getElementById('datos').value = objM.nombre + " - $" + objM.precio;
                return
            } else if (codigo != objM.codigo) {
                document.getElementById('datos').value = "No se encontró el código de mueble.";
            };

        };

    },

    // Función para calcular el total de la venta en base a la cantidad ingresada y el precio del mueble seleccionado
    calcularTotal: function () {
        let cantidad = document.getElementById('cantidad').value;
        let total = cantidad * this.muebleSel.precio;
        document.getElementById('total').value = total;
    },

    // Función para validar si la cantidad ingresada para la venta no supera el stock disponible del mueble seleccionado
    validarStock: function () {
        let cantidad = document.getElementById('cantidad').value;

        // se valida que la cantidad no sea 0 o menos
        if (cantidad <= 0) {
            alert("Ingrese una cantidad");
        };

        if (cantidad > this.muebleSel.stock) {
            alert('Stock insuficiente');
            return false;
        }
        return true;

    },

    // Función para actualizar el stock del mueble vendido o devuelto en la lista de muebles
    actualizarStock: function (codMueble, cantidad, tipo) {
        // Itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codMueble) {

                // Actualiza el stock del mueble según el tipo de operación (VENTA o DEVOLUCION)
                if (tipo == 'VENTA') {
                    objMueble.stock -= cantidad;
                } else {
                    objMueble.stock += cantidad;
                }
            }
        }
        // Guarda el arreglo actualizado de muebles en la memoria
        memoria.escribir('muebles', this.muebles);
    }
};
