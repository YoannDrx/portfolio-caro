export function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function createPortfolioLink(item, locale) {
  const isVideoClip = (item) => ["clips", "synchros"].includes(item.category) && item.externalLink;

  const videoClip = isVideoClip(item);

  if (item.category === "Album de librairie musicale" || item.category === "Vinyle") {
    return {
      href: `/portfolio/${item.slug}`,
      isExternal: false,
      isVideoClip: false,
    };
  }

  return {
    href: item.externalLink,
    isExternal: true,
    isVideoClip: videoClip,
  };
}

export function getSpotifyAlbumId(url) {
  if (!url) return null;

  const parts = url.split("/");
  const albumIndex = parts.indexOf("album");

  if (albumIndex !== -1 && albumIndex < parts.length - 1) {
    return parts[albumIndex + 1];
  }

  return null;
}
