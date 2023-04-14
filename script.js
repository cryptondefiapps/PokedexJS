const pokeCard = document.querySelector('[data-poke-card]');
const pokeName = document.querySelector('[data-poke-name]');
const pokeImg = document.querySelector('[data-poke-img]');
const pokeImgContainer = document.querySelector('[data-poke-img-container]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeTypes = document.querySelector('[data-poke-types]');
const pokeStats = document.querySelector('[data-poke-stats]');
const pokeInput = document.getElementById('poke-input')
const toggleSoundIcon = document.getElementById('toggle-sound')
const blueButtons = document.getElementsByClassName('blueButton')

let savedIds = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const pokeSprite = []
const storedToggleSound = localStorage.getItem('savedToggleSound')
const storedIdsString = localStorage.getItem('savedIdsInLocalStorage')

let storeIdsArray = []
let currentPokemonId = 0
let currentPokeSprite = 0
let greenButtonPress = false
let redButtonPress = false
let blueButtonGroupPress = false
let isSoundMuted = false

const savedIdsToLocalStorage = (savedIds) => {
    localStorage.setItem('savedIdsInLocalStorage', JSON.stringify(savedIds))
}

const applySavedIdsState = () => {
    if (storedIdsString !== null) {
        storeIdsArray = JSON.parse(storedIdsString)
        savedIds = storeIdsArray
        console.log(savedIds)
        
        for (i = 0; i < savedIds.length; i ++){
            const slot = document.querySelector(`[data-memory-slot-id="${i}"]`)
            if (savedIds[i] !== 0){
                slot.classList.replace('blueButton', 'orangeButton')
            }
        }
    }

}

const savedToggleSoundToLocalStorage = () => {
    localStorage.setItem('savedToggleSound', isSoundMuted)
}

const applySavedSoundState = () => {
    if (storedToggleSound !== null) {
        isSoundMuted = JSON.parse(storedToggleSound)
    }
    if (isSoundMuted) {
        toggleSoundIcon.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    else {
        toggleSoundIcon.classList.replace("fa-volume-xmark", "fa-volume-high")
    }
}

const onKeyPressed = (event) => {

    if (event.keyCode === 13) {
        const value = pokeInput.value
        pokeInput.value = ""
        searchPokemon(value)
    }
}

const pokeballPressed = () => {
    const value = pokeInput.value
    pokeInput.value = ""
    searchPokemon(value)
}

const nextPokemon = (currentId) => {
    const nextId = currentId + 1
    searchPokemon(nextId)
}

const handleNextPokemon = () => {
    if (currentPokemonId !== null) {
        nextPokemon(currentPokemonId)
    }
    else {
        nextPokemon(0)
    }
}

const beforePokemon = (currentId) => {
    const beforeId = currentId - 1
    searchPokemon(beforeId)
}

const handleBeforePokemon = () => {
    if (currentPokemonId !== null && currentPokemonId > 1) {
        beforePokemon(currentPokemonId)
    }
    else {
        beforePokemon(2)
    }
}

const handlePokeSpriteChange = (spritePos) => {
    if (pokeSprite[0] === undefined || pokeSprite[1] === undefined) return

    if (spritePos === 0) {
        if (pokeSprite[0] === null) return
        pokeImg.setAttribute('src', pokeSprite[0]);
    }
    else {
        if (pokeSprite[1] === null) return
        pokeImg.setAttribute('src', pokeSprite[1]);
    }
}

const greenButtonPressed = () => {
    resetMemorySlotsAnimation()
    if (currentPokemonId === 0) return
    for (i = 0; i < savedIds.length; i++) if (savedIds[i] === 0) (document.querySelector(`[data-memory-slot-id="${i}"]`)).classList.add('jiggle')
    if (redButtonPress === false && greenButtonPress === false) {
        greenButtonPress = true
    }
    else if (redButtonPress === true) {
        redButtonPress = false
        greenButtonPress = true
    }
}

const redButtonPressed = () => {
    resetMemorySlotsAnimation()
    for (i = 0; i < savedIds.length; i++) if (savedIds[i] !== 0) (document.querySelector(`[data-memory-slot-id="${i}"]`)).classList.add('jiggle')
    if (redButtonPress === false && greenButtonPress === false) {
        redButtonPress = true
    }
    else if (greenButtonPress === true) {
        greenButtonPress = false
        redButtonPress = true
    }
}

const memorySlotPressed = (position, event) => {
    blueButtonGroupPress = true
    const button = event.target
    if (greenButtonPress === true) {
        if (currentPokemonId === 0) {
            resetMemorySlotsAnimation()
            greenButtonPress = false
            return
        }
        handleChangeSavedId(position, currentPokemonId)
        blueButtonGroupPress = false
        greenButtonPress = false
        if (savedIds[position] > 0 && pokeName.textContent !== 'Pokemon not found') {
            console.log(savedIds[position])
            button.classList.replace('blueButton', 'orangeButton')
        }
        console.log('new registered id in position: ' + position)
        console.log('Updated saved pokeIds in localStorage')
    }
    else if (redButtonPress === true) {
        handleChangeSavedId(savedIds, position, 0)
        blueButtonGroupPress = false
        redButtonPress = false
        button.classList.replace('orangeButton', 'blueButton')
        console.log('id has been removed in position: ' + position)
    }
    else if (greenButtonPress === false && redButtonPress === false) {
        if (savedIds[position] === 0) return
        pokemon = savedIds[position]
        searchPokemon(pokemon)
        blueButtonGroupPress = false
        console.log('We execute the search for the pokemon registered in position: ' + position)
        console.log('Updated saved pokeIds in localStorage')
    }
    resetMemorySlotsAnimation()
    savedIdsToLocalStorage(savedIds)
    return
}

const resetMemorySlotsAnimation = () => {
    for (i = 0; i < savedIds.length; i++) {
        const slot = document.querySelector(`[data-memory-slot-id="${i}"]`);
        slot.classList.remove('jiggle')
    }
}

const resetMemory = () => {
    resetMemorySlotsAnimation()
    for (i = 0; i < savedIds.length; i++) {
        const slot = document.querySelector(`[data-memory-slot-id="${i}"]`)
        if (savedIds[i] !== 0){
            slot.classList.replace('orangeButton', 'blueButton')
            savedIds[i] = 0
        }
    }
    savedIdsToLocalStorage(savedIds)
}

const handleChangeSavedId = (position, newId) => {
    console.log(savedIds)
    if (position >= 0 && position < savedIds.length) {
        savedIds[position] = newId
    }
    else {
        console.error('index out of range')
    }
}

const toggleSound = () => {
    isSoundMuted === true ? isSoundMuted = false : isSoundMuted = true;
    isSoundMuted === true ? toggleSoundIcon.classList.replace('fa-volume-high', 'fa-volume-xmark') : toggleSoundIcon.classList.replace('fa-volume-xmark' ,'fa-volume-high')
    savedToggleSoundToLocalStorage()
}

const searchPokemon = (pokemon) => {
    const pokemonString = typeof pokemon === 'number' ? pokemon.toString() : pokemon

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonString.toLowerCase()}`)
        .then(data => data.json())
        .then(response => renderPokemonData(response))
        .catch(err => renderNotFound())
}

const renderPokemonData = (data) => {
    console.log(data)
    if (data.sprites.versions['generation-v']['black-white'].animated.front_default === null || data.sprites.versions['generation-v']['black-white'].animated.back_default === null) {
        if (data.sprites.front_default === null) return
        pokeSprite[0] = data.sprites.front_default
        pokeSprite[1] = data.sprites.back_default
    }
    else {
        pokeSprite[0] = data.sprites.versions['generation-v']['black-white'].animated.front_default;
        pokeSprite[1] = data.sprites.versions['generation-v']['black-white'].animated.back_default;
    }

    const { stats, types } = data;

    pokeName.textContent = data.name;
    pokeImg.setAttribute('src', pokeSprite[0]);
    pokeId.textContent = `Nº ${data.id}`;

    currentPokemonId = data.id

    renderPokemonTypes(types);
    renderPokemonStats(stats);

    if (isSoundMuted === false) {
        const audio = new Audio(`cries/${currentPokemonId}.ogg`)
        audio.onerror = function () {
            console.log('Audio not found');
        };
        audio.oncanplaythrough = function () {
            audio.play();
        };
    }
}

const renderPokemonTypes = (types) => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.textContent = type.type.name;
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
    currentPokemonId = 0
    pokeName.textContent = 'Pokemon not found';
    pokeImg.setAttribute('src', 'img/poke-shadow.png');
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';
}

applySavedSoundState()
applySavedIdsState()