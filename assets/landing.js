const appStoreDialog = document.querySelector('#medu-app-store');

document.querySelectorAll('[data-app-store]').forEach((button) => {
  button.addEventListener('click', () => appStoreDialog.showModal());
});
