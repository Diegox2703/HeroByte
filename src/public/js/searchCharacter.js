import { searchCharacters } from './apiRequest.js'

const searchBar = document.getElementById('search-bar')

searchBar.addEventListener('input', () => searchCharacters(searchBar.value))