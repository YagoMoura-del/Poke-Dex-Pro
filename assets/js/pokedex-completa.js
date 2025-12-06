const btnVerdeGrande = document.getElementById("btn-verde-grande");
const loadingTexto = document.getElementById("loading-texto");
const imgPrincipal = document.getElementById("pokemon-imagem-principal");
const detalhesContainer = document.getElementById("detalhes-container");
const detalheTitulo = document.getElementById("detalhe-titulo");
const detalheTipos = document.getElementById("detalhe-tipos");
const detalheAltura = document.getElementById("detalhe-altura");
const detalhePeso = document.getElementById("detalhe-peso");
const detalheHabilidades = document.getElementById("detalhe-habilidades");
const valAtk = document.getElementById("val-atk");
const valDef = document.getElementById("val-def");
const barAtk = document.getElementById("bar-atk"); 
const barDef = document.getElementById("bar-def"); 

const typeColors = {
  normal: "#A8A77A", fire: "#EE8130", psychic: "#F95587", steel: "#B7B7CE",
  water: "#6390F0", electric: "#F7D02C", grass: "#7AC74C", ice: "#96D9D6",
  fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65", flying: "#A98FF3",
  bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
  dark: "#705746", fairy: "#D685AD"
};

let numeroAtual = 1;

carregarPokemon(numeroAtual);

if (btnVerdeGrande) {
    btnVerdeGrande.addEventListener("click", function() {
        numeroAtual = numeroAtual + 1;
        
        if (numeroAtual > 1025) {
            numeroAtual = 1;
        }

        carregarPokemon(numeroAtual);
    });
}

async function carregarPokemon(id) {
    // Mostra que está carregando
    loadingTexto.style.display = "block";
    imgPrincipal.style.display = "none";
    detalhesContainer.style.display = "none";
    detalheTitulo.innerText = "Buscando #" + id + "...";

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dados = await resposta.json();
        desenharNaTela(dados);

    } catch (erro) {
        console.log("Deu erro:", erro);
        detalheTitulo.innerText = "Erro ao carregar";
    }
}

function desenharNaTela(dados) {
    const imagem = dados.sprites.other["official-artwork"].front_default || dados.sprites.front_default;
    imgPrincipal.src = imagem;
    loadingTexto.style.display = "none";
    imgPrincipal.style.display = "block";
    detalhesContainer.style.display = "block";

    const nome = dados.name.toUpperCase();
    const id = dados.id;
    const altura = dados.height / 10;
    const peso = dados.weight / 10;
    
    detalheTitulo.innerText = "#" + id + " - " + nome;
    detalheAltura.innerText = altura;
    detalhePeso.innerText = peso;

    let htmlTipos = "";
    for(let i=0; i < dados.types.length; i++) {
        const nomeTipo = dados.types[i].type.name;
        const cor = typeColors[nomeTipo] || "#777";
        htmlTipos += `<span style="background-color: ${cor}; color: white; padding: 3px 8px; border-radius: 5px; margin-right: 5px; font-size: 0.8em;">${nomeTipo}</span>`;
    }
    detalheTipos.innerHTML = htmlTipos;

    let textoHabilidades = "";
    for(let i=0; i < dados.abilities.length; i++) {
        if (i > 0) textoHabilidades += ", ";
        textoHabilidades += dados.abilities[i].ability.name;
    }
    detalheHabilidades.innerText = textoHabilidades;

    let ataque = 0;
    let defesa = 0;

    for(let i=0; i < dados.stats.length; i++) {
        if(dados.stats[i].stat.name === 'attack') {
            ataque = dados.stats[i].base_stat;
        }
        if(dados.stats[i].stat.name === 'defense') {
            defesa = dados.stats[i].base_stat;
        }
    }
    
    valAtk.innerText = ataque;
    valDef.innerText = defesa;
    if (barAtk) barAtk.style.width = Math.min((ataque / 150) * 100, 100) + "%";
    if (barDef) barDef.style.width = Math.min((defesa / 150) * 100, 100) + "%";
}