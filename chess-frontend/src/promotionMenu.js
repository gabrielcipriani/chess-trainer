function onPromotionChoice() {
  
}

export function showPromotionMenu(turn) {
  const promotionMenu = document.querySelector('.promotion-menu');
  promotionMenu.innerHTML = '';
  const bishop = document.createElement('img');
  bishop.src = `src/assets/b${turn}.svg`;
  bishop.dataset.piece = "b";
  const knight = document.createElement('img');
  knight.src = `src/assets/n${turn}.svg`;
  knight.dataset.piece = "n";
  const rook = document.createElement('img');
  rook.src = `src/assets/r${turn}.svg`;
  rook.dataset.piece = "r";
  const queen = document.createElement('img');
  queen.src = `src/assets/q${turn}.svg`;
  queen.dataset.piece = "q";

  promotionMenu.appendChild(bishop);
  promotionMenu.appendChild(knight);
  promotionMenu.appendChild(rook);
  promotionMenu.appendChild(queen);

  promotionMenu.style.display = 'flex';

  return new Promise((resolve) => {
    promotionMenu.addEventListener('click', (event) => {
      const chosenPiece = event.target.dataset.piece;
      promotionMenu.style.display = 'none';
      resolve(chosenPiece);
    });
  }, { once: true });
}