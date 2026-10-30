export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const pokemonImage = (pokemon) =>
  pokemon.sprites.other?.['official-artwork']?.front_default ||
  pokemon.sprites.front_default ||
  artworkUrl(pokemon.id);

export function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}
