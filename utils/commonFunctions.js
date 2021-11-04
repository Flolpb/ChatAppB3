// Fonction de génération d'un nombre aléatoire compris en min et max
export let random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Fonction de génération d'une couleur aléatoire
export let getRandomColor = () => {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

// Fonction de calcul de distance entre deux points x et y
export let getDistance = (xA, yA, xB, yB) => {
  let xDiff = xA - xB;
  let yDiff = yA - yB;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

// Fonction qui définit si un point est compris dans un cercle
export let checkInCircle = (xPoint, yPoint, xCircle, yCircle, radius) => {
  return (xPoint <= xCircle + radius)
    && (xPoint >= xCircle - radius)
    && (yPoint >= yCircle - radius)
    && (yPoint <= yCircle + radius)
}
