const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li id="${pokemon.number}" class="pokemon ${pokemon.type}" data-pokemon='${JSON.stringify(pokemon)}'>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

pokemonList.addEventListener('click', function (event) {
    const clickedPokemon = event.target.closest('.pokemon');
    if (clickedPokemon) {
        const pokemonData = JSON.parse(clickedPokemon.getAttribute('data-pokemon'));
        console.log(pokemonData);
        const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
        const modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
        const modalBody = document.getElementById('pokemonModalBody');
        let pokemonInfo = pokeApi.getPokemonInfo(pokemonData.url)
        console.log(pokemonInfo.PromiseResult)
        modalBody.innerHTML = `
            <div class="row pokemon ${pokemonData.type}">
            
                <div class="modal-header">
                    <h2 class="modal-title">${pokemonData.name} - #${pokemonData.number}</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <br>
                <div class="poke-img-container">
                    <img height="150" src="${pokemonData.photo}" alt="${pokemonData.name}">
                </div>
                <div class="moredetail">
                    <table>
                        <thead>
                            <tr class="poke-about-headline">
                                <th>About</th>
                                <th>Base Stats</th>
                                <th>Evolution</th>
                                <th>Moves</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- About section -->
                            <tr>
                                <td>Species</td>
                                <td colspan="3">${pokemonInfo.species}</td>
                            </tr>
                            <tr>
                                <td>Height</td>
                                <td colspan="3">${pokemonInfo.height}</td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td colspan="3">${pokemonInfo.weight}</td>
                            </tr>
                            <tr>
                                <td>Abilities</td>
                                <td colspan="3">${pokemonInfo.abilities}</td>
                            </tr>   
                        </tbody>
                    </table>                        
                </div>               
            </div>
        `;

        modal.show();
    }
});






loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})