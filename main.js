import { states } from './states.js';
import { colors } from './colors.js';

const np_container = document.getElementById('np-container');

// Get parkCode for 60+ national parks from NPS-Unit-List.json in the same folder
// const np_code = ['acad', 'dena', 'yell']
const np_codes = []
async function getAllParkCode () {
    try {
        const response = await fetch('NPS-Unit-List.json');
        const data = await response.json();
        console.log(data)

        // Find national parks as "Type":"NP"
        data.forEach((unit) => {
            if (unit.Type === "NP") {
                np_codes.push(unit["Park Code"])
            }
        })

        // console.log(np_codes) 
        // TODO: got 59 NPs as the result, will look up the rest/updated ones later

    } catch (error) {
        console.error(error)
    }
}

// getAllParkCode();
// console.log(np_codes)


// Populate the state filter dropdown
const stateFilter = document.getElementById('state-filter');

states.forEach((state) => {
    const option = document.createElement('option');
    option.value = state.code;
    option.textContent = state.name;
    stateFilter.appendChild(option);
})

const main_type = Object.keys(colors);

const favs = [];

const fetchNPs = async () => {
    await getAllParkCode();
    console.log(np_codes)
    np_codes.forEach((parkCode) => {
        // console.log(parkCode);
        getNP(parkCode);
    })
}


// Make API request
async function getNP (parkCode) {
    const url = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}`;
    const options = {
        method: 'GET',
        headers: {
            'X-Api-Key': 'umpGwi4hscmLlusLAwDh1QCX9x4cBsEqqcfNGeQi',
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result.data[0])
        // console.log(result.data[0].addresses[0].stateCode)
        // console.log(result.data[0].images[0].url)
        // console.log(result.data[0]['fullName']);
        createNPCard(result);

    } catch (error) {
        console.error(error)
    }
}

const createNPCard = async (park) => {
    const parkEl = document.createElement('div');
    parkEl.classList.add('park');
    // console.log(`park: ${park}`)

    // if (park) {
    if (park && park.data && park.data[0] && park.data[0].addresses && park.data[0].addresses[0] && park.data[0].addresses[0].stateCode && park.data[0].images && park.data[0].images[0]) {
        const park_stateCode = park.data[0].addresses[0].stateCode;
        const color = colors[park_stateCode]
        parkEl.style.backgroundColor = color;
    
        const image_url = park.data[0].images[0].url;
        const name = park.data[0]['name'];
        const state = park.data[0].states;
        const park_url = park.data[0].url;

        const parkInnerHtml = 
        `
        <div class='image-container'>
            <img src="${image_url}">
        </div>

        <div class='info'>
            <h3 class='name'>${name}</h3>
            <small class='state'><span>${state}</span></small>
        </div>
        `

        parkEl.innerHTML = parkInnerHtml;
        np_container.appendChild(parkEl);

        // Add event listener for marking as favorite
        const img = parkEl.querySelector('img')
        img.addEventListener('click', function(event) {
            console.log('favorite', name);
            img.style.cursor = 'pointer';
            favs.push(name)
            console.log(favs)
            event.stopPropagation();
        })

        // Add event listener to park card, link to nps.gov/parkCode/index and open a new tab
        const name_link = parkEl.querySelector('.name')
        name_link.addEventListener('click', function(event) {
            window.open(`${park_url}`, '_blank');
            event.preventDefault();
        })
    } else {
        console.error(`Invalid park data`)
    }
    
}


// Add event listener for state filter
stateFilter.addEventListener('change', () => {
    const selectedState = stateFilter.value;
    filterParkByState(selectedState);
})

// Filter parks by state
async function filterParkByState(selectedState) {
    const parks = document.querySelectorAll('.park');

    parks.forEach(parkEl => {
        // console.log(parkEl)
        const state = parkEl.querySelector('.state').textContent.trim();
        // console.log(state)
        const stateList = state.split(',');
        console.log(stateList)

        if (selectedState === 'all' || stateList.includes(selectedState)) {
            parkEl.style.display = 'block';
        } else {
            parkEl.style.display = 'none';
        }
    })
}


// get favorite national parks
const getFavoritesBtn = document.getElementById('favorite');
getFavoritesBtn.addEventListener('click', getFavorites);

async function getFavorites() {
    const parks = document.querySelectorAll('.park')

    parks.forEach((parkEl) => {
        const name = parkEl.querySelector('.name').textContent.trim();

        if (favs.includes(name)) {
            parkEl.style.display = 'block';
        } else {
            parkEl.style.display = 'none';
        }
    })
}

fetchNPs();