const mueble = {
    // Función de inicio del objeto mueble
    inicio: function () {
        // Lee la lista de muebles desde la memoria
        this.muebles = memoria.leer('muebles');

        // Lee el próximo ID de mueble desde la memoria
        let codigo = memoria.leer('proximoIdMueble');

        // Si el próximo ID es menor que 1, lo establece en 1
        if (codigo < 1) {
            memoria.escribir('proximoIdMueble', 1);
        }

        // Guarda el próximo ID de mueble en la propiedad del objeto
        this.proximoId = memoria.leer('proximoIdMueble');

        // Inicializa y lista los muebles
        this.inicializar();
        this.listar();
    },

    // Función para crear un objeto mueble con los datos proporcionados
    crear: function (codigo, nombre, descripcion, precio, stock) {
        return {
            codigo: codigo,
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            stock: stock
        };
    },

    // Función para agregar un mueble nuevo
    agregar: function () {
        // Obtiene los valores de los campos del formulario
        let codigo = parseInt(document.getElementById('codigo').value);
        let nombre = document.getElementById('nombre').value;
        let descripcion = document.getElementById('descripcion').value;
        let precio = parseInt(document.getElementById('precio').value);
        let stock = parseInt(document.getElementById('stock').value);

        // Valida que el código sea un número
        if (isNaN(codigo)) {
            alert("ID incorrecto");
            document.getElementById('codigo').focus();
            return;
        }

        // valida que el código no sea reutilizado
        for (let i = 0; i < this.muebles.length; i++) {

            if (codigo === this.muebles[i].codigo) {
                alert("Mueble ya ingresado");
                return
            };
            
        }


        // Valida que el nombre no esté vacío
        if (nombre == '') {
            alert("Ingrese el nombre");
            document.getElementById('nombre').focus();
            return;
        }


        // Valida que el precio se ingrese y sea un número
        if (isNaN(precio) || precio == 0) {
            alert("Ingrese el precio");
            document.getElementById('precio').focus();
            return;
        }

        // Valida que el stock se ingrese y sea un número
        if (isNaN(stock)) {
            alert("Ingrese el stock");
            document.getElementById('stock').focus();
            return;
        }

        // Crea un objeto mueble con los valores obtenidos
        const unMueble = this.crear(codigo, nombre, descripcion, precio, stock);

        // Agrega el mueble al arreglo de muebles
        this.muebles.push(unMueble);

        // Guarda el arreglo actualizado en la memoria
        memoria.escribir('muebles', this.muebles);

        // Lista nuevamente los muebles
        this.listar();

        // Incrementa el ID para el próximo mueble y reinicia el formulario
        this.incrementoId();
        this.inicializar();
    },

    // Función para modificar un mueble existente
    modificar: function () {
        // Obtiene el código del mueble a modificar desde el formulario
        let codigo = document.getElementById('codigo').value;

        // Valida que el código no esté vacío
        if (!codigo) {
            alert("ID Incorrecto");
            return;
        }

        // Itera sobre el arreglo de muebles y actualiza los valores del mueble con el código correspondiente
        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codigo) {
                objMueble.nombre = document.getElementById('nombre').value;
                objMueble.descripcion = document.getElementById('descripcion').value;
                objMueble.precio = document.getElementById('precio').value;
                objMueble.stock = document.getElementById('stock').value;
            }
        }

        // Vuelve a listar los muebles actualizados
        this.listar();

        // Guarda el arreglo actualizado en la memoria
        memoria.escribir('muebles', this.muebles);

        // Reinicia el formulario
        this.inicializar();
    },

    // Función para eliminar un mueble
    eliminar: function () {
        // Obtiene el código del mueble a eliminar desde el formulario
        let codigo = document.getElementById('codigo').value;

        // Variable para almacenar la posición del mueble a eliminar, inicializada en -1
        let posicion = -1;

        // Itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let index = 0; index < this.muebles.length; index++) {
            if (this.muebles[index].codigo == codigo) {
                posicion = index;
            }
        }

        // Si se encontró el mueble, lo elimina del arreglo
        if (posicion >= 0) {
            this.muebles.splice(posicion, 1);
        } else {
            alert("Código incorrecto");
        }

        // Vuelve a listar los muebles actualizados
        this.listar();

        // Guarda el arreglo actualizado en la memoria
        memoria.escribir('muebles', this.muebles);

        // Reinicia el formulario
        this.inicializar();
    },

    // Función para listar los muebles en el elemento select del HTML
    listar: function () {
        // Obtiene el elemento select del HTML
        let lista = document.getElementById('lista').options;
        // Elimina todos los elementos actuales del select
        lista.length = 0;

        // Itera sobre el arreglo de muebles y agrega cada mueble como una opción en el select
        for (let objMueble of this.muebles) {
            let texto = 'ID: ' + objMueble.codigo + ' - Nombre: ' + objMueble.nombre + ' - Precio: ' + objMueble.precio + ' - Stock: ' + objMueble.stock;
            let elemento = new Option(texto, objMueble.codigo);
            lista.add(elemento);
        }
    },

    // Función para inicializar el formulario de ingreso de muebles
    inicializar: function () {
        // Reinicia el formulario dep
        document.getElementById('dep').reset();
        // Asigna el próximo ID de mueble al campo de código y establece el foco en el campo de nombre
        document.getElementById('codigo').value = this.proximoId;
        document.getElementById('nombre').focus();
    },

    // Función para incrementar el ID del próximo mueble
    incrementoId: function () {
        // Incrementa el ID del próximo mueble
        this.proximoId++;
        // Guarda el nuevo ID en la memoria
        memoria.escribir('proximoIdMueble', this.proximoId);
    },

    // Función para seleccionar un mueble del select y llenar el formulario con sus datos
    seleccionar: function () {
        // Obtiene el código del mueble seleccionado desde el select
        let codigo = document.getElementById('lista').value;
        // Itera sobre el arreglo de muebles para encontrar el mueble con el código correspondiente
        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codigo) {
                // Llena los campos del formulario con los datos del mueble seleccionado
                document.getElementById('codigo').value = objMueble.codigo;
                document.getElementById('nombre').value = objMueble.nombre;
                document.getElementById('descripcion').value = objMueble.descripcion;
                document.getElementById('precio').value = objMueble.precio;
                document.getElementById('stock').value = objMueble.stock;
            };
            
        };
        
    },
    
};
