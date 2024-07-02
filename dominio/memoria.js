const memoria = {
    // Función para leer datos desde el almacenamiento local (localStorage)
    leer: function(clave) {
        // Obtiene los datos almacenados bajo la clave proporcionada
        const datos = localStorage.getItem(clave);
        
        // Si hay datos almacenados, los parsea desde JSON y los devuelve
        if (datos) {
            return JSON.parse(datos);
        } else {
            // Si no hay datos almacenados para esa clave, inicializa la clave con un arreglo vacío y lo devuelve
            this.escribir(clave, []);
            return [];
        }
    },

    // Función para escribir datos en el almacenamiento local (localStorage)
    escribir: function(clave, lista) {
        // Convierte la lista a formato JSON y la guarda en el almacenamiento local bajo la clave proporcionada
        localStorage.setItem(clave, JSON.stringify(lista));
    },
};
