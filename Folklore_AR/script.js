<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto Folklore_AR</title>

    <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet/dist/leaflet.css" 
    />

    <style>
    body {
        /* Configuración para el centrado */
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        display: flex; /* Habilitar Flexbox en el body */
        justify-content: center; /* Centrar contenido horizontalmente */
        align-items: center; /* Centrar contenido verticalmente (si es necesario) */
        min-height: 100vh; /* Asegura que el body ocupe toda la altura de la ventana */
        background-color: #f0f0f0; /* Color de fondo para que se vea el margen */
    }

    #mapa {
        /* Nuevo tamaño y centrado */
        height: 70vh; /* Ocupa el 70% de la altura de la ventana */
        width: 90%; /* Ajusta el ancho para dejar un margen lateral */
        max-width: 1200px; /* Opcional: limita el ancho máximo en pantallas muy grandes */
        border: 2px solid #333; /* Opcional: borde para destacar el área del mapa */
        border-radius: 8px; /* Opcional: esquinas redondeadas */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para darle profundidad */
    }
    
    /* El formulario de marcador se mantiene por encima del mapa */
    .marcador-form {
        position: absolute;
        top: 50px; /* Ajustamos la posición */
        right: 50px;
        z-index: 1000;
        background: rgba(9, 176, 226, 0.534);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        max-width: 400px;
        display: none; 
    }
    .marcador-form input, .marcador-form textarea, .marcador-form button {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }
</style>
</head>
<body>

    <div id="mapa"></div>

    <div class="marcador-form" id="marcador-form">
        <h3>Añadir Nueva Academia de Danza</h3>
        <p>Coordenadas: <span id="coords-display"></span></p>

        <form id="add-marker-form">
            <input type="text" id="titulo" placeholder="Nombre de la Academia" required>
            <textarea id="descripcion" placeholder="Descripción de actividades" rows="3" required></textarea>
            
            <label for="foto">Subir Foto:</label>
            <input type="file" id="foto" accept="image/*" required>
            
            <input type="hidden" id="latitud">
            <input type="hidden" id="longitud">
            
            <button type="submit">Guardar Academia</button>
            <button type="button" onclick="document.getElementById('marcador-form').style.display = 'none';">Cancelar</button>
        </form>
    </div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

    <script src="script.js"></script>
</body>
</html>