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
  if (item.category === "albums" || item.category === "vinyles") {
    return { href: locale === "fr" ? `/portfolio/${item.slug}` : `/${locale}/portfolio/${item.slug}`, isExternal: false };
  } else {
    return { href: item.externalLink, isExternal: true };
  }
}
