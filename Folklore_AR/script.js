// =================================================================
// 1. INICIALIZACIÓN DEL MAPA
// =================================================================

// 1.1. Configuración de la vista inicial para Argentina
const argentinaCoords = [-34.6037, -64.9673]; // Centro del país
const initialZoom = 4; // Nivel de zoom para ver todo el país

// 1.2. Inicializar el mapa de Leaflet en el elemento con id="mapa"
var mapa = L.map('mapa').setView(argentinaCoords, initialZoom);

// 1.3. Añadir la capa de mosaicos (tiles) de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapa);


// =================================================================
// 3. LÓGICA DEL FORMULARIO Y EVENTOS
// =================================================================

// 3.1. Obtener referencias a los elementos del DOM
const marcadorForm = document.getElementById('marcador-form');
const confirmationPopup = document.getElementById('confirmation-popup');
const formContent = document.getElementById('form-content');
const addMarkerForm = document.getElementById('add-marker-form');
const latitudInput = document.getElementById('latitud');
const longitudInput = document.getElementById('longitud');

// Referencias para mostrar coordenadas
const coordsDisplay = document.getElementById('coords-display');         
const popupCoordsDisplay = document.getElementById('popup-coords-display'); 

const btnConfirmarSi = document.getElementById('confirmar-si');
const btnConfirmarNo = document.getElementById('confirmar-no');
const btnCancelarForm = document.getElementById('cancelar-form'); // Botón Cancelar del formulario

// 3.2. Variable para almacenar el marcador temporal del clic y las coordenadas
let marcadorTemporal = null;
let clickedCoords = null;

// Función para restablecer la vista (oculta el formulario/popup y quita el marcador)
function resetMapClick() {
    marcadorForm.style.display = 'none';
    formContent.style.display = 'none';
    confirmationPopup.style.display = 'block'; 
    
    if (marcadorTemporal) {
        mapa.removeLayer(marcadorTemporal);
        marcadorTemporal = null;
    }
}

// 3.3. Manejar el evento de clic en el mapa para **mostrar la confirmación**
mapa.on('click', function(e) {
    const { lat, lng } = e.latlng;
    
    // Si ya existe un marcador temporal, lo removemos
    if (marcadorTemporal) {
        mapa.removeLayer(marcadorTemporal);
    }
    
    // Almacenamos las coordenadas para usarlas después de la confirmación
    clickedCoords = { lat, lng };

    // Creamos y guardamos el nuevo marcador temporal para indicar la ubicación elegida
    marcadorTemporal = L.marker([lat, lng]).addTo(mapa);
    
    // Actualizar la visualización de coordenadas en el popup de confirmación
    const latFormatted = lat.toFixed(6);
    const lngFormatted = lng.toFixed(6);
    
    if (popupCoordsDisplay) {
        popupCoordsDisplay.textContent = `Lat: ${latFormatted}, Lng: ${lngFormatted}`;
    }

    // Mostramos solo el popup de confirmación
    confirmationPopup.style.display = 'block';
    formContent.style.display = 'none';
    marcadorForm.style.display = 'block';

    // Mover la vista del mapa para centrar el marcador y la ventana emergente si es necesario
    mapa.panTo([lat, lng]);
});

// 3.4. Manejar el clic en el botón **"Sí"**
btnConfirmarSi.addEventListener('click', function() {
    if (clickedCoords) {
        // Rellenar las coordenadas en los campos ocultos y en el display visible del formulario
        latitudInput.value = clickedCoords.lat;
        longitudInput.value = clickedCoords.lng;
        coordsDisplay.textContent = `Lat: ${clickedCoords.lat.toFixed(6)}, Lng: ${clickedCoords.lng.toFixed(6)}`;

        // Ocultar el popup de confirmación y mostrar el formulario
        confirmationPopup.style.display = 'none';
        formContent.style.display = 'block';
    }
});

// 3.5. Manejar el clic en el botón **"No"**
btnConfirmarNo.addEventListener('click', function() {
    resetMapClick(); // Cancela la acción
});


// 3.6. Manejar el envío del formulario (Guardar Academia)
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
        sitioWeb: document.getElementById('sitio-web').value, // <-- ¡NUEVO CAMPO!
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
        
        ${datos.sitioWeb ? `Web: <a href="${datos.sitioWeb.startsWith('http') ? datos.sitioWeb : 'http://' + datos.sitioWeb}" target="_blank">${datos.sitioWeb}</a><br>` : ''}
        
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
    resetMapClick(); 
    addMarkerForm.reset(); 
    
    alert(`Academia "${datos.nombreAcademia}" guardada (simulación y marcada en el mapa).`);
});


// 3.7. Manejar el botón de **Cancelar** del formulario
btnCancelarForm.addEventListener('click', function() {
    resetMapClick(); // Ocultar todo y quitar el marcador temporal
});

// 3.8. Manejar la selección de archivo para mostrar el nombre
const fotoInput = document.getElementById('foto');
const fileNameDisplay = document.getElementById('file-name-display');

// Asegúrate de que este bloque esté en tu script.js para que el nombre del archivo se muestre correctamente
if (fotoInput && fileNameDisplay) {
    fotoInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Ningún archivo seleccionado';
        }
    });
}


// =================================================================
// 4. CORRECCIÓN DE TAMAÑO (Para evitar mapa gris/roto)
// =================================================================

window.addEventListener('load', function() {
    setTimeout(function() {
        mapa.invalidateSize();
    }, 0);
});