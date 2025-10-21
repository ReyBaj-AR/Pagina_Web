// ----------------------------------------------------------------------
// CONFIGURACIÓN INICIAL DEL MAPA Y VARIABLES GLOBALES
// ----------------------------------------------------------------------
let map;
// 1. Inicializar el Mapa
// eslint-disable-next-line no-undef
if (document.getElementById('mapa')) {
    // eslint-disable-next-line no-undef
    map = L.map('mapa').setView([-34.00, -64.00], 5);

    // 2. Añadir la capa de OpenStreetMap
    // eslint-disable-next-line no-undef
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// URL Base de la API Georef
const URL_GEOREF = 'https://apis.datos.gob.ar/georef/api/';

// Referencias a elementos del DOM
const markerForm = document.getElementById('marcador-form');
const coordsDisplay = document.getElementById('coords-display');
const latInput = document.getElementById('latitud');
const lonInput = document.getElementById('longitud');
const tipoMarcadorInput = document.getElementById('tipo_marcador');
const selectProvincia = document.getElementById('provincia');
const selectLocalidad = document.getElementById('localidad');

let tempMarker = null; // Marcador temporal al hacer clic

// ----------------------------------------------------------------------
// >>>>> LÓGICA DE INTEGRACIÓN DE GEOREF (MEJORADA) <<<<<
// ----------------------------------------------------------------------

/**
 * Carga la lista de provincias de Argentina y llena el select.
 */
async function cargarProvincias() {
    if (!selectProvincia) return;

    try {
        const response = await fetch(`${URL_GEOREF}provincias?campos=id,nombre&max=100`);
        const data = await response.json();
        
        selectProvincia.innerHTML = '<option data-nombre="" value="">Selecciona una provincia</option>';

        const provincias = (data.provincias || []).sort((a, b) => a.nombre.localeCompare(b.nombre));

        provincias.forEach(provincia => {
            const option = document.createElement('option');
            option.value = provincia.id;
            option.setAttribute('data-nombre', provincia.nombre);
            option.textContent = provincia.nombre;
            selectProvincia.appendChild(option);
        });

        if (selectLocalidad) selectLocalidad.disabled = true;

    } catch (error) {
        console.error("Error al cargar las provincias desde Georef:", error);
        selectProvincia.innerHTML = '<option value="">Error al cargar provincias</option>';
        if (selectLocalidad) selectLocalidad.disabled = true; 
    }
}

/**
 * Carga las entidades geográficas usando nombre o id de la provincia.
 * Intentos: localidades-censales -> localidades -> municipios
 * @param {string} provinciaId
 * @param {string} provinciaNombre
 */
async function cargarLocalidadesYDepartamento(provinciaId, provinciaNombre) {
    if (!selectLocalidad || !provinciaId) {
        selectLocalidad.innerHTML = '<option value="">Selecciona una provincia primero</option>';
        selectLocalidad.disabled = true;
        return;
    }
    
    selectLocalidad.innerHTML = '<option value="">Cargando datos geográficos...</option>';
    selectLocalidad.disabled = true;
    
    const localidadesMap = new Map();

    // Helper para llamar a un endpoint y devolver la lista (por key)
    async function fetchData(endpoint, key) {
        const filtroProvincia = encodeURIComponent(provinciaNombre || provinciaId);
        const url = `${URL_GEOREF}${endpoint}?provincia=${filtroProvincia}&max=5000`;
        
        console.log(`[GEOREF DEBUG] Consultando ${endpoint} con provincia=${filtroProvincia}`);
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`[GEOREF DEBUG] Error HTTP ${response.status} en ${endpoint}`);
                const errorText = await response.text();
                console.error(`[GEOREF DEBUG] Respuesta de Error: ${errorText}`);
                return [];
            }

            const data = await response.json();
            const result = data[key] || [];
            console.log(`[GEOREF DEBUG] ${endpoint} resultados: ${result.length}`);
            return result;
        } catch (error) {
            console.warn(`[GEOREF DEBUG] Fallo de red/JSON en ${endpoint}:`, error && error.message ? error.message : error);
            return [];
        }
    }

    try {
        // 1) Intento con localidades-censales (nuevo y detallado en algunos casos)
        let entidades = await fetchData('localidades-censales', 'localidades-censales');

        // 2) Si 0 resultados, intentar /localidades (más general)
        if (entidades.length === 0) {
            entidades = await fetchData('localidades', 'localidades');
        }

        // 3) Si sigue 0, intentar /municipios (fallback)
        if (entidades.length === 0) {
            entidades = await fetchData('municipios', 'municipios');
        }

        selectLocalidad.innerHTML = '<option value="">Selecciona una Localidad/Municipio</option>';
        
        if (entidades.length > 0) {
            entidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
            
            entidades.forEach(entidad => {
                // Si la entidad tiene 'municipio' con nombre, usamos ese nombre como departamento,
                // si no, usamos algún campo disponible (departamento.nombre o entidad.nombre)
                const departamentoNombre = (entidad.municipio && typeof entidad.municipio === 'object' && entidad.municipio.nombre)
                                            ? entidad.municipio.nombre
                                            : ((entidad.departamento && entidad.departamento.nombre) ? entidad.departamento.nombre : entidad.nombre);
                                             
                if (!localidadesMap.has(entidad.nombre)) {
                    localidadesMap.set(entidad.nombre, departamentoNombre);
                    
                    const option = document.createElement('option');
                    option.value = entidad.nombre;
                    option.setAttribute('data-departamento', departamentoNombre); 
                    option.textContent = entidad.nombre;
                    selectLocalidad.appendChild(option);
                }
            });
        }
        
        if (localidadesMap.size === 0) { 
             selectLocalidad.innerHTML = '<option value="">No se encontraron entidades geográficas para esta provincia</option>';
        }
        
        selectLocalidad.disabled = false;

    } catch (error) {
        console.error("Error crítico al procesar datos geográficos:", error);
        selectLocalidad.innerHTML = '<option value="">¡ERROR CRÍTICO al cargar entidades!</option>';
        selectLocalidad.disabled = true;
    }
}

// ----------------------------------------------------------------------
// GESTIÓN DE EVENTOS DE GEOREF Y CIERRE DE MENÚ
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const collapseMenu = document.getElementById('navbarNavDropdown');
    
    if (collapseMenu) {
        const navLinks = collapseMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (collapseMenu.classList.contains('show')) {
                    setTimeout(() => {
                        // eslint-disable-next-line no-undef
                        const bsCollapse = bootstrap.Collapse.getInstance(collapseMenu) || new bootstrap.Collapse(collapseMenu, { toggle: false });
                        bsCollapse.hide();
                    }, 150); 
                }
            });
        });
    }

    // INICIAR CARGA DE PROVINCIAS
    cargarProvincias();

    // EVENTO: ACTUALIZAR LOCALIDADES al cambiar PROVINCIA
    if (selectProvincia) {
        selectProvincia.addEventListener('change', (event) => {
            const provinciaId = event.target.value;
            const provinciaNombre = event.target.options[event.target.selectedIndex].getAttribute('data-nombre');
            cargarLocalidadesYDepartamento(provinciaId, provinciaNombre);
        });
    }
});

// ----------------------------------------------------------------------
// FUNCIONES DE ICONOS (SIN CAMBIOS FUNCIONALES)
// ----------------------------------------------------------------------
function createCustomIcon(colorHex, opacity, strokeColor) {
    const svgIcon = `
        <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C6.71573 0 0 6.71573 0 15C0 24.3333 15 42 15 42C15 42 30 24.3333 30 15C30 6.71573 23.2843 0 15 0Z" 
                 fill="${colorHex}" fill-opacity="${opacity}"/> 
            <circle cx="15" cy="15" r="7" fill="white" stroke="${strokeColor}" stroke-width="1.5"/> 
        </svg>
    `;

    // eslint-disable-next-line no-undef
    return L.divIcon({
        className: 'custom-map-marker',
        html: svgIcon,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });
}

const iconAcademia = createCustomIcon('#007bff', 0.8, '#0056b3');
const iconPeña = createCustomIcon('#28a745', 0.8, '#1e7e34'); 	
const iconEvento = createCustomIcon('#dc3545', 0.8, '#a71d2a'); 	

function getIconByType(type) {
    switch(type) {
        case 'academia':
            return iconAcademia;
        case 'peña':
            return iconPeña;
        case 'evento':
            return iconEvento;
        default:
            return iconAcademia; 
    }
}

// ----------------------------------------------------------------------
// EVENTO CLICK EN MAPA (SIN CAMBIOS ESTRUCTURALES)
// ----------------------------------------------------------------------
// Solo añadir el evento de click si estamos en la página de "Agregar Sitio" (donde existe el formulario)
if (map && markerForm) {
    map.on('click', function(e) {
        
        if (tempMarker) {
            map.removeLayer(tempMarker); 
            tempMarker = null;
        }
        // eslint-disable-next-line no-undef
        map.closePopup(); 
        
        markerForm.style.display = 'none';

        const lat = e.latlng.lat.toFixed(6);
        const lon = e.latlng.lng.toFixed(6);
        const latlng = e.latlng;
        
        const popupContent = `
            <div class="confirm-popup-content" style="text-align: center;">
                <p style="font-weight: bold; margin-bottom: 5px;">¿Agregar nuevo Marcador aquí?</p>
                <p>Lat: ${lat}<br>Lon: ${lon}</p>
                <button class="btn-confirm-yes-local" 
                        data-lat="${lat}" 
                        data-lon="${lon}"
                        style="background-color: #007bff; color: white; border: none; padding: 5px 10px; margin-right: 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">
                    Sí
                </button>
                <button class="btn-confirm-no-local" 
                        style="background-color: white; color: #007bff; border: 1px solid #007bff; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">
                    No
                </button>
            </div>
        `;

        // eslint-disable-next-line no-undef
        tempMarker = L.marker(latlng, { icon: iconAcademia }).addTo(map);
        tempMarker.bindPopup(popupContent, { closeButton: false, autoClose: false }).openPopup();

        setTimeout(() => {
            const popup = tempMarker.getPopup();
            if (!popup || !popup.isOpen()) return;
            const popupContainer = popup.getElement();
            
            const btnYes = popupContainer.querySelector('.btn-confirm-yes-local');
            const btnNo = popupContainer.querySelector('.btn-confirm-no-local');
            
            if (btnYes) {
                btnYes.onclick = function() {
                    const currentLat = this.getAttribute('data-lat');
                    const currentLon = this.getAttribute('data-lon');
                    
                    coordsDisplay.textContent = `${currentLat}, ${currentLon}`; 
                    latInput.value = currentLat;
                    lonInput.value = currentLon;
                    tipoMarcadorInput.value = '';
                    
                    selectProvincia.value = '';
                    selectLocalidad.innerHTML = '<option value="">Selecciona una provincia primero</option>';
                    selectLocalidad.disabled = true;
                    
                    markerForm.style.display = 'block';
                    map.closePopup(); 
                };
            }
            
            if (btnNo) {
                btnNo.onclick = function() {
                    if (tempMarker) {
                        map.removeLayer(tempMarker); 
                        tempMarker = null;
                    }
                    map.closePopup(); 
                };
            }
        }, 10); 
    });
}

// ----------------------------------------------------------------------
// ENVÍO DEL FORMULARIO
// ----------------------------------------------------------------------
const addMarkerForm = document.getElementById('add-marker-form');
if (addMarkerForm) {
    addMarkerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const tipo = document.getElementById('tipo_marcador').value;
        const nombre = document.getElementById('nombre_sitio').value;
        const direccion = document.getElementById('direccion').value;
        const referente = document.getElementById('referente').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const sitioWeb = document.getElementById('sitio_web').value;
        const observaciones = document.getElementById('observaciones').value;
        const latitud = parseFloat(document.getElementById('latitud').value);
        const longitud = parseFloat(document.getElementById('longitud').value);
        
        const provinciaSelect = document.getElementById('provincia');
        const localidadSelect = document.getElementById('localidad');
        
        const provinciaNombre = provinciaSelect.options[provinciaSelect.selectedIndex].getAttribute('data-nombre') || 'N/A';
        const localidadNombre = localidadSelect.value || 'N/A';
        const departamentoPartido = localidadSelect.options[localidadSelect.selectedIndex].getAttribute('data-departamento') || 'N/A';

        const popupHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 250px; line-height: 1.5;">
                <h5 style="margin-top: 0; color: #003366;">${nombre}</h5>
                <p><strong>Tipo:</strong> ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</p>
                <p><strong>Provincia:</strong> ${provinciaNombre}</p>
                <p><strong>Localidad:</strong> ${localidadNombre}</p>
                <p><strong>Dirección:</strong> ${direccion}</p>
                <p><strong>Referente:</strong> ${referente}</p>
                <p><strong>Teléfono:</strong> <a href="tel:${telefono}" style="color: #007bff;">${telefono}</a></p>
                ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>` : ''}
                ${sitioWeb ? `<p><strong>Web:</strong> <a href="${sitioWeb}" target="_blank" style="color: #007bff;">Ver Sitio</a></p>` : ''}
                <p><strong>Info Adicional:</strong></p>
                <p style="font-size: 0.9em; white-space: pre-wrap;">${observaciones}</p>
            </div>
        `;

        if (tempMarker) {
            map.removeLayer(tempMarker);
            tempMarker = null;
        }

        // eslint-disable-next-line no-undef
        const newMarker = L.marker([latitud, longitud], { 
            icon: getIconByType(tipo) 
        }).addTo(map)
          .bindPopup(popupHtml); 

        newMarker.openPopup();

        markerForm.style.display = 'none';
        this.reset();

        console.log("Marcador guardado y añadido al mapa.");
        alert(`¡Marcador de ${nombre} guardado y añadido al mapa!`);

        const datosDelMarcador = {
            tipo,
            nombre,
            direccion,
            provincia: provinciaNombre,
            localidad: localidadNombre,
            departamento: departamentoPartido, 
            referente,
            telefono,
            email,
            sitioWeb,
            observaciones,
            latitud,
            longitud
        };

        console.log("Datos listos para enviar al backend:", datosDelMarcador);
    });
}
