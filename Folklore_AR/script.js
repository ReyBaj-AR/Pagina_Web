// =================================================================
// 1. INICIALIZACIÓN DEL MAPA
// =================================================================

// 1.1. Configuración de la vista inicial para Argentina
const argentinaCoords = [-34.6037, -64.9673]; // Centro del país
const initialZoom = 5; // Nivel de zoom para ver todo el país

// 1.2. Inicializar el mapa de Leaflet en el elemento con id="mapa"
var mapa = L.map('mapa').setView(argentinaCoords, initialZoom);

// 1.3. Añadir la capa de mosaicos (tiles) de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapa);


// =================================================================
// 2. CAMPO DE BÚSQUEDA DE DIRECCIONES (GEOCODER)
// ESTA SECCIÓN HA SIDO ELIMINADA POR COMPLETO.
// =================================================================


// =================================================================
// 3. LÓGICA DEL FORMULARIO Y EVENTOS
// =================================================================

// 3.1. Obtener referencias a los elementos del DOM
const marcadorForm = document.getElementById('marcador-form');
const addMarkerForm = document.getElementById('add-marker-form');
const latitudInput = document.getElementById('latitud');
const longitudInput = document.getElementById('longitud');
const coordsDisplay = document.getElementById('coords-display');

// 3.2. Variable para almacenar el marcador temporal del clic
let marcadorTemporal = null;

// 3.3. Manejar el evento de clic en el mapa para abrir el formulario
mapa.on('click', function(e) {
    const { lat, lng } = e.latlng;
    
    // Si ya existe un marcador temporal, lo removemos
    if (marcadorTemporal) {
        mapa.removeLayer(marcadorTemporal);
    }
    
    // Creamos y guardamos el nuevo marcador temporal para indicar la ubicación elegida
    marcadorTemporal = L.marker([lat, lng]).addTo(mapa);

    // Rellenar las coordenadas en los campos ocultos y en el display visible
    latitudInput.value = lat;
    longitudInput.value = lng;
    coordsDisplay.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

    // Mostrar el formulario
    marcadorForm.style.display = 'block';
});


// 3.4. Manejar el envío del formulario (Guardar Academia)
addMarkerForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    // 1. Recoger todos los valores del formulario
    const datos = {
        nombreAcademia: document.getElementById('nombre-academia').value,
        direccion: document.getElementById('direccion').value,
        localidad: document.getElementById('localidad').value,
        departamento: document.getElementById('departamento').value,
        provincia: document.getElementById('provincia').value,
        nombreProfesor: document.getElementById('nombre-profesor').value,
        telefono: document.getElementById('telefono').value,
        mail: document.getElementById('mail').value,
        observaciones: document.getElementById('observaciones').value,
        
        // Coordenadas y archivo
        latitud: parseFloat(latitudInput.value), 
        longitud: parseFloat(longitudInput.value),
        fotoFile: document.getElementById('foto').files[0] 
    };

    console.log("Datos a guardar:", datos);
    
    // 2. Crear un marcador PERMANENTE en el mapa con la información
    L.marker([datos.latitud, datos.longitud], { 
        title: datos.nombreAcademia 
    })
     .addTo(mapa)
     .bindPopup(`
        <div style="color: #0288D1;">
            <b>${datos.nombreAcademia}</b>
        </div>
        <hr style="border-top: 1px solid #4FC3F7;">
        Profesor/a: <b>${datos.nombreProfesor}</b><br>
        Teléfono: ${datos.telefono}<br>
        Mail: <a href="mailto:${datos.mail}">${datos.mail}</a><br>
        <br>
        <u>Ubicación:</u><br>
        Dirección: ${datos.direccion}<br>
        Localidad: ${datos.localidad} (${datos.departamento})<br>
        Provincia: ${datos.provincia}<br>
        ${datos.observaciones ? `<hr><i>Obs: ${datos.observaciones}</i>` : ''}
        ${datos.fotoFile ? `<p style="margin-top:5px; font-size: 0.8em;">(Foto: ${datos.fotoFile.name})</p>` : ''}
    `)
     .openPopup();
      
    // 3. Ocultar el formulario y limpiarlo
    marcadorForm.style.display = 'none';
    addMarkerForm.reset(); 
    
    // 4. Quitar el marcador temporal
    if (marcadorTemporal) {
        mapa.removeLayer(marcadorTemporal);
        marcadorTemporal = null;
    }
    
    alert(`Academia "${datos.nombreAcademia}" guardada (simulación y marcada en el mapa).`);
});


// 3.5. Manejar el botón de Cancelar (Quitar el marcador temporal)
document.querySelector('.marcador-form button[onclick]').addEventListener('click', function() {
    // Quitar el marcador temporal si el usuario cancela
    if (marcadorTemporal) {
        mapa.removeLayer(marcadorTemporal);
        marcadorTemporal = null;
    }
});


// =================================================================
// 4. CORRECCIÓN DE TAMAÑO (Para evitar mapa gris/roto)
// =================================================================

window.addEventListener('load', function() {
    setTimeout(function() {
        mapa.invalidateSize();
    }, 0);
});