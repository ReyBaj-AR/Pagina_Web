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
const iconPeña = createCustomIcon('#28a745', 0.8, '#1e7e34');     // Verde
const iconEvento = createCustomIcon('#dc3545', 0.8, '#a71d2a');   // Rojo

/**
 * Obtiene el icono de Leaflet según el tipo de marcador seleccionado.
 * @param {string} type - 'academia', 'pena', o 'evento'.
 * @returns {L.DivIcon}
 */
function getIconByType(type) {
    switch(type) {
        case 'academia':
            return iconAcademia;
        case 'peña':
            return iconPeña;
        case 'evento':
            return iconEvento;
        default:
            // Por defecto, usa el azul si algo falla
            return iconAcademia; 
    }
}

// ----------------------------------------------------------------------
// 4. Manejar el evento de clic en el mapa (Muestra el Popup de Confirmación)
//    (MÁXIMA ROBUSTEZ: Uso de setTimeout y clases)
// ----------------------------------------------------------------------
map.on('click', function(e) {
    
    // 1. Limpiar marcador y popups anteriores
    if (tempMarker) {
        map.removeLayer(tempMarker); 
        tempMarker = null;
    }
    // ¡¡CLAVE!!: Cerrar *cualquier* popup que esté abierto en el mapa.
    map.closePopup(); 
    
    markerForm.style.display = 'none';

    const lat = e.latlng.lat.toFixed(6);
    const lon = e.latlng.lng.toFixed(6);
    const latlng = e.latlng;
    
    // Contenido del Popup de Confirmación.
    // Usamos CLASES para evitar IDs duplicados y simplificar el selector.
    const popupContent = `
        <div class="confirm-popup-content" style="text-align: center;">
            <p style="font-weight: bold; margin-bottom: 5px;">¿Agregar nuevo Marcador aquí?</p>
            <p>
                Lat: ${lat}<br>
                Lon: ${lon}
            </p>
            <button class="btn-confirm-yes-local" 
                    data-lat="${lat}" 
                    data-lon="${lon}"
                    style="background-color: #007bff; color: white; border: none; padding: 5px 10px; margin-right: 10px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: background-color 0.2s;">
                Sí
            </button>
            <button class="btn-confirm-no-local" 
                    style="background-color: white; color: #007bff; border: 1px solid #007bff; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: background-color 0.2s;">
                No
            </button>
        </div>
    `;

    // 2. Crear y añadir el marcador temporal
    tempMarker = L.marker(latlng, { icon: iconAcademia }).addTo(map);

    // 3. Crear el popup y enlazarlo al marcador temporal.
    tempMarker.bindPopup(popupContent, {
        closeButton: false, 
        autoClose: false,
        className: 'argentina-confirm-popup'
    }).openPopup();

    // 4. Manejo de eventos con un setTimeout (último recurso por problemas de sincronización)
    setTimeout(() => {
        // Obtenemos el contenedor DOM del popup. 
        // ¡IMPORTANTE! Solo podemos hacerlo si el marcador tiene un popup abierto.
        const popup = tempMarker.getPopup();
        if (!popup || !popup.isOpen()) return; // Salir si por alguna razón no se abrió

        const popupContainer = popup.getElement();
        
        // Buscamos los botones dentro de ESTE contenedor específico usando la CLASE
        const btnYes = popupContainer.querySelector('.btn-confirm-yes-local');
        const btnNo = popupContainer.querySelector('.btn-confirm-no-local');
        
        // Lógica del botón "Sí"
        if (btnYes) {
            btnYes.onclick = function() {
                // Obtenemos las coordenadas de los atributos data-* del botón (más seguro)
                const currentLat = this.getAttribute('data-lat');
                const currentLon = this.getAttribute('data-lon');
                
                // Rellenar formulario
                coordsDisplay.textContent = `${currentLat}, ${currentLon}`; 
                latInput.value = currentLat;
                lonInput.value = currentLon;
                tipoMarcadorInput.value = ""; 
                
                // Mostrar el formulario
                markerForm.style.display = 'block'; 
                
                // Cerrar el popup asociado al marcador
                map.closePopup(popup);
            };
        }
        
        // Lógica del botón "No"
        if (btnNo) {
            btnNo.onclick = function() {
                // Cerrar el popup y ELIMINAR el marcador temporal asociado.
                map.removeLayer(tempMarker);
                tempMarker = null;
            };
        }
    }, 200); // 200ms es un tiempo seguro para la inyección del DOM en Leaflet
});


// ----------------------------------------------------------------------
// 5. Manejar el envío del formulario (Sin cambios)
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
    
    // Eliminar el marcador temporal si aún existía (por si acaso)
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
    
    alert(`Marcador de tipo "${markerType}" simulado guardado.`);
});