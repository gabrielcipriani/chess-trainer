import type { Color, PieceType } from './types.ts';

export function showPromotionMenu(turn: Color): Promise<PieceType> {
  const promotionMenu =
    document.querySelector<HTMLDivElement>('.promotion-menu');
  if (!promotionMenu) {
    throw new Error('Checkmate menu element not found');
  }
  promotionMenu.innerHTML = '';
  const bishop = document.createElement('img');
  bishop.src = `/pieces/b${turn}.svg`;
  bishop.dataset.piece = 'b';
  const knight = document.createElement('img');
  knight.src = `/pieces/n${turn}.svg`;
  knight.dataset.piece = 'n';
  const rook = document.createElement('img');
  rook.src = `/pieces/r${turn}.svg`;
  rook.dataset.piece = 'r';
  const queen = document.createElement('img');
  queen.src = `/pieces/q${turn}.svg`;
  queen.dataset.piece = 'q';

  promotionMenu.appendChild(bishop);
  promotionMenu.appendChild(knight);
  promotionMenu.appendChild(rook);
  promotionMenu.appendChild(queen);

  promotionMenu.style.display = 'flex';

  return new Promise((resolve) => {
    promotionMenu.addEventListener(
      'click',
      (event) => {
        const target = event.target as HTMLElement;
        const chosenPiece = target.dataset.piece;
        if (!chosenPiece) {
          return;
        }
        promotionMenu.style.display = 'none';
        resolve(chosenPiece as PieceType);
      },
      { once: true },
    );
  });
}

export function showCheckmateMenu() {
  const checkmateMenu =
    document.querySelector<HTMLDivElement>('.checkmate-menu');
  if (!checkmateMenu) {
    throw new Error('Checkmate menu element not found');
  }
  checkmateMenu.style.display = 'flex';
}

export function showStalemateMenu() {
  const stalemateMenu =
    document.querySelector<HTMLDivElement>('.stalemate-menu');
  if (!stalemateMenu) {
    throw new Error('Stalemate menu element not found');
  }
  stalemateMenu.style.display = 'flex';
}
