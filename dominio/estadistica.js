const estadistica = {

    // Método de inicio para cargar ventas, muebles y preparar la lista
    inicio: function () {
        // Leer las ventas desde la memoria y asignarlas a this.ventas
        this.ventas = memoria.leer('ventas');

        // Leer los muebles desde la memoria y asignarlos a this.muebles
        this.muebles = memoria.leer('muebles');

        // Obtener el elemento con id 'lista' y asignarlo a this.lista
        this.lista = document.getElementById('lista');

        // Llamar al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // Llamar al método totalRecaudado para mostrar el total recaudado
        this.totalRecaudado();

        // Llamar al método listarMueblesConStock para mostrar los muebles con stock
        this.listarMueblesConStock();

        // Llamar al método muebleMasVendido para mostrar el mueble más vendido
        this.muebleMasVendido();
    },

    // Método para limpiar la lista
    limpiarLista: function () {
        // Vaciar el contenido del elemento select
        this.lista.innerHTML = '';
    },

    // Método para calcular y mostrar el total recaudado
    totalRecaudado: function () {
        // Llamar al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // Inicializar la variable total a 0
        let total = 0;

        // Iterar sobre cada venta en this.ventas
        for (let venta of this.ventas) {
            // Sumar el total de cada venta a la variable total
            total += venta.total;
        }

        // Crear un nuevo elemento Option con el texto del total recaudado
        let elemento = new Option("Total recaudado: $" + total, 0);

        // Agregar la opción al elemento select
        this.lista.add(elemento);
    },

    // Método para listar los muebles que tienen stock disponible
    listarMueblesConStock: function () {
        // Llamar al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // Variable para verificar si hay muebles con stock
        let tieneStock = false;

        // Iterar sobre cada mueble en this.muebles
        for (let mueble of this.muebles) {
            // Verificar si el mueble tiene stock disponible
            if (mueble.stock > 0) {
                // Crear el texto para la opción del select
                let texto = 'ID: ' + mueble.codigo + ' - Nombre: ' + mueble.nombre + ' - Precio: $' + mueble.precio + ' - Stock: ' + mueble.stock;

                // Crear un nuevo elemento Option con el texto del mueble
                let elemento = new Option(texto, mueble.codigo);

                // Agregar la opción al elemento select
                this.lista.add(elemento);

                // Establecer tieneStock a true porque hay al menos un mueble con stock
                tieneStock = true;
            }
        }

        // Si no hay muebles con stock, agregar una opción indicando eso
        if (!tieneStock) {
            let elemento = new Option("No hay muebles con stock disponible.", 0);
            this.lista.add(elemento);
        }
    },

    // Método para encontrar y mostrar el mueble más vendido
    muebleMasVendido: function () {
        // Llamar al método limpiarLista para vaciar la lista
        this.limpiarLista();

        // Objeto para contar las ventas por mueble
        let ventasPorMueble = {};

        // Iterar sobre cada venta en this.ventas
        for (let venta of this.ventas) {

            // Si el mueble no está en ventasPorMueble, inicializar su contador a 0
            if (!ventasPorMueble[venta.mueble]) {
                ventasPorMueble[venta.mueble] = 0;
            }
            // Sumar la cantidad de la venta al contador del mueble
            ventasPorMueble[venta.mueble] += venta.cantidad;
        }

        // Inicializar la variable maxVentas a 0 para encontrar el mueble más vendido
        let maxVentas = 0;

        // Inicializar un array para almacenar los muebles más vendidos
        let mueblesMasVendidos = [];

        // se inicia variable para guardar el nombre del mueble con más ventas
        let muebleNom;

        // Iterar sobre cada mueble en ventasPorMueble
        for (let mueble in ventasPorMueble) {

            // Si las ventas del mueble actual son mayores que maxVentas
            if (ventasPorMueble[mueble] > maxVentas) {
                // Actualizar maxVentas con las ventas del mueble actual
                maxVentas = ventasPorMueble[mueble];

                // Reiniciar el array mueblesMasVendidos con el mueble actual
                mueblesMasVendidos = {mueble};
            } 
            
            if (ventasPorMueble[mueble] === maxVentas) {
                // Agregar el mueble actual al array mueblesMasVendidos
                mueblesMasVendidos = {mueble};
                console.log(mueblesMasVendidos.mueble)
            }

        };


        // se registra el nombre del mueble con más ventas 
        for (let mueble of this.muebles) {
            if (mueble.codigo == mueblesMasVendidos.mueble) {
                muebleNom = mueble.nombre
            }
        };

        // si no hay muebles vendidos, se indica en lista
        if (mueblesMasVendidos.length == 0) {

            let elemento = new Option("No hay ventas registradas.", 0);
            this.lista.add(elemento);

        // si hay un mueble más vendido, se añade un elemento a la lista indicando su nombre, código y cantidad de ventas. 
        } else {
            for (let mueble in mueblesMasVendidos) {

                let texto = 'El producto más vendido es: ' + muebleNom + " (código " + mueblesMasVendidos.mueble + ")" + ' con ' + maxVentas + ' ventas.';

                // Crear un nuevo elemento Option con el texto del mueble
                let elemento = new Option(texto, mueble);

                // Agregar la opción al elemento select
                this.lista.add(elemento);

            }
        }
    }
};
