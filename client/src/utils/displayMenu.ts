export default function displayMenu(menu: string) {
  const gameMain = document.querySelector('.game-main');

  if (gameMain) {
    gameMain.classList.toggle('hidden');
  }

  const gameMenu = document.querySelector(menu);

  if (gameMenu) {
    gameMenu.classList.toggle('hidden');
  }
}
