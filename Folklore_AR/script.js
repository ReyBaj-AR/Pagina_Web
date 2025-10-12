// =================================================================
// 0. ESTADO GLOBAL (Simplificado)
// =================================================================
// No necesitamos variables de estado ni lógica de login.

// =================================================================
// 1. INICIALIZACIÓN DEL MAPA
// =================================================================

// 1.1. Configuración de la vista inicial para Argentina
const argentinaCoords = [-34.6037, -64.9673];
const initialZoom = 4;

// 1.2. Inicializar el mapa de Leaflet
var mapa = L.map('mapa').setView(argentinaCoords, initialZoom);

// 1.3. Añadir la capa de mosaicos
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapa);


// =================================================================
// 2. LÓGICA DEL FORMULARIO FLOTANTE (Añadir Marcador)
// =================================================================

const marcadorForm = document.getElementById('marcador-form');
const confirmationPopup = document.getElementById('confirmation-popup');
const formContent = document.getElementById('form-content');
const addMarkerForm = document.getElementById('add-marker-form');
const latitudInput = document.getElementById('latitud');
const longitudInput = document.getElementById('longitud');

const coordsDisplay = document.getElementById('coords-display');         
const popupCoordsDisplay = document.getElementById('popup-coords-display'); 

const btnConfirmarSi = document.getElementById('confirmar-si');
const btnConfirmarNo = document.getElementById('confirmar-no');
const btnCancelarForm = document.getElementById('cancelar-form');

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

// 2.1. Manejar el evento de clic en el mapa (CUALQUIER CLIC ACTIVA LA CARGA)
mapa.on('click', function(e) {
    
    // Quitar el marcador temporal anterior si existe
    if (marcadorTemporal) {
        mapa.removeLayer(marcadorTemporal);
    }
    
    const { lat, lng } = e.latlng;
    clickedCoords = { lat, lng };

    // Añadir el nuevo marcador temporal
    marcadorTemporal = L.marker([lat, lng]).addTo(mapa);
    
    const latFormatted = lat.toFixed(6);
    const lngFormatted = lng.toFixed(6);
    
    // Mostrar coordenadas en el popup de confirmación
    if (popupCoordsDisplay) {
        popupCoordsDisplay.textContent = `Lat: ${latFormatted}, Lng: ${lngFormatted}`;
    }

    // Mostrar el formulario flotante (Ventana Emergente)
    confirmationPopup.style.display = 'block';
    formContent.style.display = 'none'; // Asegurarse de que el formulario de datos esté oculto
    marcadorForm.style.display = 'block';

    // Centrar el mapa en el punto para mejor visibilidad del formulario
    mapa.panTo([lat, lng]);
});

// 2.2. Manejar el clic en el botón **"Sí"**
btnConfirmarSi.addEventListener('click', function() {
    if (clickedCoords) {
        latitudInput.value = clickedCoords.lat;
        longitudInput.value = clickedCoords.lng;
        coordsDisplay.textContent = `Lat: ${clickedCoords.lat.toFixed(6)}, Lng: ${clickedCoords.lng.toFixed(6)}`;

        // Mostrar el formulario de datos
        confirmationPopup.style.display = 'none';
        formContent.style.display = 'block';
    }
});

// 2.3. Manejar el clic en el botón **"No"**
btnConfirmarNo.addEventListener('click', function() {
    resetMapClick(); 
});


// 2.4. Manejar el envío del formulario (Guardar Academia)
addMarkerForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    // 1. Recoger todos los valores
    const datos = {
        nombreAcademia: document.getElementById('nombre-academia').value,
        direccion: document.getElementById('direccion').value,
        localidad: document.getElementById('localidad').value,
        departamento: document.getElementById('departamento').value,
        provincia: document.getElementById('provincia').value,
        nombreProfesor: document.getElementById('nombre-profesor').value,
        telefono: document.getElementById('telefono').value,
        mail: document.getElementById('mail').value,
        sitioWeb: document.getElementById('sitio-web').value, 
        observaciones: document.getElementById('observaciones').value,
        
        latitud: parseFloat(latitudInput.value), 
        longitud: parseFloat(longitudInput.value),
        fotoFile: document.getElementById('foto').files[0] 
    };

    console.log("Datos a guardar:", datos);
    
    // 2. Crear un marcador PERMANENTE
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


// 2.5. Manejar el botón de **Cancelar** del formulario
btnCancelarForm.addEventListener('click', function() {
    resetMapClick();
});

// 2.6. Manejar la selección de archivo para mostrar el nombre
const fotoInput = document.getElementById('foto');
const fileNameDisplay = document.getElementById('file-name-display');

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
// 3. CORRECCIÓN DE TAMAÑO (Leaflet)
// =================================================================

window.addEventListener('load', function() {
    // Forzar redibujo del mapa
    setTimeout(function() {
        mapa.invalidateSize();
    }, 0);
});