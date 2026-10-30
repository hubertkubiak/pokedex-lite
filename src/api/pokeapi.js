import { API_URL, MAX_ID } from '../constants.js';
import { formatName, idFromUrl } from '../lib/format.js';

// Simple in-memory cache: each URL is fetched once per session.
const cache = new Map();

export function getJSON(url) {
  if (cache.has(url)) return cache.get(url);
  const request = fetch(url).then((res) => {
    if (!res.ok) {
      const error = new Error(res.status === 404 ? 'notfound' : 'http');
      error.status = res.status;
      throw error;
    }
    return res.json();
  });
  cache.set(url, request);
  request.catch(() => cache.delete(url)); // allow retrying after a failure
  return request;
}

export const getPokemon = (id) => getJSON(`${API_URL}/pokemon/${id}`);

export const getSpecies = (id) => getJSON(`${API_URL}/pokemon-species/${id}`);

export const getEvolutionChain = (url) => getJSON(url).then((data) => data.chain);

/** A Pokémon together with its species data (flavor text, evolutions, generation…). */
export const getPokemonWithSpecies = (id) =>
  getPokemon(id).then((pokemon) =>
    getSpecies(idFromUrl(pokemon.species.url)).then((species) => ({ pokemon, species }))
  );

/** All names, used for search suggestions. */
export const getNames = () =>
  getJSON(`${API_URL}/pokemon?limit=${MAX_ID}`).then((data) =>
    data.results.map((r) => ({ id: idFromUrl(r.url), name: r.name, label: formatName(r.name) }))
  );
