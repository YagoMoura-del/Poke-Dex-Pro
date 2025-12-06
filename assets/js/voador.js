// Botão Trocar
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
const barAtk = document.getElementById("bar-atk");
const valDef = document.getElementById("val-def");
const barDef = document.getElementById("bar-def");


const typeColors = {
  normal: "#A8A77A", fire: "#EE8130", psychic: "#F95587", steel: "#B7B7CE",
  water: "#6390F0", electric: "#F7D02C", grass: "#7AC74C", ice: "#96D9D6",
  fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65", flying: "#A98FF3",
  bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
  dark: "#705746", fairy: "#D685AD"
};

const meusPokemons = [
  "Noibat", 
  "Noivern", 
  "Pidgey", 
  "Pidgeotto", 
  "Pidgeot", 
  "Spearow", 
  "Altaria", 
  "Rowlet", 
  "Tornadus", 
  "Emolga", 
  "Swanna", 
  "Pelipper"
];

let indiceAtual = 0;

async function carregarPokemonPorTipo(tipo) {
    indiceAtual = 0; 
    await mostrarPokemonAtual();
}

if (btnVerdeGrande) {
    btnVerdeGrande.addEventListener("click", async function() {
        
        indiceAtual++;

        if (indiceAtual >= meusPokemons.length) {
            indiceAtual = 0;
        }

        await mostrarPokemonAtual();
    });
}

async function mostrarPokemonAtual() {
    // 1. Prepara as telas (mostra carregando)
    loadingTexto.style.display = "block";
    imgPrincipal.style.display = "none";
    detalhesContainer.style.display = "none";
    detalheTitulo.innerText = "Buscando dados...";

    const nomeDoPokemon = meusPokemons[indiceAtual];

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeDoPokemon.toLowerCase()}`);
         if (!resposta.ok) throw new Error("Erro na API");
        const dadosCompletos = await resposta.json();
        atualizarTelas(dadosCompletos);

    } catch (erro) {
        console.error("Erro ao buscar", nomeDoPokemon, erro);
        detalheTitulo.innerText = "Erro ao carregar";
    }
}

function atualizarTelas(dados) {
    const imagemGrande = dados.sprites.other["official-artwork"].front_default || dados.sprites.front_default;
    imgPrincipal.src = imagemGrande;
    loadingTexto.style.display = "none";
    imgPrincipal.style.display = "block";
    detalhesContainer.style.display = "block";

    const nome = dados.name.toUpperCase();
    const id = dados.id.toString().padStart(3, "0");
    const altura = dados.height / 10;
    const peso = dados.weight / 10;
    
    detalheTitulo.innerText = `${id} - ${nome}`;

    const tiposHtml = dados.types.map(t => {
      const tColor = typeColors[t.type.name] || "#777";
      return `<span style="background-color: ${tColor}; color: white; padding: 2px 8px; border-radius: 4px; margin-right: 5px; font-size: 0.8em; font-weight: bold;">${t.type.name}</span>`;
    }).join("");
    detalheTipos.innerHTML = tiposHtml;
    detalheAltura.innerText = altura;
    detalhePeso.innerText = peso;
    detalheHabilidades.innerText = dados.abilities.map(a => a.ability.name).join(", ");

    const ataque = dados.stats.find(s => s.stat.name === 'attack').base_stat;
    const defesa = dados.stats.find(s => s.stat.name === 'defense').base_stat;
    
    valAtk.innerText = ataque;
    barAtk.style.width = `${Math.min((ataque / 150) * 100, 100)}%`; 
    
    valDef.innerText = defesa;
    barDef.style.width = `${Math.min((defesa / 150) * 100, 100)}%`;
}