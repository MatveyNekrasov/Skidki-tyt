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
      const res = await fetch("https://dev.скидки-тут.рф/api/items", {
        mode: "cors",
      });

      /* const res = await fetch("./api/items/salesList.json", {
        mode: "cors",
      }); */

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
      shortName,
      description,
      salePrice,
      price,
      priceOffPercent,
      shopImg,
      shopName,
      url,
    } = saleEl;

    let salesHtmlCatalog;

    if (window.innerWidth <= 580) {
      salesHtmlCatalog = `
        <li class="card-list__item">
          <article class="card" data-id="${id}" data-index="${index}">
            <div class="card__image-wrapper">
              <img
                src="${image}"
                alt="Карточка товара"
                class="card__image"
                loading="lazy"
              />
            </div>
            <h2 class="card__title">
              ${shortName}
            </h2>
            <a href="${url}" class="card__product-btn" target="_blank">К товару</a>
            <div class="card__shop-info">
              <p class="card__shop-name">${shopName}</p>
              <img
                src="${shopImg}"
                alt="Иконка магазина"
                class="card__shop-image"
                loading="lazy"
              />              
            </div>       
            <div class="card__prices">
              <p class="card__sale-price">${price} ₽</p>
              <p class="card__price">${salePrice} ₽</p>
              <p class="card__sale">${priceOffPercent}%</p>
            </div>               
          </article>
        </li>
      `;
    } else {
      salesHtmlCatalog = `
        <li class="card-list__item">
          <article class="card" data-id="${id}" data-index="${index}">
            <div class="card__image-wrapper">
            
      `;

      /* if (image.length == 0) {
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
    } */

      salesHtmlCatalog += `
        <img
          src="${image}"
          alt="Карточка товара"
          class="card__image"
          loading="lazy"
        />
        </div>
        <h2 class="card__title">
          ${shortName}
        </h2>
        <div class="card__text minimize">
          ${description}
        </div>
        <div class="card__prices">
          <p class="card__sale-price">${price} ₽</p>
          <p class="card__price">${salePrice} ₽</p>
          <p class="card__sale">${priceOffPercent}%</p>
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
        <a href="${url}" class="card__product-btn" target="_blank">Перейти к товару</a>
        </article>
        </li>
      `;
    }

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

async function getProductCard(saleId) {
  try {
    const res = await fetch(`https://dev.скидки-тут.рф/api/item/${saleId}`, {
      mode: "cors",
    });

    /* const res = await fetch(`./api/item/${saleId}.json`, {
      mode: "cors",
    }); */

    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const sale = await res.json();

    renderProductCard(sale);
  } catch (err) {
    showErrorMessage("Ошибка сервера!");
    console.log(err);
  }
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
    shortName,
    description,
    salePrice,
    price,
    priceOffPercent,
    shopImg,
    shopName,
    url,
  } = clickedSale;

  let cardHtml = "";

  if (window.innerWidth <= 1100) {
    cardHtml += `<div class="product-card__layout">
                <article class="product-card" data-id="${id}">
                  <div class="product-card__image-wrapper">
                    <img
                      src="${image}"
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
                      ${shortName}
                    </h2>
                    <div class="product-card_description">
                      ${description}
                    </div>
                  </div>
                  <div class="product-card__product-info">
                  <div class="product-card__prices">
                    <p class="product-card__sale-price">${price} ₽</p>
                    <p class="product-card__sale">${priceOffPercent}%</p>
                    <p class="product-card__price">${salePrice} ₽</p>
                  </div>
                  <a href="${url}" class="product-card__product-btn" target="_blank">Перейти к товару</a>
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
                  <h3 class="product-card__features-title">Особенности товара</h3>
                  <p class="product-card__features-text">
                  features
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
  } else {
    cardHtml += `<div class="product-card__layout">
                <article class="product-card" data-id="${id}">
                  <div class="product-card__image-wrapper">
                    <img
                      src="${image}"
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
                      ${shortName}
                    </h2>
                    <div class="product-card_description">
                      ${description}
                    </div>
                  </div>
                  <h3 class="product-card__features-title">Особенности товара</h3>
                  <p class="product-card__features-text">
                  features
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
                    <p class="product-card__sale-price">${price} ₽</p>
                    <p class="product-card__sale">${priceOffPercent}%</p>
                    <p class="product-card__price">${salePrice} ₽</p>
                  </div>
                  <a href="${url}" class="product-card__product-btn" target="_blank">Перейти к товару</a>
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
  }

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
    .querySelectorAll("details[open]")
    .forEach((e) => (e.open = false));

  if (event.target.closest(".card__text")) {
    event.target.closest(".card__text").classList.toggle("minimize");
  }

  if (
    event.target.closest(".card") &&
    !event.target.closest(".card__text") &&
    !event.target.closest(".card__shop-image") &&
    !event.target.closest(".card__product-btn")
  ) {
    const card = event.target.closest(".card");
    getProductCard(card.dataset.id).then(() => {
      onErrorImageLoading(
        document.querySelectorAll(
          ".product-card__image, .product-card__shop-image"
        )
      );
    });

    /* const clickedSale = salesList.find((sale) => {
      return sale.id === Number(card.dataset.id);
    }); */
  }

  /* if (event.target.classList.contains("card__product-btn")) {
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
  } */

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
