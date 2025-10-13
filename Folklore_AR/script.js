// 1. Inicializar el Mapa
const map = L.map('mapa').setView([-34.00, -64.00], 5); 

// 2. Añadir la capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ----------------------------------------------------------------------
// Lógica y variables globales
// ----------------------------------------------------------------------

// Referencias a elementos del DOM
const markerForm = document.getElementById('marcador-form');
const coordsDisplay = document.getElementById('coords-display');
const latInput = document.getElementById('latitud');
const lonInput = document.getElementById('longitud');
const tipoMarcadorInput = document.getElementById('tipo_marcador'); // Referencia al selector

let tempMarker = null; // Para guardar el marcador temporal al hacer clic
let confirmationPopup = null; // Para guardar la referencia al popup de confirmación

// ----------------------------------------------------------------------
// 3. Funciones para crear iconos de diferentes colores (Azul, Verde, Rojo)
// ----------------------------------------------------------------------

/**
 * Crea un icono de marcador personalizado con el color y opacidad especificados.
 * @param {string} colorHex - El código de color HEX (#RRGGBB).
 * @param {number} opacity - La opacidad del pin (e.g., 0.8).
 * @param {string} strokeColor - Color del borde del círculo central.
 * @returns {L.DivIcon} El objeto icono de Leaflet.
 */
function createCustomIcon(colorHex, opacity, strokeColor) {
    const svgIcon = `
        <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            <path d="M15 0C6.71573 0 0 6.71573 0 15C0 24.3333 15 42 15 42C15 42 30 24.3333 30 15C30 6.71573 23.2843 0 15 0Z" 
                  fill="${colorHex}" fill-opacity="${opacity}"/> 
            <circle cx="15" cy="15" r="7" fill="white" stroke="${strokeColor}" stroke-width="1.5"/> 
        </svg>
    `;

    return L.divIcon({
        className: 'custom-map-marker',
        html: svgIcon,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });
}

// Iconos específicos usando la función genérica
const iconAcademia = createCustomIcon('#007bff', 0.8, '#0056b3'); // Azul
const iconPena = createCustomIcon('#28a745', 0.8, '#1e7e34');     // Verde
const iconEvento = createCustomIcon('#dc3545', 0.8, '#a71d2a');   // Rojo

/**
 * Obtiene el icono de Leaflet según el tipo de marcador seleccionado.
 * @param {string} type - 'academia', 'pena', o 'evento'.
 * @returns {L.DivIcon}
 */
function getIconByType(type) {
    switch(type) {
        case 'academia':
            return iconAcademia;
        case 'pena':
            return iconPena;
        case 'evento':
            return iconEvento;
        default:
            // Por defecto, usa el azul si algo falla
            return iconAcademia; 
    }
}

// ----------------------------------------------------------------------
// 4. Manejar el evento de clic en el mapa (Muestra el Popup de Confirmación)
// ----------------------------------------------------------------------
map.on('click', function(e) {
    // Limpiar marcadores y popups anteriores
    if (tempMarker) {
        map.removeLayer(tempMarker); 
        tempMarker = null;
    }
    if (confirmationPopup) {
        map.closePopup(confirmationPopup);
        confirmationPopup = null;
    }
    
    markerForm.style.display = 'none';

    const lat = e.latlng.lat.toFixed(6);
    const lon = e.latlng.lng.toFixed(6);
    const latlng = e.latlng;
    
    // Contenido del Popup de Confirmación
    const popupContent = `
        <div class="confirm-popup-content" style="text-align: center;">
            <p style="font-weight: bold; margin-bottom: 5px;">¿Agregar nuevo Marcador aquí?</p>
            <p>
                Lat: ${lat}<br>
                Lon: ${lon}
            </p>
            <button id="btn-confirm-yes" 
                    style="background-color: #007bff; color: white; border: none; padding: 5px 10px; margin-right: 10px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: background-color 0.2s;">
                Sí
            </button>
            <button id="btn-confirm-no" 
                    style="background-color: white; color: #007bff; border: 1px solid #007bff; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: background-color 0.2s;">
                No
            </button>
        </div>
    `;

    // Usamos el icono AZUL por defecto para el marcador temporal
    tempMarker = L.marker(latlng, { icon: iconAcademia }).addTo(map);

    // Mostrar el popup de confirmación
    confirmationPopup = L.popup({
        closeButton: false, 
        autoClose: false,
        className: 'argentina-confirm-popup'
    })
    .setLatLng(latlng)
    .setContent(popupContent)
    .openOn(map);
    
    // Manejar clics de los botones (Solución robusta con setTimeout)
    setTimeout(() => {
        const btnYes = document.getElementById('btn-confirm-yes');
        const btnNo = document.getElementById('btn-confirm-no');
        
        if (btnYes) {
            btnYes.onclick = function() {
                // Rellenar coordenadas Y REINICIAR EL SELECTOR
                // **CORRECCIÓN 1: Usar backticks (`) para template literals**
                coordsDisplay.textContent = `${lat}, ${lon}`; 
                latInput.value = lat;
                lonInput.value = lon;
                tipoMarcadorInput.value = ""; // Asegura que el usuario seleccione el tipo
                
                // Mostrar el formulario centrado
                markerForm.style.display = 'block'; 
                
                // Cerrar el popup de confirmación
                map.closePopup(confirmationPopup);
            };
        }
        
        if (btnNo) {
            btnNo.onclick = function() {
                // Cerrar el popup y eliminar el marcador temporal
                map.closePopup(confirmationPopup);
                if (tempMarker) {
                    map.removeLayer(tempMarker);
                    tempMarker = null;
                }
            };
        }
    }, 50); 
});


// ----------------------------------------------------------------------
// 5. Manejar el envío del formulario (Recolección completa y Popup detallado)
// ----------------------------------------------------------------------
document.getElementById('add-marker-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // 5.1 Validación del tipo de marcador
    const markerType = tipoMarcadorInput.value;

    if (!markerType) {
        alert("Por favor, selecciona el tipo de marcador.");
        return;
    }

    const lat = latInput.value;
    const lon = lonInput.value;
    
    // Recolectar TODOS los campos
    const formData = {
        nombre_sitio: document.getElementById('nombre_sitio').value,
        direccion: document.getElementById('direccion').value,
        localidad: document.getElementById('localidad').value,
        departamento: document.getElementById('departamento').value,
        provincia: document.getElementById('provincia').value,
        referente: document.getElementById('referente').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        sitio_web: document.getElementById('sitio_web').value,
        observaciones: document.getElementById('observaciones').value,
        latitud: lat,
        longitud: lon,
        tipo: markerType,
        expires: null
    };

    // 5.2. Determinar la fecha de expiración para eventos
    if (markerType === 'evento') {
        const date = new Date();
        date.setDate(date.getDate() + 10); // 10 días desde ahora
        formData.expires = date.toISOString();
    }

    console.log("Datos listos para enviar al servidor:", formData);
    
    // 5.3. Construir el contenido HTML detallado para el Popup
    // **CORRECCIÓN 2: Asegurar que los ternarios devuelvan strings con backticks (`)**
    let popupHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 250px;">
            <h4 style="margin: 0 0 5px; color: #007bff;">${formData.nombre_sitio}</h4>
            <p style="margin: 0 0 10px; font-style: italic; font-size: 0.9em;">
                Tipo: <strong>${markerType.charAt(0).toUpperCase() + markerType.slice(1)}</strong>
            </p>
            
            <hr style="margin: 5px 0; border-top: 1px solid #eee;">
            
            <p style="margin: 0;"><strong>Dirección:</strong> ${formData.direccion}, ${formData.localidad}</p>
            <p style="margin: 0;"><strong>Ubicación:</strong> ${formData.departamento}, ${formData.provincia}</p>
            <p style="margin: 5px 0 0;"><strong>Referente:</strong> ${formData.referente}</p>
            
            <hr style="margin: 5px 0; border-top: 1px solid #eee;">

            <p style="margin: 0;"><strong>Teléfono:</strong> ${formData.telefono}</p>
            ${formData.email ? `<p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>` : ''}
            ${formData.sitio_web ? `<p style="margin: 0;"><strong>Web:</strong> <a href="${formData.sitio_web}" target="_blank">Ver sitio</a></p>` : ''}

            <p style="margin-top: 10px; font-size: 0.9em;">
                <strong>Observaciones:</strong><br>${formData.observaciones}
            </p>

            ${formData.expires ? `<p style="margin: 10px 0 0; font-size: 0.8em; color: #dc3545;">
                <span style="font-weight: bold;">¡EVENTO TEMPORAL!</span> Expira el: ${new Date(formData.expires).toLocaleDateString()}
            </p>` : ''}
        </div>
    `;


    // 5.4. AÑADIR EL MARCADOR PERMANENTE AL MAPA (Simulación)
    const finalIcon = getIconByType(markerType);
    
    // Eliminar el marcador temporal
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }

    // Crear el marcador "final"
    L.marker([lat, lon], { icon: finalIcon })
        .addTo(map)
        .bindPopup(popupHTML) // Usamos el HTML detallado
        .openPopup();

    
    // 5.5 Ocultar y limpiar
    markerForm.style.display = 'none';
    document.getElementById('add-marker-form').reset(); 
    
    // **CORRECCIÓN 3: Usar backticks (`) para el alert final**
    alert(`Marcador de tipo "${markerType}" simulado guardado.`);
});


