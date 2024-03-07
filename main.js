const np_container = document.getElementById('np-container');

// Get parkCode for 60+ national parks from NPS-Unit-List.json in the same folder
// const np_count = 10;
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

const colors = {
    "AL": "#E0B3FF",
    "AK": "#F5F5F5",
    "AZ": "#FDDFDF",
    "AR": "#E6E6E6",
    "CA": "#FFCC66",  // "#FFB3A3",
    "CO": "#FFFFE0",
    "CT": "#FFFDB3",
    "DE": "#FFCCB3",
    "FL": "#B3FFF5",
    "GA": "#D9FFDB",
    "HI": "#85C1E9", // "#B3FFF5",
    "ID": "#FFFAE6",
    "IL": "#FFCCFF",
    "IN": "#FFCCCC",
    "IA": "#FFFDB3",
    "KS": "#B3FFD9",
    "KY": "#FFF5B3",
    "LA": "#E5E5E5",
    "ME": "#E0CCFF",
    "MD": "#D9D9D9",
    "MA": "#B3E5FF",
    "MI": "#E6FFB3",
    "MN": "#B3FFF5",
    "MS": "#B3FFCC",
    "MO": "#FFD9DC",
    "MT": "#B3F5FF",
    "NE": "#CCB3FF",
    "NV": "#FFB3D9",
    "NH": "#B3FFF0",
    "NJ": "#FFD9DC",
    "NM": "white",
    "NY": "#CCB3FF",
    "NC": "#DEFDE0",
    "ND": "#E6E0D4",
    "OH": "#FFEEDD",  // "#FFE5B3",
    "OK": "#D9FFB3",
    "OR": "#B3A9FF",  // "#B3ECFF",
    "PA": "#FFD9B3",
    "RI": "#F5F5F5",
    "SC": "#EAEDA1",
    "SD": "#F8D5A3",
    "TN": "#98D7A5",
    "TX": "#FFFFE0",
    "UT": "#FFB3B3",
    "VT": "#FCEAFF",
    "VA": "#F4E7DA",
    "VI": "#66CCFF", 
    "WA": "#86E3FF",  // "#B3FFFA",
    "WV": "#DEF3FD",
    "WI": "#FCF7DE",
    "WY": "#B3D9FF"
};


const main_type = Object.keys(colors);

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

const createNPCard = (park) => {
    const parkEl = document.createElement('div');
    parkEl.classList.add('park');
    // console.log(`park: ${park}`)

    parkEl.style.cursor = 'pointer';

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

        // Add event listener to park card, link to nps.gov/parkCode/index and open a new tab
        parkEl.addEventListener('click', () => {
            window.open(`${park_url}`, '_blank');
        })
    } else {
        console.error(`Invalid park data`)
    }
    
}


fetchNPs();