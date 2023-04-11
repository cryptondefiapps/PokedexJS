// Elements Selectors
const pokeCard = document.querySelector('[data-poke-card]');
const pokeName = document.querySelector('[data-poke-name]');
const pokeImg = document.querySelector('[data-poke-img]');
const pokeImgContainer = document.querySelector('[data-poke-img-container]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeTypes = document.querySelector('[data-poke-types]');
const pokeStats = document.querySelector('[data-poke-stats]');
// const pokeInput = document.querySelector('#poke-input')
const pokeInput = document.getElementById('poke-input')


// Stores the current pokemon ID in a variable
let currentPokemonId = 0
let currentPokeSprite = 0
let savedId = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let greenButtonPress = false
let redButtonPress = false
let blueButtonGroupPress = false
const pokeSprite = []

// Input key pressed
const onKeyPressed = (event) => {  

    if (event.keyCode === 13) {
        const value = pokeInput.value
        pokeInput.value = ""
        searchPokemon(value)
    }
}

// Pokeball pressed
const pokeballPressed = () => {
    const value = pokeInput.value
    pokeInput.value = ""
    searchPokemon(value)
}

// Next Pokemon
const nextPokemon = (currentId) => {
    const nextId = currentId + 1
    searchPokemon(nextId)
}

// Handle nextPokemon click
const handleNextPokemon = () => {
    if (currentPokemonId !== null) {
        nextPokemon(currentPokemonId)
    }
    else {
        nextPokemon(0)
    }
}

// Before Pokemon
const beforePokemon = (currentId) => {
    const beforeId = currentId - 1
    searchPokemon(beforeId)
}

// Handle beforePokemon click
const handleBeforePokemon = () => {
    if (currentPokemonId !== null && currentPokemonId > 1) {
        beforePokemon(currentPokemonId)
    }
    else {
        beforePokemon(2)
    }
}

// Handle change pokeSprite front or back
const handlePokeSpriteChange = (spritePos) => {
    if ( pokeSprite[0] === undefined || pokeSprite[1] === undefined ) return
    
    if (spritePos === 0) {
        if (pokeSprite[0] === null) return
        pokeImg.setAttribute('src', pokeSprite[0]);
    }
    else {
        if (pokeSprite[1] === null) return
        pokeImg.setAttribute('src', pokeSprite[1]);
    }
}

// Green Button is Pressed
const greenButtonPressed = () => {
    console.log('greenButtonPressed')
    if (redButtonPress === false && greenButtonPress === false) {
        greenButtonPress = true
        console.log('greenButton is true ' + greenButtonPress)
    }
    else if (redButtonPress === true) {
        redButtonPress = false
        greenButtonPress = true 
        console.log('Green button  is: ' + greenButtonPress + ',' + ' Red button is: ' + redButtonPress)
    }
}

// Red Button is Pressed
const redButtonPressed = () => {
    console.log('redButtonPressed')
    if (redButtonPress === false && greenButtonPress === false) {
        redButtonPress = true
        console.log('redButton is true ' + redButtonPress)
    }
    else if (greenButtonPress === true) {
        greenButtonPress = false
        redButtonPress = true
        console.log('Red button is: ' + redButtonPress + ',' + ' Green button is: ' + greenButtonPress)
    }
}

// Blue Button Group is Pressed
const blueButtonGroupPressed = (position, event) => {
    blueButtonGroupPress = true
    const button = event.target
    if (greenButtonPress === true) {
        handleChangeSavedId(savedId, position, currentPokemonId)
        blueButtonGroupPress = false
        greenButtonPress = false
        if (savedId[position] > 0 && pokeName.textContent !== 'Pokemon not found') {
            console.log(savedId[position])
            button.style.background = 'linear-gradient(top, #f3860b 0%, #e5c005 80%)'
            button.style.background = '-webkit-linear-gradient(top, #f3860b 0%, #e5c005 80%)'
            button.style.background = '-moz-linear-gradient(top, #f3860b 0%, #e5c005 80%)'
            button.style.background = '-o-linear-gradient(top, #f3860b 0%, #e5c005 80%)'
        }
        console.log('new registered id in position: ' + position)

    }
    else if (redButtonPress === true) {
        handleChangeSavedId(savedId, position, 0)
        blueButtonGroupPress = false
        redButtonPress = false
        button.style.background = ''
        
        console.log('id has been removed in position: ' + position)
    }
    else if (greenButtonPress === false && redButtonPress === false) {
        if (savedId[position] === 0) return
        pokemon = savedId[position]
        searchPokemon(pokemon)
        blueButtonGroupPress = false
        console.log('We execute the search for the pokemon registered in position: ' + position)
    }
    return
}


// Handle change saved ID
const handleChangeSavedId = (savedId, position, newId) => {
    console.log(savedId)
    if (position >= 0 && position < savedId.length) {
        savedId[position] = newId
    }
    else {
        console.error ('index out of range')
    }
}

// Fetch API
const searchPokemon = (pokemon) => {
    const pokemonString = typeof pokemon === 'number' ? pokemon.toString() : pokemon

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonString.toLowerCase()}`)
    .then(data => data.json())
    //Send the response to renderPokemonData function
    .then(response => renderPokemonData(response))
    .catch(err => renderNotFound())
}

const renderPokemonData = (data) => {
    console.log(data)
    // Front & Back Sprites
    if (data.sprites.versions['generation-v']['black-white'].animated.front_default === null || data.sprites.versions['generation-v']['black-white'].animated.back_default === null) {
        if (data.sprites.front_default === null) return
        pokeSprite[0] = data.sprites.front_default
        pokeSprite[1] = data.sprites.back_default
    }
    else {
        pokeSprite[0] = data.sprites.versions['generation-v']['black-white'].animated.front_default;
        pokeSprite[1] = data.sprites.versions['generation-v']['black-white'].animated.back_default;
    }

    

    // Take stats and types
    const { stats, types } = data;

    // Fill the elements with the data received
    pokeName.textContent = data.name;
    pokeImg.setAttribute('src', pokeSprite[0]);
    pokeId.textContent = `Nº ${data.id}`;

    // Update Current Pokemon ID
    currentPokemonId = data.id

    renderPokemonTypes(types);
    renderPokemonStats(stats);
}

const renderPokemonTypes = (types) => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.textContent = type.type.name;
        // In case there are two or more types, add a new div for each one
        pokeTypes.appendChild(typeTextElement);
    });
}

const renderPokemonStats = (stats) => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementAmount = document.createElement("div");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });
}

const renderNotFound = () => {
    console.log('errooor')
    pokeName.textContent = 'Pokemon not found';
    pokeImg.setAttribute('src', 'img/poke-shadow.png');
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';    
};
