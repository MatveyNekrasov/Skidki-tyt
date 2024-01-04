const searchForm = document.querySelector(".header__search-form");
let searchedSales = [];

searchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const sales = document.querySelector(".card-list");
  sales.innerHTML = "";
  const searchInput = searchForm.querySelector(".header__search-field");

  getSearchedSales(searchInput.value).then(() => {
    renderStartPage(searchedSales);
    window.history.pushState(
      { content: main.innerHTML },
      "",
      /* `/card?id=${clickedSale.id}` */
      ""
    );
  });
});

async function getSearchedSales(searchText) {
  try {
    const res = await fetch(
      `https://dev.скидки-тут.рф/api/search?s=${searchText}`,
      {
        mode: "cors",
      }
    );

    /* const res = await fetch(`./api/search/${searchText}.json`, {
      mode: "cors",
    }); */

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    searchedSales = await res.json();
  } catch (err) {
    showErrorMessage("Ошибка сервера!");
    console.log(err);
  }
}
