
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail,pokeUrl) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    console.log(pokeUrl)
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    pokemon.url = pokeUrl

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

function convertPokeToPokemonDetail(poke) {

    const pokemonDetail = new PokemonDetail()
    pokemonDetail.speciespecies = poke.species.name;
    pokemonDetail.weight = poke.weight
    pokemonDetail.height = poke.height
    pokemonDetail.abilites = poke.abilities
    console.log(`jeje ${poke.species.name}`)
    return pokemonDetail
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((det) => convertPokeApiDetailToPokemon(det,pokemon.url))
}

pokeApi.getPokemonInfo = async (pokemonUrl) => {
    return fetch(pokemonUrl)
        .then((response) => response.json())
        .then((pokemon)=>convertPokeToPokemonDetail(pokemon)).then((info)=>info)
}



pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
