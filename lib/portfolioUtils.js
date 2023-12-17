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
  const isVideoClip = item.category === "clips" && item.externalLink;

  if (item.category === "albums" || item.category === "vinyles") {
    return {
      href: `/portfolio/${item.slug}`,
      isExternal: false,
      isVideoClip: false,
    };
  } else if (isVideoClip) {
    return {
      href: item.externalLink,
      isExternal: true,
      isVideoClip: true,
    };
  } else {
    return {
      href: item.externalLink,
      isExternal: true,
      isVideoClip: false,
    };
  }
}
