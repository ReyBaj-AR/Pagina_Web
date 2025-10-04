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
    let modoElaboracion = ''; // *Nueva variable para el modo de elaboración*

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
            // *Modo de elaboración para Pan de Molde Clásico*
            modoElaboracion = `
                <h4>Modo de elaboración en amasadora industrial</h4>
                <ol>
                    <li>Disolver la sal, la miel y el azúcar en el agua.</li>
                    <li>Incorporar la harina.</li>
                    <li>Amasar hasta unir todos los ingredientes.</li>
                    <li>Incorporar la levadura "desgranada" y seguir amasando hasta que se desintegre en la masa.</li>
                    <li>Incorporar la manteca blanda y amasar hasta desarrollar el gluten (masa suave y elástica).</li>
                    <li>Quitar de la amasadora y dejar fermentar la masa en un recipiente hasta que duplique su volumen.</li>
                    <li>Desgasificar, formar los panes y colocar en los moldes.</li>
                    <li>Dejar fermentar por segunda vez hasta que los panes sobrepasen el molde.</li>
                    <li>Pincelar con doradura "Huevo, sal y leche".</li>
                    <li>Hornear a 180°C hasta que esté dorado.</li>
                </ol>
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
            // *Modo de elaboración para Pan de Hokkaido*
            modoElaboracion = `
                <h4>Modo de Elaboración en amasadora industrial</h4>
                <ol>
                    <li>*Preparación del Tangzhong:* Cocinar a fuego moderado la harina y el agua del Tangzhong revolviendo constantemente hasta gelificar "Pasta Espesa" (65°C). Cubrir con film en contacto y dejar enfriar.</li>
                    <li>Colocar en el bowl de la amasadora el Tangzhong frío, el resto de la harina,  el azúcar, la sal, la leche y el huevo, amasar hasta unir.</li>
                    <li>Incorporar la levadura "desgranada" y seguir amasando hasta que se desintegre en la masa.</li>
                    <li>Incorporar la manteca blanda y seguir amasando hasta obtener una masa muy elástica y suave.</li>
                    <li>Retirar de la amasadora y dejar fermentar hasta duplicar volumen.</li>
                    <li>Dividir la masa, bollar o armar la forma deseada (generalmente un enrollado de 3 o 5 partes) y colocar en los moldes.</li>
                    <li>Dejar fermentar por segunda vez.</li>
                    <li>Pincelar con doradura "Huevo, sal y leche".</li>
                    <li>Hornear a 180°C (350°F) hasta que esté dorado.</li>
                </ol>
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
            // *Modo de elaboración para Pan de Salvado*
            modoElaboracion = `
                <h4>Modo de Elaboración</h4>
                <ol>
                    <li>En el bowl de la amasadora agregar el agua, el salvado de trigo, la sal y la miel.</li>
                    <li>Incorporar la harina.</li>
                    <li>Amasar hasta unir todos los ingredientes.</li>
                    <li>Incorporar la levadura "desgranada" y seguir amasando hasta que se desintegre en la masa.</li>
                    <li>Incorporar la manteca blanda y amasar hasta desarrollar el gluten (masa suave y elástica).</li>
                    <li>Quitar de la amasadora y dejar fermentar la masa en un recipiente hasta que duplique su volumen.</li>
                    <li>Desgasificar, formar los panes y colocar en los moldes.</li>
                    <li>Dejar fermentar por segunda vez hasta que los panes sobrepasen el molde.</li>
                    <li>Pincelar con doradura "Huevo, sal y leche".</li>
                    <li>Hornear a 180°C hasta que esté dorado.</li>
                </ol>
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
            // *Modo de elaboración para Pan de Calabaza*
            modoElaboracion = `
                <h4>Modo de Elaboración</h4>
                <ol>
                    <li>En el bowl de la amasadora agregar el agua "No toda, reservar un poco, puede no ser necesaria", el pure de calabaza, la sal y la miel.</li>
                    <li>Incorporara la harina.</li>
                    <li>Amasar hasta unir todos los ingredientes, "Chequear la hidratación y agregar mas agua si hiciera falta".</li>
                    <li>Incorporara la levadura "desgranada" y seguir amasando hasta que se desintegre en la masa.</li>
                    <li>Incorporar la manteca blanda y amasar hasta desarrollar el gluten (masa suave y elástica).</li>
                    <li>Quitar de la amasadora y dejar fermentar la masa en un recipiente hasta que duplique su volumen.</li>
                    <li>Desgasificar, formar los panes y colocar en los moldes.</li>
                    <li>Dejar fermentar por segunda vez hasta que los panes sobrepasen el molde.</li>
                    <li>Pincelar con doradura "Huevo, sal y leche".</li>
                    <li>Echar semillas de calabaza por encima.</li>
                    <li>Hornear a 180°C hasta que esté dorado.</li>
                </ol>
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
            // *Modo de elaboración para Pan relleno*
            modoElaboracion = `
                <h4>Modo de Elaboración</h4>
                <ol>
                    <li>Disolver la sal, la miel y el azúcar en el agua.</li>
                    <li>Incorporar la harina.</li>
                    <li>Amasar hasta unir todos los ingredientes.</li>
                    <li>Incorporar la levadura "desgranada" y seguir amasando hasta que se desintegre en la masa.</li>
                    <li>Incorporar la manteca blanda y amasar hasta desarrollar el gluten (masa suave y elástica).</li>
                    <li>Quitar de la amasadora y dejar fermentar la masa en un recipiente hasta que duplique su volumen.</li>
                    <li>Formado para cada pan: estirar la masa en forma de rectángulo, colocar el relleno de la mitad del rectángulo hacia abajo y con la parte de arriba tapar el relleno, Enrollar y colocar en el molde.</li>
                    <li>Dejar fermentar por segunda vez hasta que los panes sobrepasen el molde.</li>
                    <li>Pincelar con doradura "Huevo, sal y leche".</li>
                    <li>Hornear a 180°C hasta que esté dorado.</li>
                </ol>
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
            // *Modo de elaboración para Pan Lactal*
            modoElaboracion = `
                <h4>Modo de Elaboración</h4>
                <ol>
                    <li> En el bowl de la amasadora Disolver la sal, la miel y el azúcar, en el agua y la leche.</li>
                    <li>Incorporara la harina.</li>
                    <li>Amasar hasta unir todos los ingredientes.</li>
                    <li>Incorporara la levadura "desgranada" y seguir amasando hasta que se desintegre en la masa.</li>
                    <li>Incorporar la manteca blanda y amasar hasta desarrollar el gluten (masa suave y elástica).</li>
                    <li>Quitar de la amasadora y dejar fermentar la masa en un recipiente hasta que duplique su volumen.</li>
                    <li>Desgasificar, formar los panes y colocar en los moldes.</li>
                    <li>Dejar fermentar por segunda vez hasta que los panes sobrepasen el molde.</li>
                    <li>Pincelar con doradura "Huevo, sal y leche".</li>
                    <li>Hornear a 180°C hasta que esté dorado.</li>
                </ol>
            `;
            break;

        default:
            resultadosHTML = "<p style='color: orange;'>Por favor, selecciona un tipo de pan para calcular.</p>";
            break;
    }

    // *Unir los resultados con el modo de elaboración*
    document.getElementById('resultados').innerHTML = resultadosHTML + modoElaboracion;
}


// Puedes añadir esta línea para que al cargar la página se realice un cálculo inicial
// window.onload = calcularPan; // Descomenta si quieres que calcule al cargar la página