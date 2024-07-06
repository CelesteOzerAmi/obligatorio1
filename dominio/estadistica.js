const estadistica = {

    // método de inicio para cargar ventas, muebles y preparar la lista
    inicio: function () {
        // lee las ventas desde la memoria y asignarlas a this.ventas
        this.ventas = memoria.leer('ventas');

        // lee los muebles desde la memoria y asignarlos a this.muebles
        this.muebles = memoria.leer('muebles');

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
        }

    },

    listarVentasPorFecha: function () {
        let fecha = document.getElementById('fechaVenta').value;

        let listado = document.getElementById('ventasporfecha').options;

        listado.length = 0;

        for (let objVenta of this.ventas) {
            if (objVenta.fecha == fecha) {

                let texto = objVenta.cantidad + " " + objVenta.mueble.nombre +
                    " (" + objVenta.mueble.categoria.nombre + ") " + objVenta.cliente.nombre;

                let elemento = new Option(texto);

                listado.add(elemento);
            }
        };

        if (listado.length == 0) {
            let elemento = new Option("No se encontraron datos para la fecha seleccionada");
            listado.add(elemento)
        }
    },

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