const estadistica = {

    // método de inicio para cargar ventas, muebles y preparar la lista
    inicio: function () {
        // lee las ventas desde la memoria y las asigna a this.ventas
        this.ventas = memoria.leer('ventas');

        // lee los muebles desde la memoria y los asigna a this.muebles
        this.muebles = memoria.leer('muebles');

        // lee los clientes desde la memoria y los asigna a this.clientes
        this.clientes = memoria.leer('clientes');

        // toma el elemento con id 'lista' y lo asigna a this.lista
        this.lista = document.getElementById('lista');

        this.inicializar();
        // llama al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // llama al método totalRecaudado para mostrar el total recaudado
        this.totalRecaudado();

        // llama al método listarMueblesConStock para mostrar los muebles con stock
        this.listarMueblesConStock();

        // llama al método muebleMasVendido para mostrar el mueble más vendido
        this.muebleMasVendido();

        // llama al método listar para obtener los clientes 
        this.listar();

        // llama al método listarVentasPorFecha para ordenar las ventas por fecha
        this.listarVentasPorFecha();
    },

    // método para limpiar la lista
    limpiarLista: function () {
        // vacía el contenido del elemento select
        this.lista.innerHTML = '';
    },

    // método para calcular y mostrar el total recaudado
    totalRecaudado: function () {
        // llama al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // inicializa la variable total a 0
        let total = 0;

        // itera sobre cada venta en this.ventas
        for (let venta of this.ventas) {
            // suma el total de cada venta a la variable total
            total += venta.total;
        }

        // crea un nuevo elemento Option con el texto del total recaudado
        let elemento = new Option("Total recaudado: $" + total, 0);

        // agrega la opción al elemento select
        this.lista.add(elemento);
    },

    // método para listar los muebles que tienen stock disponible
    listarMueblesConStock: function () {

        // llama al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // variable para verificar si hay muebles con stock
        let tieneStock = false;

        // itera sobre cada mueble
        for (let mueble of this.muebles) {

            // verifica si el mueble tiene stock disponible
            if (mueble.stock > 0) {

                // crea el texto para la opción del select
                let texto = 'Código: ' + mueble.codigo + ' | Nombre: ' + mueble.nombre + ' | Precio: $' + mueble.precio + ' | Stock: ' + mueble.stock;

                // crea un nuevo elemento Option con el texto del mueble
                let elemento = new Option(texto, mueble.codigo);

                // agrega la opción al elemento select
                this.lista.add(elemento);

                // establece tieneStock a true porque hay al menos un mueble con stock
                tieneStock = true;
            }
        }

        // si no hay muebles con stock, agregar una opción para indicarlo
        if (!tieneStock) {
            let elemento = new Option("No hay muebles con stock disponible.", 0);
            this.lista.add(elemento);
        }
    },


    // método para encontrar y mostrar el mueble más vendido
    muebleMasVendido: function () {
        // llama al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // inicializa masVendido en 0
        let masVendido = 0;

        for (let objM of this.muebles) {

            // por cada mueble, se evalúa la cantidad de ventas
            if (objM.vendidos > masVendido) {

                // si la cantidad de ventas es mayor a masVendido, se guarda en masVendido
                masVendido = objM.vendidos;
                let texto = objM.nombre + " (" + objM.categoria.nombre +
                    "), unidades vendidas: " + objM.vendidos;

                // crea un nuevo elemento Option con el texto del total recaudado
                let elemento = new Option(texto, "");

                // agrega la opción al elemento select
                this.lista.add(elemento);
            }
        };

        if (masVendido == 0) {
            let texto = "No hay muebles vendidos"

            // crea un nuevo elemento Option con el texto del total recaudado
            let elemento = new Option(texto, "");

            // agrega la opción al elemento select
            this.lista.add(elemento);
        }

    },


    // método para listar las ventas según fecha seleccionada
    listarVentasPorFecha: function () {

        // tomo la fecha seleccionada en el elemento html
        let fecha = document.getElementById('fechaVenta').value;

        // guardo el select 
        let listado = document.getElementById('ventasporfecha').options;

        // reinicio el select
        listado.length = 0;

        // por cada objeto venta se evalúa si la fecha coincide con la ingresada, para agregarlo en el select
        for (let objVenta of this.ventas) {
            if (objVenta.fecha == fecha) {

                let texto = objVenta.cantidad + " " + objVenta.mueble.nombre +
                    " (" + objVenta.mueble.categoria.nombre + ") " + objVenta.cliente.nombre;

                let elemento = new Option(texto);

                listado.add(elemento);
            }
        };

        // si no hay ventas con la fecha ingresada, se indica en el select
        if (listado.length == 0) {
            let elemento = new Option("No se encontraron datos para la fecha seleccionada");
            listado.add(elemento)
        }
    },

    // método para listar los clientes en el select (html)
    listar: function () {

        // se toma el elemento select
        let lista = document.getElementById('clientes').options;

        // se eliminan los elementos existentes
        lista.length = 0;

        // se itera sobre el array de clientes y cada objeto se añade 
        // como una nueva opción en el select 
        for (let objCliente of this.clientes) {

            let texto = objCliente.nombre;

            let elemento = new Option(texto, objCliente.codigo);
            lista.add(elemento)
        }
    },

    // método para listar las ventas seleccionando un cliente
    ventasporcliente: function () {

        // tomo los elementos del html
        let cliente = document.getElementById('clientes').value;
        let lista = document.getElementById('ventasporcliente').options;

        // reinicio la lista
        lista.length = 0;

        // por cada objeto venta de la clase ventas, se evalúa si coincide el cliente con el seleccionado
        for (let objV of this.ventas) {

            // si coincide, se añade los datos de la venta a la lista
            if (objV.cliente.codigo == cliente) {
                let texto = objV.cantidad + " " + objV.mueble.nombre +
                    " (" + objV.mueble.categoria.nombre + "), $" + objV.total;

                let elemento = new Option(texto);

                lista.add(elemento);
            }
        };

        // si no hay ventas para el cliente seleccionado, se indica en la lista
        if (lista.length == 0) {
            let elemento = new Option("No hay ventas para el cliente seleccionado");

            lista.add(elemento);
        }
    },



    // método para iniciar el calendario con la fecha de hoy
    inicializar: function () {
        let fechaHoy = new Date();
        let dia = fechaHoy.getDate();
        dia = dia.toString();
        dia = (dia.length == 1) ? "0" + dia : dia;
        let mes = fechaHoy.getMonth() + 1;
        mes = mes.toString();
        mes = (mes.length == 1) ? "0" + mes : mes;
        let fecha = fechaHoy.getFullYear() + "-" + mes + "-" + dia;

        document.getElementById('fechaVenta').value = fecha;
    },

}