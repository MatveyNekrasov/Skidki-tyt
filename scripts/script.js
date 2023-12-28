"use strict";

const COUNT_SHOW_CARDS_CLICK = 30;

// Вывод ошибки (пока так, потом надо переделать)
function showErrorMessage(message) {
  alert(message);
}

let salesList = [];
let sales = document.querySelector(".card-list");
sales.innerHTML = "";
let main = document.getElementById("main");

window.addEventListener("popstate", (event) => {
  main.innerHTML = event.state.content;

  console.log();

  if (event.state.content.indexOf("card-list") !== -1) {
    main.classList.remove("main__product-card");
    main.classList.add("main");
  }
  if (event.state.content.indexOf("product-card") !== -1) {
    main.classList.remove("main");
    main.classList.add("main__product-card");
  }

  createSlider(document.querySelectorAll(".card"));
  onErrorImageLoading(
    document.querySelectorAll(
      ".card__image, .card__shop-image, .product-card__image, .product-card__shop-image"
    )
  );
});

getSales().then(() => {
  createSlider(document.querySelectorAll(".card"));
  onErrorImageLoading(
    document.querySelectorAll(".card__image, .card__shop-image")
  );

  window.history.replaceState({ content: main.innerHTML }, "", "");
});

async function getSales() {
  try {
    if (!salesList.length) {
      const res = await fetch("./salesList.json");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      salesList = await res.json();
    }

    renderStartPage(salesList);
  } catch (err) {
    showErrorMessage("Ошибка сервера!");
    console.log(err);
  }
}

function renderStartPage(data) {
  if (!data || !data.length) {
    showErrorMessage("Нет скидок!");
    return;
  }

  const arrSales = data.slice(0, COUNT_SHOW_CARDS_CLICK);
  createSalesCatalog(arrSales);
}

function createSalesCatalog(data) {
  data.forEach((saleEl, index) => {
    const {
      id,
      image,
      title,
      desc,
      salePrice,
      price,
      sale,
      shopImg,
      shopName,
    } = saleEl;
    let salesHtmlCatalog = `
    <li class="card-list__item">
      <article class="card" data-id="${id}" data-index="${index}">
        <div class="card__image-wrapper">
  `;

    if (image.length == 0) {
      salesHtmlCatalog += `
        <img
          src="../images/no-image.jpg"
          alt="Карточка товара"
          class="card__image"
          loading="lazy"
        />
      `;
    } else if (image.length == 1) {
      salesHtmlCatalog += `
        <img
          src="${image[0]}"
          alt="Карточка товара"
          class="card__image"
          loading="lazy"
        />
      `;
    } else {
      salesHtmlCatalog += `
        <img
          src="${image[0]}"
          alt="Карточка товара"
          class="card__image"
          loading="lazy"
        />
        <div class="card__image-slider-wrapper">
          <div class="card__image-slider is-active"></div>
      `;
      for (let i = 1; i < image.length; i++) {
        salesHtmlCatalog += `<div class="card__image-slider"></div>`;
      }
      salesHtmlCatalog += `</div>`;
    }

    salesHtmlCatalog += `
      </div>
      <h2 class="card__title">
        ${title}
      </h2>
      <p class="card__text">
        ${desc}
      </p>
      <div class="card__prices">
        <p class="card__sale-price">${salePrice}</p>
        <p class="card__price">${price}</p>
        <p class="card__sale">${sale}</p>
      </div>
      <div class="card__shop-info">
        <img
          src="${shopImg}"
          alt="Иконка магазина"
          class="card__shop-image"
          loading="lazy"
        />
        <p class="card__shop-name">${shopName}</p>
      </div>
      <button type="button" class="card__product-btn">
        Перейти к товару
      </button>
      </article>
      </li>
    `;

    sales.insertAdjacentHTML("beforeend", salesHtmlCatalog);
  });
}

function createSlider(data) {
  if (data) {
    data.forEach((el) => {
      let currentSale = el;
      const sliderDots = currentSale.querySelectorAll(".card__image-slider");

      sliderDots.forEach((dot, index) => {
        dot.setAttribute("data-index", index);
        dot.addEventListener("click", (e) => {
          sliderDots.forEach((el) => {
            el.classList.remove("is-active");
          });
          currentSale
            .querySelector(
              `.card__image-slider[data-index="${e.currentTarget.dataset.index}"]`
            )
            .classList.add("is-active");
          currentSale
            .querySelector(".card__image")
            .setAttribute(
              "src",
              salesList[currentSale.dataset.index].image[
                e.currentTarget.dataset.index
              ]
            );
        });
      });
    });
  }
}

function onErrorImageLoading(data) {
  data.forEach((image) => {
    image.addEventListener("error", (e) => {
      e.currentTarget.setAttribute("src", "./images/no-image.jpg");
    });
  });
}

function renderProductCard(clickedSale) {
  if (!clickedSale) {
    showErrorMessage("Нет такой скидки!!");
    return;
  }

  main.innerHTML = "";

  const {
    id,
    image,
    title,
    desc,
    features,
    salePrice,
    price,
    sale,
    shopImg,
    shopName,
  } = clickedSale;

  let cardHtml = "";

  cardHtml += `<div class="product-card__layout">
                <article class="product-card" data-id="${id}">
                  <div class="product-card__image-wrapper">
                    <img
                      src="${image[0]}"
                      alt="Картинка товара"
                      class="product-card__image"
                    />
                    <div class="product-card__image-slider-wrapper">
                      <div class="product-card__image-slider is-active"></div>
                      <div class="product-card__image-slider"></div>
                      <div class="product-card__image-slider"></div>
                    </div>
                  </div>
                  <div class="product-card__info">
                    <h2 class="product-card__title">
                      ${title}
                    </h2>
                    <p class="product-card_description">
                      ${desc}
                    </p>
                  </div>
                  <h3 class="product-card__features-title">Особенности товара</h3>
                  <p class="product-card__features-text">
                    ${features}
                  </p>
                  <button type="button" class="product-card__favorite">
                    <img
                      src="./svg/bookmark.svg"
                      alt="Поместить в закладки"
                      class="product-card__favorite-image"
                    />
                  </button>
                </article>
              </div>
              <aside class="product-card__aside-info">
                <div class="product-card__product-info">
                  <div class="product-card__prices">
                    <p class="product-card__sale-price">${salePrice}</p>
                    <p class="product-card__sale">${sale}</p>
                    <p class="product-card__price">${price}</p>
                  </div>
                  <button class="product-card__product-btn">Перейти к товару</button>
                </div>
                <div class="product-card__shop-info">
                  <img
                    src="${shopImg}"
                    alt="Иконка магазина"
                    class="product-card__shop-image"
                  />
                  <button class="product-card__shop-btn" type="button">
                    Все товары магазина
                  </button>
                </div>
              </aside>
              <section class="similar-products">
                <h2 class="similar-products__title">Похожие товары</h2>
                <ul class="similar-products-list">
                  <li class="similar-products-item">
                    <article class="similar-products__card">
                      <img
                        src="./images/similar.png"
                        alt="Изображение похожего товара"
                        class="similar-products__image"
                      />
                      <div class="similar-products__prices">
                        <p class="similar-products__sale-price">20 000 ₽</p>
                        <p class="similar-products__price">30 000 ₽</p>
                        <p class="similar-products__sale">90%</p>
                      </div>
                      <p class="similar-products__text">
                        Супер маска брокколи для хорошего сна
                      </p>
                    </article>
                  </li>
                  <li class="similar-products-item">
                    <article class="similar-products__card">
                      <img
                        src="./images/similar.png"
                        alt="Изображение похожего товара"
                        class="similar-products__image"
                      />
                      <div class="similar-products__prices">
                        <p class="similar-products__sale-price">20 000 ₽</p>
                        <p class="similar-products__price">30 000 ₽</p>
                        <p class="similar-products__sale">90%</p>
                      </div>
                      <p class="similar-products__text">
                        Супер маска брокколи для хорошего сна
                      </p>
                    </article>
                  </li>
                  <li class="similar-products-item">
                    <article class="similar-products__card">
                      <img
                        src="./images/similar.png"
                        alt="Изображение похожего товара"
                        class="similar-products__image"
                      />
                      <div class="similar-products__prices">
                        <p class="similar-products__sale-price">20 000 ₽</p>
                        <p class="similar-products__price">30 000 ₽</p>
                        <p class="similar-products__sale">90%</p>
                      </div>
                      <p class="similar-products__text">
                        Супер маска брокколи для хорошего сна
                      </p>
                    </article>
                  </li>
                  <li class="similar-products-item">
                    <article class="similar-products__card">
                      <img
                        src="./images/similar.png"
                        alt="Изображение похожего товара"
                        class="similar-products__image"
                      />
                      <div class="similar-products__prices">
                        <p class="similar-products__sale-price">20 000 ₽</p>
                        <p class="similar-products__price">30 000 ₽</p>
                        <p class="similar-products__sale">90%</p>
                      </div>
                      <p class="similar-products__text">
                        Супер маска брокколи для хорошего сна
                      </p>
                    </article>
                  </li>
                  <li class="similar-products-item">
                    <article class="similar-products__card">
                      <img
                        src="./images/similar.png"
                        alt="Изображение похожего товара"
                        class="similar-products__image"
                      />
                      <div class="similar-products__prices">
                        <p class="similar-products__sale-price">20 000 ₽</p>
                        <p class="similar-products__price">30 000 ₽</p>
                        <p class="similar-products__sale">90%</p>
                      </div>
                      <p class="similar-products__text">
                        Супер маска брокколи для хорошего сна
                      </p>
                    </article>
                  </li>
                </ul>
              </section>`;

  main.innerHTML = cardHtml;
  main.classList.remove("main");
  main.classList.add("main__product-card");

  window.history.pushState(
    { content: main.innerHTML },
    "",
    /* `/card?id=${clickedSale.id}` */
    ""
  );
}

document.body.onclick = (event) => {
  document.body
    .querySelectorAll("details[open")
    .forEach((e) => (e.open = false));

  if (event.target.classList.contains("card__product-btn")) {
    const card = event.target.closest(".card");
    const clickedSale = salesList.find((sale) => {
      return sale.id === Number(card.dataset.id);
    });
    renderProductCard(clickedSale);
    onErrorImageLoading(
      document.querySelectorAll(
        ".product-card__image, .product-card__shop-image"
      )
    );
  }

  /* const productCardButtons = document.querySelectorAll(".card__product-btn");
  productCardButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      const clickedSale = salesList.find((sale) => {
        return sale.id === Number(card.dataset.id);
      });
      renderProductCard(clickedSale);
      onErrorImageLoading(
        document.querySelectorAll(
          ".product-card__image, .product-card__shop-image"
        )
      );
    });
  }); */
};
