const axios = require('axios');

// Función para ejecutar la consulta SPARQL y obtener la capital de un país dado su nombre en Wikidata
async function getCountryCapital() {
    const sparqlQuery =
        `SELECT DISTINCT ?countryLabel ?capitalLabel WHERE {
            ?country wdt:P31 wd:Q6256.
            ?country wdt:P36 ?capital.
            ?country wdt:P1082 ?population.
            ?country rdfs:label ?countryLabel.
            ?capital rdfs:label ?capitalLabel.
            FILTER(LANG(?countryLabel) = "es").
            FILTER(LANG(?capitalLabel) = "es").
            FILTER(?population > 30000000).
        }`;
        
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.results.bindings.length > 0) {
            const max = data.results.bindings.length;
            const nums = getRandomNumbers(max,4);
            nums.forEach(x => {
                const pais = data.results.bindings[x].countryLabel.value;
                const capi = data.results.bindings[x].capitalLabel.value;
                console.log(`La capital de ${pais} es: ${capi}`);
            });
        } else {
            return "No se encontró la capital";
        }
    } catch (error) {
        console.error("Error:", error);
        return "Error al obtener la capital";
    }
}

// Obtener la capital de un país especificado
const countryName = "Portugal"; // Aquí puedes cambiar el país deseado
getCountryCapital();

function getRandomNumbers(max,count){
    const res = [];
    while(res.length < count){
        const randomNum = Math.floor(Math.random() * Math.floor(max - 1));
        if(!res.includes(randomNum)){
            res.push(randomNum);
        }
    }
    return res;
}