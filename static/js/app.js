//VARIABLES
let map = "";
const template = document.querySelector("template");
const aside = document.querySelector("aside");
const modal = document.querySelector("#dialog");
const btnClose = document.querySelector("#dialog button.close");
const modalTitle = document.querySelector("#dialog h3");
const modalCap = document.querySelector("#dialog p.cap");
const modalId = document.querySelector("#dialog p.id");



//EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    initMap();
    fillApp();
});

btnClose.addEventListener("click", () => {
    modal.close();
});



//FUNCIONES
//Función asíncrona que devuelve los datos (data.features) de las paradas
function getDatosParadas() {
    const URL = "./data/info_taxis.json";
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    };

    return fetch(URL, options)
        .then(response => response.json())
        .then(data => Object.entries(data.features));
}


//Función que inicializa el mapa
function initMap() {
    map = L.map('map').setView([36.72016, -4.42034], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}


//Rellena el listado y dibuja los marcadores
async function fillApp() {

    let paradas = await getDatosParadas();
    let lista = document.createElement("ul");

    paradas.forEach((parada) => {
        let clon = template.content.cloneNode(true);
        let nombreParada = parada[1].properties.DESCRIPCION;
        let ubicacionParada = parada[1].properties.DIRECCION;
        console.log(parada)

        clon.querySelector("h4").textContent = nombreParada;
        clon.querySelector("p").textContent = ubicacionParada;
        clon.querySelector("input").value = parada[1].properties.ID;
        clon.querySelector("input.capacidad").value = parada[1].properties.INFOESP[0].Capacidad_vehiculos;
        lista.appendChild(clon);

        let latitud = parada[1].geometry.coordinates[1];
        let longitud = parada[1].geometry.coordinates[0];
        drawMarker(latitud, longitud, nombreParada, ubicacionParada);
    });

    aside.appendChild(lista);
}


//Función que dibuja un marcador según una latitud y longitud pasadas como parámetro
function drawMarker(lat, long, nombre, ubicacion) {
    let marker = L.marker([lat, long]).addTo(map);
    marker.bindPopup('<strong>' + nombre + '</strong><br>' + ubicacion)
}


//Cambia el atributo active de los elementos li
function toggleActive(element) {
    element.classList.toggle("active");
}


//Función que limpia el diálogo modal, lo rellena con la información de la parada y lo abre
function showInfo(element) {
    modalTitle.textContent = "";
    modalCap.textContent = "";
    modalId.textContent = "";

    modalTitle.textContent = element.closest(".parada").querySelector("h4").textContent;
    modalCap.textContent = "Capacidad: " + element.closest(".parada").querySelector("input.capacidad").value;
    modalId.textContent = "Identificador: " + element.previousElementSibling.value;

    modal.showModal();
}
