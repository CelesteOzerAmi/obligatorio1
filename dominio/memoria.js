const memoria = {
    // método para leer datos desde el almacenamiento local (localStorage)
    leer: function(clave) {
        // toma los datos almacenados bajo la clave proporcionada
        const datos = localStorage.getItem(clave);
        
        // si hay datos almacenados, los parsea desde JSON y los devuelve
        if (datos) {
            return JSON.parse(datos);
        } else {
            // si no hay datos almacenados para esa clave, inicializa la clave con un arreglo vacío y lo devuelve
            this.escribir(clave, []);
            return [];
        }
    },

    // método para escribir datos en el almacenamiento local (localStorage)
    escribir: function(clave, lista) {
        // convierte la lista a formato JSON y la guarda en el almacenamiento local bajo la clave proporcionada
        localStorage.setItem(clave, JSON.stringify(lista));
    },
};
