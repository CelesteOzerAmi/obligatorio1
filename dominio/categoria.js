const categoria = {

    // método de inicio del objeto categoria
    inicio: function () {
        // lee la lista de categorias desde la memoria
        this.categorias = memoria.leer('categorias');

        // lee el próximo código de categoria desde la memoria
        let codigo = memoria.leer('proximoIdcategoria');

        // si el próximo código es menor que 1, lo establece en 1
        if (codigo < 1) {
            memoria.escribir('proximoIdcategoria', 1);
        }

        // guarda el próximo código de categoria en la propiedad del objeto
        this.proximoId = memoria.leer('proximoIdcategoria');

        // se inicializa el formulario
        this.inicializar();

        // se listan las categorías del array
        this.listar();
    },


    // método para crear un nuevo objeto categoría con los datos ingresados
    crear: function (codigo, nombre) {

        return {
            codigo: codigo,
            nombre: nombre,
        }
    },

    // método para agregar un objeto categoria al array
    agregar: function () {

        // se guardan los valores ingresadas en cada campo
        let codigo = parseInt(document.getElementById("codigo").value);
        let nombre = document.getElementById("nombre").value;


        // se itera el array de categorias para validar que el código no sea reutilizado
        for (let objCategoria of this.categorias) {
            if (objCategoria.codigo === codigo) {
                alert("Categoría ya ingresada");
                return
            }
        };

        // valida que se ingrese el nombre
        if (nombre == "") {
            alert("Ingrese el nombre de la categoría");
            document.getElementById("nombre").focus();
            return
        };

        // se crea un objeto categoria con los datos de las variables
        const unaCategoria = this.crear(codigo, nombre);

        // el objeto se añade al array
        this.categorias.push(unaCategoria);

        // se guarda la memoria actualizada
        memoria.escribir("categorias", this.categorias);

        // se listan nuevamente los categorias
        this.listar();

        // se incrementa el id para el próximo categoria
        this.incrementoId();

        // se reinicia el formulario
        this.inicializar()
    },

    // método para modificar un categoria
    modificar: function () {

        // se toma el código de la categoría desde el formulario
        let codigo = parseInt(document.getElementById("codigo").value);

        // se itera sobre el array de categorias
        for (let objCategoria of this.categorias) {

            // si se encuentra el código que coincide con el ingresada,
            // se actualizan los valores
            if (objCategoria.codigo == codigo) {

                objCategoria.nombre = document.getElementById("nombre").value;

                // valida que se ingrese el nombre
                if (objCategoria.nombre == "") {
                    alert("Ingrese el nombre de la categoría");
                    document.getElementById("nombre").focus();
                    return
                };
            };
        };

        // se reinicia el listado
        this.listar();

        // se actualiza la memoria
        memoria.escribir("categorias", this.categorias);

        // se reinicia el formulario
        this.inicializar();
    },


    // método para eliminar un categoria
    eliminar: function () {

        // se toma el código ingresada en el formulario
        let codigo = parseInt(document.getElementById("codigo").value);

        // se inicializa la variable pos para guardar la posicion de la categoría a eliminar
        let pos = -1;

        // se itera sobre el array de categorias para encontrar el categoria a eliminar
        for (let i = 0; i < this.categorias.length; i++) {

            // si se encuentra el categoria con el código ingresada, se guarda su posicion
            if (this.categorias[i].codigo == codigo) {
                pos = i
            }
        };


        // si la posición es mayor a -1, se elimina el categoria 
        if (pos >= 0) {
            this.categorias.splice(pos, 1)
        } else {
            alert("código incorrecto")
        };


        // se reinicia el listado
        this.listar();

        // se actualiza la memoria
        memoria.escribir("categorias", this.categorias);

        // se reinicia el formulario
        this.inicializar();
    },


    // método para listar los categorias en el select (html)
    listar: function () {

        // se toma el elemento select
        let lista = document.getElementById("lista").options;

        // se eliminan los elementos existentes
        lista.length = 0;

        // se itera sobre el array de categorias y cada objeto se añade 
        // como una nueva opción en el select 
        for (let objCategoria of this.categorias) {

            let texto = "Código: " + objCategoria.codigo + " | Nombre: "       +
                objCategoria.nombre;

            let elemento = new Option(texto, objCategoria.codigo);
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


    // método para incrementar el id del próximo categoria
    incrementoId: function () {

        // incrementa en 1 el próximo id
        this.proximoId++;

        // guarda en la memoria el id incrementado
        memoria.escribir("proximoIdcategoria", this.proximoId)
    },


    // método para seleccionar un categoria desde el select y mostrar los datos en el form
    seleccionar: function () {

        // se toma el código de la categoría seleccionado desde el select
        let codigo = document.getElementById('lista').value;

        // se itera sobre el arreglo para encontrar el categoria
        for (let objCategoria of this.categorias) {

            // si el codigo de un categoria coincide con el seleccionado,
            // se completan los campos del formulario con los datos de la categoría
            if (objCategoria.codigo == codigo) {
                document.getElementById("codigo").value    = objCategoria.codigo;
                document.getElementById("nombre").value    = objCategoria.nombre;
            }
        }
    }
}