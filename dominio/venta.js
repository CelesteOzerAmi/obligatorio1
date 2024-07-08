const venta = {
    // método de inicio del objeto venta
    inicio: function () {
        // lee la lista de ventas desde la memoria
        this.ventas = memoria.leer('ventas');

        // lee la lista de muebles desde la memoria
        this.muebles = memoria.leer('muebles');

        // lee el array de clientes desde la memoria
        this.clientes = memoria.leer('clientes');

        // lee el array de categorias desde la memoria
        this.categorias = memoria.leer('categorias');

        // lee el próximo ID de venta desde la memoria y lo inicializa en 1 si es menor que 1
        let id = memoria.leer('proximoId');
        if (id < 1) {
            memoria.escribir('proximoId', 1);
        }
        this.proximoId = memoria.leer('proximoId');

        // inicializa el objeto mueble seleccionado como vacío
        this.muebleSel = {};

        // inicializa el formulario y lista las ventas
        this.inicializar();
        this.listar();

        // se listan los muebles
        this.listarMuebles();

        // se listan las categorias
        this.listarCategorias();

        // se listan los clientes
        this.listarClientes();
    },

    // método para crear un objeto venta con los datos proporcionados
    crear: function (codigo, fecha, cliente, mueble, cantidad, total) {
        return {
            codigo:   codigo,
            fecha:    fecha,
            cliente:  cliente,
            mueble:   mueble,
            cantidad: cantidad,
            total:    total
        };
    },

    // método para agregar una nueva venta
    agregar: function () {

        // toma los valores de los campos del formulario
        let codigo         = parseInt(document.getElementById('codigo').value);
        let fecha          = document.getElementById('fecha').value;
        let codigo_cliente = parseInt(document.getElementById('cliente').value);
        let categoria      = document.getElementById('categoria').value;
        let mueble         = document.getElementById('mueble').value;
        let cantidad       = parseInt(document.getElementById('cantidad').value);
        let total          = parseInt(document.getElementById('total').value);


        // valida que el código de venta no sea reutilizado
        for (let i = 0; i < this.ventas.length; i++) {

            if (codigo === this.ventas[i].codigo) {
                alert("Venta ya ingresada");
                return
            };
        };

        if (!fecha){
            alert("Seleccione la fecha de la venta");
            return
        }
        // valida que se haya ingresado el código del mueble
        if (!codigo_cliente) {
            alert("Ingrese el cliente");
            document.getElementById('cliente').focus();
            return;
        };

        // valida que se haya ingresado el código del mueble
        if (categoria == "") {
            alert("Ingrese la categoría");
            document.getElementById('categoria').focus();
            return;
        };

        // valida que se haya ingresado el código del mueble
        if (mueble == "") {
            alert("Ingrese el mueble");
            document.getElementById('mueble').focus();
            return;
        };

        // valida que la cantidad sea un número
        if (isNaN(cantidad)) {
            alert("Ingrese la cantidad");
            document.getElementById('cantidad').focus();
            return;
        };


        // valida el stock del mueble seleccionado antes de realizar la venta
        if (!this.validarStock()) {
            document.getElementById('cantidad').focus();
            return;
        };

        // guarda el objeto cliente 
        let unCliente = this.buscarCliente(codigo_cliente);

        // crea un objeto venta con los valores obtenidos
        const unaVenta = this.crear(codigo, fecha, unCliente, {...this.muebleSel}, cantidad, total);

        // agrega la venta al arreglo de ventas
        this.ventas.push(unaVenta);

        // mensaje de confirmación
        alert("Venta ingresada con éxito");

        // guarda el arreglo actualizado en la memoria
        memoria.escribir('ventas', this.ventas);

        // actualiza el stock del mueble vendido y lista nuevamente las ventas
        this.actualizarStock(mueble, cantidad, 'VENTA');
        this.listar();

        // incrementa el código para la próxima venta y reinicia el formulario
        this.incrementoId();
        this.inicializar();
    },


    // función para eliminar una venta
    eliminar: function () {

        // toma el código de la venta a eliminar desde el formulario
        let codigo = document.getElementById('codigo').value;

        // almacena la posición de la venta, el código del mueble y la cantidad de la venta
        let posicion = -1;
        let codMueble;
        let cantMueble;

        // itera sobre el arreglo de ventas para encontrar la venta con el código correspondiente
        for (let i = 0; i < this.ventas.length; i++) {
            if (this.ventas[i].codigo == codigo) {
                posicion   = i;
                codMueble  = this.ventas[i].mueble;
                cantMueble = this.ventas[i].cantidad;
            }
        }

        // si se encontró la venta, la elimina del arreglo y actualiza el stock del mueble correspondiente
        if (posicion >= 0) {
            this.ventas.splice(posicion, 1);
            this.actualizarStock(codMueble, cantMueble, 'DEVOLUCION');
            alert("Venta eliminada con éxito");

        } else {
            alert("Seleccione la venta a eliminar");
        }

        // lista nuevamente las ventas actualizadas
        this.listar();

        // guarda el arreglo actualizado en la memoria
        memoria.escribir('ventas', this.ventas);

        // reinicia el formulario
        this.inicializar();
    },


    // método para listar las ventas en el elemento select del HTML
    listar: function () {
        // tomo el elemento select del HTML
        let lista = document.getElementById('lista').options;
        // se reinicia el select
        lista.length = 0;

        // itero sobre el arreglo de ventas y agrega cada venta como una opción en el select
        for (let objVenta of this.ventas) {
            let texto = 'Código: ' + objVenta.codigo         + ' | Fecha: '  + objVenta.fecha +
                ' | Cliente: '     + objVenta.cliente.nombre + ' | Mueble: ' + objVenta.mueble.nombre +
                ' | Cantidad: '    + objVenta.cantidad       + ' | Total: $' + objVenta.total;
            let elemento = new Option(texto, objVenta.codigo);
            lista.add(elemento);
        }
    },


    // método para listar los muebles 
    listarMuebles: function () {

        // se toman las opciones del select muebles
        let lista = document.getElementById('mueble').options;

        let categoria = document.getElementById('categoria').value;

        lista.length = 0;

        let elementoVacio = new Option("Seleccione un mueble", "");

        lista.add(elementoVacio);

        for (let objMue of this.muebles) {

            if (categoria != "") {

                if (objMue.categoria.codigo == categoria) {
                    let texto = objMue.nombre;

                    let elemento = new Option(texto, objMue.codigo);

                    lista.add(elemento)
                }
            }
        }
    },


    // método para listar las categorías
    listarCategorias: function () {

        let lista = document.getElementById('categoria').options;

        lista.length = 0;

        let elementoVacio = new Option("Seleccione una categoría", "");

        lista.add(elementoVacio);

        for (let objCat of this.categorias) {

            let elemento = new Option(objCat.nombre, objCat.codigo);
            lista.add(elemento)
        }
    },


    // método para listar los clientes
    listarClientes: function () {

        let lista = document.getElementById('cliente').options;

        lista.length = 0;

        let elementoVacio = new Option("Seleccione un cliente", "");

        lista.add(elementoVacio);

        for (let objCli of this.clientes) {

            let elemento = new Option(objCli.nombre, objCli.codigo);
            lista.add(elemento)
        }
    },


    // método para inicializar el formulario de ingreso de ventas
    inicializar: function () {

        // reinicia el formulario
        document.getElementById('form').reset();

        // asigna el próximo código de venta al campo de código y establece el foco en el campo de mueble
        document.getElementById('codigo').value = this.proximoId;
        document.getElementById('fecha').focus();
    },

    // método para incrementar el código de la próxima venta
    incrementoId: function () {

        // incrementa el código de la próxima venta
        this.proximoId++;

        // guarda el nuevo código en la memoria
        memoria.escribir('proximoId', this.proximoId);
    },

    // método para seleccionar una venta del select y llenar el formulario con sus datos
    seleccionar: function () {

        // toma el código de la venta seleccionada desde el select
        let codigo = parseInt(document.getElementById('lista').value);

        // itera sobre el arreglo de ventas para encontrar la venta con el código correspondiente
        for (let objVenta of this.ventas) {
            if (objVenta.codigo == codigo) {

                // completa los campos del formulario con los datos de la venta seleccionada
                document.getElementById('codigo').value    = objVenta.codigo;
                document.getElementById('fecha').value     = objVenta.fecha;
                document.getElementById('cliente').value   = objVenta.cliente.codigo;
                document.getElementById('categoria').value = objVenta.mueble.categoria.codigo;
                document.getElementById('mueble').value    = objVenta.mueble.codigo;
                this.buscarMueble();
                document.getElementById('cantidad').value  = objVenta.cantidad;
                document.getElementById('total').value     = objVenta.total;
            }
        }
    },

    // método para buscar el mueble seleccionado y mostrar sus detalles en el formulario
    buscarMueble: function () {
        // toma el código del mueble desde el campo de mueble en el formulario
        let codigo = parseInt(document.getElementById('mueble').value);
        // itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let objM of this.muebles) {
            if (objM.codigo == codigo) {

                // asigna el objeto mueble encontrado a la propiedad muebleSel y muestra sus detalles
                this.muebleSel = objM;
                document.getElementById('datos').value = objM.descripcion;
            };
        };
    },

    // método para buscar un cliente
    buscarCliente: function (codigo) {

        for (let objCli of this.clientes) {
            if (objCli.codigo == codigo) {
                return objCli;
            }
        }
        return null;
    },

    // método para calcular el total de la venta en base a la cantidad ingresada y el precio del mueble seleccionado
    calcularTotal: function () {
        let cantidad = document.getElementById('cantidad').value;
        let total    = cantidad * this.muebleSel.precio;
        document.getElementById('total').value = total;
    },

    // método para validar si la cantidad ingresada para la venta no supera el stock disponible del mueble seleccionado
    validarStock: function () {
        let cantidad = parseInt(document.getElementById('cantidad').value);

        if (cantidad > this.muebleSel.stock) {
            alert('Stock insuficiente');
            return false;
        }
        return true;

    },

    // método para actualizar el stock del mueble vendido o devuelto en la lista de muebles
    actualizarStock: function (codMueble, cantidad, tipo) {
        // itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codMueble) {

                // actualiza el stock del mueble según el tipo de operación (VENTA o DEVOLUCION)
                if (tipo == 'VENTA') {
                    objMueble.stock -= cantidad;
                    objMueble.vendidos += cantidad;
                } else {
                    objMueble.stock += cantidad;
                    objMueble.vendidos -= cantidad;
                }
            }
        }
        // guarda el arreglo actualizado de muebles en la memoria
        memoria.escribir('muebles', this.muebles);
    },


    // método para ordenar las ventas según atributo indicado
    ordenar: function(atr){
        this.ventas = this.ordenoBurbuja(this.ventas, atr);
        this.listar();
    },

    ordenoBurbuja: function (array, att){
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - 1; j++) {
              if (array[j][att] > array[j + 1][att]) {
                let aux = array[j];
                array[j] = array[j + 1];
                array[j + 1] = aux;
              }
            }
          }
          return array;
    }
};
