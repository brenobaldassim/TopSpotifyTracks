"use strict";

const CLIENT_ID = 'a3bc451e1c864e65af2cefdc67b13430';
const CLIENT_SECRET = 'eec6ccc6fa9246969c868a858d806652';

async function getAuth() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:'grant_type=client_credentials'
    })
    const data = await response.json();
    return data.access_token
};
document.addEventListener('DOMContentLoaded', function() {
    fetchTopTracks();
});

async function fetchTopTracks() {
    const access_token = await getAuth();
    const playlist_id = '37i9dQZEVXbMDoHDwVN2tF';
    if(access_token){
        fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
            headers: {
            'Authorization': 'Bearer ' + access_token
            }
        })
            .then(response => response.json())
            .then(data => {
                const topTracks = data.tracks.items;
                topTracks.forEach(item => {
                    createListItem(item);
                });
            })
            .catch(error => console.error('Erro ao buscar as músicas:', error));
            }
}


function createListItem(item){
    const topTracksList = document.getElementById('top-tracks');
    //getting data
    const trackName = item.track.name;
    const artistName = item.track.artists[0].name;
    const albumCover = item.track.album.images[2].url;
    //creating elements
    const imgCover = document.createElement('img');
    imgCover.src = albumCover;
    const listItem = document.createElement('li');
    const listLink = document.createElement('a');
    // div with image and content
    const divListItem = createDiv();
    divListItem.classList.add("item-content");
    const songNameDiv = createDiv();
    songNameDiv.classList.add('item-description')
    let div = createDiv(trackName);
    songNameDiv.appendChild(div)
    div = createDiv(artistName);
    songNameDiv.appendChild(div);
    divListItem.appendChild(songNameDiv);
    divListItem.insertBefore(imgCover, divListItem.firstChild)
    //
    listLink.appendChild(divListItem);
    listLink.onclick = redirect(item.track.external_urls.spotify);
    listItem.setAttribute("id", item.track.album.external_urls.spotify);
    listItem.appendChild(listLink);
    topTracksList.appendChild(listItem).classList.add("list-item");
// Faça o que quiser com as músicas, como adicioná-las a uma lista na interface da extensão
}

function redirect(link) {
    return () => chrome.tabs.create({ url: link });
}

function createDiv(text) {1
    const div = document.createElement('div');
    if(text) div.textContent = text;
    return div;
}