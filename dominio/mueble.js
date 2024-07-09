const mueble = {
    // método de inicio del objeto mueble
    inicio: function () {
        // lee la lista de muebles desde la memoria
        this.muebles = memoria.leer('muebles');

        // lee el array de categorias desde la memoria
        this.categorias = memoria.leer('categorias');

        // lee el próximo código de mueble desde la memoria
        let codigo = memoria.leer('proximoIdMueble');

        // si el próximo código es menor que 1, lo establece en 1
        if (codigo < 1) {
            memoria.escribir('proximoIdMueble', 1);
        }

        // guarda el próximo código de mueble en la propiedad del objeto
        this.proximoId = memoria.leer('proximoIdMueble');

        // inicializa y lista los muebles
        this.inicializar();
        this.listar();

        // se listan las categorias
        this.listarCategorias();
    },

    // método para crear un objeto mueble con los datos proporcionados
    crear: function (codigo, nombre, categoria, descripcion, precio, stock, vendidos) {
        return {
            codigo:      codigo,
            nombre:      nombre,
            categoria:   categoria,
            descripcion: descripcion,
            precio:      precio,
            stock:       stock,
            vendidos:    vendidos
        };
    },

    // método para agregar un mueble nuevo
    agregar: function () {
        // toma los valores de los campos del formulario
        let codigo           = parseInt(document.getElementById('codigo').value);
        let nombre           = document.getElementById('nombre').value;
        let codigo_categoria = document.getElementById('categoria').value;
        let descripcion      = document.getElementById('descripcion').value;
        let precio           = parseInt(document.getElementById('precio').value);
        let stock            = parseInt(document.getElementById('stock').value);
        let vendidos         = 0;

        // valida que el código no sea reutilizado
        for (let i = 0; i < this.muebles.length; i++) {

            if (codigo === this.muebles[i].codigo) {
                alert("Mueble ya ingresado");
                return
            };

        };

        // valida que el nombre no esté vacío
        if (nombre == "") {
            alert("Ingrese el nombre");
            document.getElementById('nombre').focus();
            return;
        };

        // valida que se ingrese la categoría
        if (codigo_categoria == "") {
            alert("Ingrese categoría");
            document.getElementById('categoria').focus();
            return
        };

        // valida que el precio se ingrese y sea un número
        if (isNaN(precio) || precio == 0) {
            alert("Ingrese el precio");
            document.getElementById('precio').focus();
            return;
        };

        // valida que el stock se ingrese y sea un número
        if (isNaN(stock)) {
            alert("Ingrese el stock");
            document.getElementById('stock').focus();
            return;
        };

        // guarda el objeto categoria
        let unaCategoria = this.buscarCategoria(codigo_categoria);

        // crea un objeto mueble con los valores obtenidos
        const unMueble = this.crear(codigo, nombre, unaCategoria, descripcion, precio, stock, vendidos);

        // agrega el mueble al arreglo de muebles
        this.muebles.push(unMueble);

        // muestra mensaje de confirmación
        alert("Mueble ingresado con éxito!");

        // guarda el arreglo actualizado en la memoria
        memoria.escribir('muebles', this.muebles);

        // lista nuevamente los muebles
        this.listar();

        // suma el código para el próximo mueble y reinicia el formulario
        this.incrementoId();
        this.inicializar();
    },


    // método para modificar un mueble existente
    modificar: function () {
        // toma el código del mueble a modificar desde el formulario
        let codigo = document.getElementById('codigo').value;

        for (let objMueble of this.muebles) {

            if (objMueble.codigo == codigo) {

                objMueble.nombre      = document.getElementById('nombre').value;
                let cod_cat           = document.getElementById('categoria').value;
                let unaCategoria      = this.buscarCategoria(cod_cat);
                objMueble.categoria   = unaCategoria;
                objMueble.descripcion = document.getElementById('descripcion').value;
                objMueble.precio      = parseInt(document.getElementById('precio').value);
                objMueble.stock       = parseInt(document.getElementById('stock').value);

                if (objMueble.nombre == "") {
                    alert("Ingrese el nombre");
                    document.getElementById('nombre').focus();
                    return
                };

                if (objMueble.categoria == "") {
                    alert("Ingrese categoría")
                    document.getElementById('categoría').focus();
                    return
                }

                if (objMueble.precio == "") {
                    alert("Ingrese el precio")
                    document.getElementById('precio').focus();
                    return
                };

                if (objMueble.stock == "") {
                    alert("Ingrese el stock")
                    document.getElementById('stock').focus();
                    return
                };


                // muestra mensaje de confirmación
                alert("Mueble modificado con éxito!");
            }

            // Vuelve a listar los muebles actualizados
            this.listar();

            // Guarda el arreglo actualizado en la memoria
            memoria.escribir('muebles', this.muebles);

            // Reinicia el formulario
            this.inicializar();

        };
    },

    // método para eliminar un mueble
    eliminar: function () {

        // toma el código del mueble a eliminar desde el formulario
        let codigo = document.getElementById('codigo').value;

        // guarda la posición del mueble a eliminar, inicializada en -1
        let posicion = -1;

        // itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let index = 0; index < this.muebles.length; index++) {
            if (this.muebles[index].codigo == codigo) {
                posicion = index;
            }
        }

        // si se encontró el mueble, lo elimina del arreglo
        if (posicion >= 0) {
            this.muebles.splice(posicion, 1);

            // muestra mensaje de confirmación
            alert("Mueble eliminado con éxito!");
        } else {
            alert("Seleccione el mueble a eliminar");
        }

        // lista los muebles actualizados
        this.listar();

        // guarda el arreglo actualizado en la memoria
        memoria.escribir('muebles', this.muebles);

        // reinicia el formulario
        this.inicializar();
    },

    // método para listar los muebles en el elemento select del HTML
    listar: function () {
        // toma el elemento select del HTML
        let lista = document.getElementById('lista').options;
        // elimina todos los elementos actuales del select
        lista.length = 0;

        // itera sobre el arreglo de muebles y agrega cada mueble como una opción en el select
        for (let objMueble of this.muebles) {

            let texto = 'Código: ' + objMueble.codigo + ' | Nombre: ' + objMueble.nombre + ' | Precio: ' + 
            objMueble.precio + ' | Stock: ' + objMueble.stock;

            let elemento = new Option(texto, objMueble.codigo);

            lista.add(elemento);
        }
    },


    // método para listar las categorías ingresadas
    listarCategorias: function () {

        // toma el select desde el html
        let lista = document.getElementById("categoria").options;

        // reinicia la lista
        lista.length = 0;

        // crea una opción por defecto
        let elementoVacio = new Option("Seleccione una categoria", "");

        lista.add(elementoVacio);

        // por cada categoría se agrega una nueva opción a la lista
        for (let objCat of this.categorias) {

            let elemento = new Option(objCat.nombre, objCat.codigo);

            lista.add(elemento)
        }
    },

    // método para inicializar el formulario de ingreso de muebles
    inicializar: function () {

        // reinicia el formulario 
        document.getElementById('form').reset();

        // asigna el próximo código de mueble al campo de código y establece el foco en el campo nombre
        document.getElementById('codigo').value = this.proximoId;
        document.getElementById('nombre').focus();
    },

    // método para incrementar el código del próximo mueble
    incrementoId: function () {

        // incrementa el código del próximo mueble
        this.proximoId++;

        // guarda el nuevo código en la memoria
        memoria.escribir('proximoIdMueble', this.proximoId);
    },

    // método para seleccionar un mueble del select y llenar el formulario con sus datos
    seleccionar: function () {

        // toma el código del mueble seleccionado desde el select
        let codigo = document.getElementById('lista').value;

        // itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let objMueble of this.muebles) {

            if (objMueble.codigo == codigo) {

                // completa los campos del formulario con los datos del mueble seleccionado
                document.getElementById('codigo').value      = objMueble.codigo;
                document.getElementById('nombre').value      = objMueble.nombre;
                document.getElementById('categoria').value   = objMueble.categoria.codigo;
                document.getElementById('descripcion').value = objMueble.descripcion;
                document.getElementById('precio').value      = objMueble.precio;
                document.getElementById('stock').value       = objMueble.stock;

            };

        };

    },

    // método para buscar una categoría por código
    buscarCategoria: function (codigo) {

        for (let objCat of this.categorias) {

            if (objCat.codigo == codigo) {
                return objCat
            }
        }
        return null;
    },

    // método para ordenar los muebles según atributo indicado
    ordenar: function (atr) {
        this.muebles = this.ordenoBurbuja(this.muebles, atr);
        this.listar();
    },

    ordenoBurbuja: function (array, att) {
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
