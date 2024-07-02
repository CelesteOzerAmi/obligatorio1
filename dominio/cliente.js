const cliente = {

    // método de inicio del objeto cliente
    inicio: function () {
        // lee la lista de clientes desde la memoria
        this.clientes = memoria.leer('clientes');

        // lee el próximo código de cliente desde la memoria
        let codigo = memoria.leer('proximoIdCliente');

        // si el próximo código es menor que 1, lo establece en 1
        if (codigo < 1) {
            memoria.escribir('proximoIdCliente', 1);
        }

        // guarda el próximo código de cliente en la propiedad del objeto
        this.proximoId = memoria.leer('proximoIdCliente');

        // se inicializa el formulario
        this.inicializar();

        // se listan los clientes del array
        this.listar();
    },


    // método para crear un nuevo objeto cliente con los datos ingresados
    crear: function (codigo, nombre, cedula, telefono, email, direccion) {

        return {
            codigo:    codigo,
            nombre:    nombre,
            cedula:    cedula,
            telefono:  telefono,
            email:     email,
            direccion: direccion
        }
    },

    // método para agregar un objeto cliente al array
    agregar: function () {

        // se guardan los valores ingresados en cada campo
        let codigo    = parseInt(document.getElementById("codigo").value);
        let nombre    = document.getElementById("nombre").value;
        let cedula    = document.getElementById("cedula").value;
        let telefono  = document.getElementById("telefono").value;
        let email     = document.getElementById("email").value;
        let direccion = document.getElementById("direccion").value;

        // se itera el array de clientes para validar que el código no sea reutilizado
        for (let objCliente of this.clientes) {
            if (objCliente.codigo === codigo) {
                alert("Cliente ya ingresado");
                return
            }
        };

        // valida que se ingrese el nombre
        if (nombre == "") {
            alert("Ingrese el nombre del cliente");
            document.getElementById("nombre").focus();
            return
        };

        // valida que se ingrese la cédula del cliente
        if (cedula == "") {
            alert("Ingrese la cédula del cliente");
            document.getElementById("cedula").focus();
            return
        };

        // valida que se ingrese el email del cliente
        if (email == "") {
            alert("Ingrese el email del cliente");
            document.getElementById("email").focus();
            return
        };

        // valida que se ingrese el telefono del cliente
        if (telefono == "") {
            alert("Ingrese el teléfono del cliente");
            document.getElementById("telefono").focus();
            return
        };


        // se crea un objeto cliente con los datos de las variables
        const unCliente = this.crear(codigo, nombre, cedula, telefono, email, direccion);

        // el objeto se añade al array
        this.clientes.push(unCliente);

        // se guarda la memoria actualizada
        memoria.escribir("clientes", this.clientes);

        // se listan nuevamente los clientes
        this.listar();

        // se incrementa el id para el próximo cliente
        this.incrementoId();

        // se reinicia el formulario
        this.inicializar()
    },

    // método para modificar un cliente
    modificar: function () {

        // se toma el código del cliente desde el formulario
        let codigo = parseInt(document.getElementById("codigo").value);

        // se itera sobre el array de clientes
        for (let objCliente of this.clientes) {

            // si se encuentra el código que coincide con el ingresado,
            // se actualizan los valores
            if (objCliente.codigo == codigo) {

                objCliente.nombre    = document.getElementById("nombre").value;
                objCliente.cedula    = document.getElementById("cedula").value;
                objCliente.telefono  = document.getElementById("telefono").value;
                objCliente.email     = document.getElementById("email").value;
                objCliente.direccion = document.getElementById("direccion").value;

                // valida que se ingrese el nombre
                if (objCliente.nombre == "") {
                    alert("Ingrese el nombre del cliente");
                    document.getElementById("nombre").focus();
                    return
                };

                // valida que se ingrese la cédula del cliente
                if (objCliente.cedula == "") {
                    alert("Ingrese la cédula del cliente");
                    document.getElementById("cedula").focus();
                    return
                };

                // valida que se ingrese el email del cliente
                if (objCliente.email == "") {
                    alert("Ingrese el email del cliente");
                    document.getElementById("email").focus();
                    return
                };

                // valida que se ingrese el telefono del cliente
                if (objCliente.telefono == "") {
                    alert("Ingrese el teléfono del cliente");
                    document.getElementById("telefono").focus();
                    return
                };

            };
        };

        // se reinicia el listado
        this.listar();

        // se actualiza la memoria
        memoria.escribir("clientes", this.clientes);

        // se reinicia el formulario
        this.inicializar();
    },


    // método para eliminar un cliente
    eliminar: function () {

        // se toma el código ingresado en el formulario
        let codigo = parseInt(document.getElementById("codigo").value);

        // se inicializa la variable pos para guardar la posicion del cliente a eliminar
        let pos = -1;

        // se itera sobre el array de clientes para encontrar el cliente a eliminar
        for (let i = 0; i < this.clientes.length; i++) {

            // si se encuentra el cliente con el código ingresado, se guarda su posicion
            if (this.clientes[i].codigo == codigo) {
                pos = i
            }
        };


        // si la posición es mayor a -1, se elimina el cliente 
        if (pos >= 0) {
            this.clientes.splice(pos, 1)
        } else {
            alert("código incorrecto")
        };


        // se reinicia el listado
        this.listar();

        // se actualiza la memoria
        memoria.escribir("clientes", this.clientes);

        // se reinicia el formulario
        this.inicializar();
    },


    // método para listar los clientes en el select (html)
    listar: function () {

        // se toma el elemento select
        let lista = document.getElementById("lista").options;

        // se eliminan los elementos existentes
        lista.length = 0;

        // se itera sobre el array de clientes y cada objeto se añade 
        // como una nueva opción en el select 
        for (let objCliente of this.clientes) {

            let texto = "Código: " + objCliente.codigo + " | Nombre: "       +
                objCliente.nombre  + " | Cédula: "     + objCliente.cedula   + " | Email: "     +
                objCliente.email   + " | Teléfono: "   + objCliente.telefono + " | Dirección: " +
                objCliente.direccion;

            let elemento = new Option(texto, objCliente.codigo);
            lista.add(elemento)
        }
    },


    // método para iniciar o reiniciar el formulario
    inicializar: function () {

        // reinicia el formulario
        document.getElementById("form").reset();

        // asigna el próximo código
        document.getElementById("codigo").value = this.proximoId;

        // focaliza el campo nombre
        document.getElementById("nombre").focus()
    },


    // método para incrementar el id del próximo cliente
    incrementoId: function () {

        // incrementa en 1 el próximo id
        this.proximoId++;

        // guarda en la memoria el id incrementado
        memoria.escribir("proximoIdCliente", this.proximoId)
    },


    // método para seleccionar un cliente desde el select y mostrar los datos en el form
    seleccionar: function () {

        // se toma el código del cliente seleccionado desde el select
        let codigo = document.getElementById('lista').value;

        // se itera sobre el arreglo para encontrar el cliente
        for (let objCliente of this.clientes) {

            // si el codigo de un cliente coincide con el seleccionado,
            // se completan los campos del formulario con los datos del cliente
            if (objCliente.codigo == codigo) {
                document.getElementById("codigo").value    = objCliente.codigo;
                document.getElementById("nombre").value    = objCliente.nombre;
                document.getElementById("cedula").value    = objCliente.cedula;
                document.getElementById("telefono").value  = objCliente.telefono;
                document.getElementById("email").value     = objCliente.email;
                document.getElementById("direccion").value = objCliente.direccion;
            }
        }
    }
}