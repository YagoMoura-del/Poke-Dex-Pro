const inputSearch = document.getElementById("input-search");
const btnSearch = document.getElementById("btn-search");

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
        numeroAtual++;
        if (numeroAtual > 1025) numeroAtual = 1;
        carregarPokemon(numeroAtual);
    });
}

if (btnSearch) {
    btnSearch.addEventListener("click", function() {
        const texto = inputSearch.value.toLowerCase(); 
        
        if (texto.length > 0) {
            carregarPokemon(texto);
        }
    });
}


async function carregarPokemon(identificador) {
    loadingTexto.style.display = "block";
    imgPrincipal.style.display = "none";
    detalhesContainer.style.display = "none";
    detalheTitulo.innerText = "Buscando...";

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificador}`);
           if (!resposta.ok) throw new Error("Não encontrado");
             const dados = await resposta.json();
              numeroAtual = dados.id;
              inputSearch.value = "";

              desenharNaTela(dados);

    } catch (erro) {
        console.log("Erro:", erro);
        detalheTitulo.innerText = "Pokémon não encontrado!";
        inputSearch.value = "";
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
    
    detalheTitulo.innerText = "#" + id + " - " + nome;
    detalheAltura.innerText = dados.height / 10;
    detalhePeso.innerText = dados.weight / 10;

    let htmlTipos = "";
    for(let i=0; i < dados.types.length; i++) {
        const tipo = dados.types[i].type.name;
        const cor = typeColors[tipo] || "#777";
        htmlTipos += `<span style="background-color: ${cor}; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 5px; font-size: 0.9em;">${tipo}</span>`;
    }
    detalheTipos.innerHTML = htmlTipos;

    let listaHab = [];
    for(let i=0; i < dados.abilities.length; i++) {
        listaHab.push(dados.abilities[i].ability.name);
    }
    detalheHabilidades.innerText = listaHab.join(", ");

    let ataque = 0;
    let defesa = 0;

    for(let i=0; i < dados.stats.length; i++) {
        if(dados.stats[i].stat.name === 'attack') ataque = dados.stats[i].base_stat;
        if(dados.stats[i].stat.name === 'defense') defesa = dados.stats[i].base_stat;
    }
    
    valAtk.innerText = ataque;
    valDef.innerText = defesa;

    if (barAtk) barAtk.style.width = Math.min((ataque / 150) * 100, 100) + "%";
    if (barDef) barDef.style.width = Math.min((defesa / 150) * 100, 100) + "%";
}
