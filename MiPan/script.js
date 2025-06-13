function calcularPan() {
    // Obtener el tipo de pan seleccionado
    const tipoPan = document.getElementById('tipoPan').value;
    
    // Obtener la cantidad de harina del campo de entrada
    const harina = parseFloat(document.getElementById('cantidadHarina').value);

    // Validar que la harina sea un número válido
    if (isNaN(harina) || harina <= 0) {
        document.getElementById('resultados').innerHTML = "<p style='color: red;'>Por favor, ingresa una cantidad válida de harina.</p>";
        return;
    }

    let resultadosHTML = ''; // Variable para almacenar el HTML de los resultados

    switch (tipoPan) {
        case 'molde':
            // Cálculos para Pan de Molde Clásico
            const aguaMolde = Math.round(harina * 0.6);
            const mantecaMolde = Math.round(harina * 0.08);
            const salMolde = Math.round(harina * 0.02);
            const mielMolde = Math.round(harina * 0.03);
            const azucarMolde = Math.round(harina * 0.02);
            const levaduraMolde = Math.round(harina * 0.01);

            resultadosHTML = `
                <h3>Resultados para Pan de Molde Clásico</h3>
                <p><strong>Harina:</strong> ${harina} Gramos</p>
                <p><strong>Agua:</strong> ${aguaMolde} Gramos</p>
                <p><strong>Manteca:</strong> ${mantecaMolde} Gramos</p>
                <p><strong>Sal:</strong> ${salMolde} Gramos</p>
                <p><strong>Miel:</strong> ${mielMolde} Gramos</p>
                <p><strong>Azucar:</strong> ${azucarMolde} Gramos</p>
                <p><strong>Levadura:</strong> ${levaduraMolde} Gramos</p>
            `;
            break;

        case 'hokkaido':
            // Cálculos para Pan de Hokkaido
            const tangzhongHarina = Math.round(harina * 0.05);
            const tangzhongAgua = Math.round(tangzhongHarina * 5);
            const harinaParaPan = Math.round(harina * 0.95);
            const azucarHokkaido = Math.round(harina * 0.1);
            const salHokkaido = Math.round(harina * 0.02);
            const levaduraFresca = Math.round(harina * 0.015);
            const lecheFluida = Math.round(harina * 0.37);
            const huevo = Math.round(harina * 0.08);
            const mantecaHokkaido = Math.round(harina * 0.08);

            resultadosHTML = `
                <h3>Resultados para Pan de Hokkaido</h3>
                <p><strong>Harina Inicial:</strong> ${harina} Gramos</p>
                <p><strong>Tangzong Harina:</strong> ${tangzhongHarina} Gramos</p>
                <p><strong>Tangzong Agua:</strong> ${tangzhongAgua} Gramos</p>
                <p><strong>Harina para pan:</strong> ${harinaParaPan} Gramos</p>
                <p><strong>Azucar:</strong> ${azucarHokkaido} Gramos</p>
                <p><strong>Sal:</strong> ${salHokkaido} Gramos</p>
                <p><strong>Levadura Fresca:</strong> ${levaduraFresca} Gramos</p>
                <p><strong>Leche Fluida:</strong> ${lecheFluida} Gramos</p>
                <p><strong>Huevo:</strong> ${huevo} Gramos</p>
                <p><strong>Manteca:</strong> ${mantecaHokkaido} Gramos</p>
            `;
            break;

        case 'salvado':
            // Cálculos para Pan de Salvado
            const aguasalvado = Math.round(harina * 0.70);
            const salvadosalvado = Math.round(harina * 0.15);
            const mantecasalvado = Math.round(harina * 0.08);
            const salsalvado = Math.round(harina * 0.02);
            const mielsalvado = Math.round(harina * 0.03);
            const azucarsalvado = Math.round(harina * 0.02);
            const levadurasalvado = Math.round(harina * 0.01);
            

            resultadosHTML = `
                <h3>Resultados para Pan de Salvado</h3>
                <p><strong>Harina:</strong> ${harina} Gramos</p>
                <p><strong>Agua:</strong> ${aguasalvado} Gramos</p>
                <p><strong>Salvado de Trigo:</strong> ${salvadosalvado} Gramos</p>
                <p><strong>Manteca:</strong> ${mantecasalvado} Gramos</p>
                <p><strong>Sal:</strong> ${salsalvado} Gramos</p>
                <p><strong>Miel:</strong> ${mielsalvado} Gramos</p>
                <p><strong>Azucar:</strong> ${azucarsalvado} Gramos</p>
                <p><strong>Levadura:</strong> ${levadurasalvado} Gramos</p>
                
            `;
            break;

        case 'calabaza':
            // Cálculos para Pan de Calabaza
            const aguacalabaza = Math.round(harina * 0.60);
            const mantecacalabaza = Math.round(harina * 0.08);
            const salcalabaza = Math.round(harina * 0.02);
            const mielcalabaza = Math.round(harina * 0.03);
            const azucarcalabaza = Math.round(harina * 0.02);
            const levaduracalabaza = Math.round(harina * 0.01);
            const calabazacalabaza = Math.round(harina * 0.30);

            resultadosHTML = `
                <h3>Resultados para Pan de Calabaza</h3>
                <p><strong>Harina:</strong> ${harina} Gramos</p>
                <p><strong>Agua:</strong> ${aguacalabaza} Gramos</p>
                <p><strong>Manteca:</strong> ${mantecacalabaza} Gramos</p>
                <p><strong>Sal:</strong> ${salcalabaza} Gramos</p>
                <p><strong>Miel:</strong> ${mielcalabaza} Gramos</p>
                <p><strong>Azucar:</strong> ${azucarcalabaza} Gramos</p>
                <p><strong>Levadura:</strong> ${levaduracalabaza} Gramos</p>
                <p><strong>Calabaza horneada y pisada:</strong> ${calabazacalabaza} Gramos</p>
            `;
            break;

        case 'relleno':
            // Cálculos para Pan relleno de Chaddar y Panceta
            const aguarelleno = Math.round(harina * 0.60);
            const mantecarelleno = Math.round(harina * 0.08);
            const salrelleno = Math.round(harina * 0.02);
            const mielrelleno = Math.round(harina * 0.03);
            const azucarrelleno = Math.round(harina * 0.02);
            const levadurarelleno = Math.round(harina * 0.01);
            const cheddarrelleno = Math.round(harina * 0.25);
            const pancetarelleno = Math.round(harina * 0.25);

            resultadosHTML = `
                <h3>Resultados para Pan relleno de Chaddar y Panceta</h3>
                <p><strong>Harina:</strong> ${harina} Gramos</p>
                <p><strong>Agua:</strong> ${aguarelleno} Gramos</p>
                <p><strong>Manteca:</strong> ${mantecarelleno} Gramos</p>
                <p><strong>Sal:</strong> ${salrelleno} Gramos</p>
                <p><strong>Miel:</strong> ${mielrelleno} Gramos</p>
                <p><strong>Azucar:</strong> ${azucarrelleno} Gramos</p>
                <p><strong>Levadura:</strong> ${levadurarelleno} Gramos</p>
                <p><strong>Queso Cheddar:</strong> ${cheddarrelleno} Gramos</p>
                <p><strong>Panceta Ahumada:</strong> ${pancetarelleno} Gramos</p>
                
            `;
            break;

        case 'lactal':
            // Cálculos para Pan Lactal
            const agualactal = Math.round(harina * 0.3);
            const lechelactal = Math.round(harina * 0.3);
            const mantecalactal = Math.round(harina * 0.08);
            const sallactal = Math.round(harina * 0.02);
            const miellactal = Math.round(harina * 0.03);
            const azucarlactal = Math.round(harina * 0.02);
            const levaduralactal = Math.round(harina * 0.01);

            resultadosHTML = `
                <h3>Resultados para Pan Lactal</h3>
                <p><strong>Harina:</strong> ${harina} Gramos</p>
                <p><strong>Agua:</strong> ${agualactal} Gramos</p>
                <p><strong>Leche Fluida:</strong> ${lechelactal} Gramos</p>
                <p><strong>Manteca:</strong> ${mantecalactal} Gramos</p>
                <p><strong>Sal:</strong> ${sallactal} Gramos</p>
                <p><strong>Miel:</strong> ${miellactal} Gramos</p>
                <p><strong>Azucar:</strong> ${azucarlactal} Gramos</p>
                <p><strong>Levadura:</strong> ${levaduralactal} Gramos</p>
            `;
            break;





        default:
            resultadosHTML = "<p style='color: orange;'>Por favor, selecciona un tipo de pan para calcular.</p>";
            break;
    }

    // Mostrar los resultados en la única div de resultados
    document.getElementById('resultados').innerHTML = resultadosHTML;
}

// Puedes añadir esta línea para que al cargar la página se realice un cálculo inicial
// window.onload = calcularPan; // Descomenta si quieres que calcule al cargar la página