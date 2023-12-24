const salesList = [
  {
    image: ["../images/test.png", "../images/shop.png", "../images/shop.png"],
    title: "CLARINS Комплексная омолаживающая двойная сыворотка Double Serum",
    desc: "Lörem ipsum sulig mokyr i ryggplankning. Social distansering fotokrati. Linade sor jag gysertad. Laning spertad, plang, och analiga.  Hypodatt vir prehet multirat. Dong sejönat bibel. Suprabel dipav i löjöl saligisk. Cli-fi vivarade sosa trafficking. Sena jöst. Past tidaling kontrartad, lalövis kon. Konar fomo. Lak avis feskap valpromenera jöktig. Digyligen megament hill. Sotesk difasont. Sverka paravis, den epitopi povide. Jölask geotår minidator",
    salePrice: "20 000 ₽",
    price: "30000 ₽",
    sale: "90%",
    shopImg: "../images/shop.png",
    shopName: "Лэтуаль",
  },
  {
    image: ["../images/test.png", "../images/shop.png"],
    title: "CLARINS Комплексная омолаживающая двойная сыворотка Double Serum",
    desc: "Lörem ipsum sulig mokyr i ryggplankning. Social distansering fotokrati. Linade sor jag gysertad. Laning spertad, plang, och analiga.  Hypodatt vir prehet multirat. Dong sejönat bibel. Suprabel dipav i löjöl saligisk. Cli-fi vivarade sosa trafficking. Sena jöst. Past tidaling kontrartad, lalövis kon. Konar fomo. Lak avis feskap valpromenera jöktig. Digyligen megament hill. Sotesk difasont. Sverka paravis, den epitopi povide. Jölask geotår minidator",
    salePrice: "2000 ₽",
    price: "3000 ₽",
    sale: "90%",
    shopImg: "../images/shop.png",
    shopName: "Лэтуаль",
  },
  {
    image: ["dsggs"],
    title: "CLARINS Комплексная омолаживающая двойная сыворотка Double Serum",
    desc: "Тесты тесты тесты",
    salePrice: 25500,
    price: 412400,
    sale: "90%",
    shopImg: "sdgsd",
    shopName: "Лэтуаль",
  },
];

function createHtmlSalesCatalog(salesList) {
  let htmlCatalog = "";
  salesList.forEach(
    (
      { image, title, desc, salePrice, price, sale, shopImg, shopName },
      index
    ) => {
      htmlCatalog += `
        <li class="card-list__item">
          <article class="card" data-index="${index}">
            <div class="card__image-wrapper">`;

      if (image.length == 0) {
        htmlCatalog += `
          <img
            src="../images/no-image.jpg"
            alt="Карточка товара"
            class="card__image"
          />
        `;
      } else if (image.length == 1) {
        htmlCatalog += `
          <img
            src="${image[0]}"
            alt="Карточка товара"
            class="card__image"
          />
        `;
      } else {
        htmlCatalog += `
          <img
            src="${image[0]}"
            alt="Карточка товара"
            class="card__image"
          />
          <div class="card__image-slider-wrapper">
            <div class="card__image-slider is-active"></div>
        `;
        for (let i = 1; i < image.length; i++) {
          htmlCatalog += `<div class="card__image-slider"></div>`;
        }
        htmlCatalog += `</div>`;
      }

      htmlCatalog += `
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
          />
          <p class="card__shop-name">${shopName}</p>
        </div>
        <button type="button" class="card__favorite">
          <img src="./svg/bookmark.svg" alt="Поместить в закладки" />
        </button>
        </article>
        </li>
      `;
    }
  );
  return htmlCatalog;
}

let htmlSalesCatalog = createHtmlSalesCatalog(salesList);
let salesCatalog = document.querySelector(".card-list");

salesCatalog.innerHTML = htmlSalesCatalog;

const sales = document.querySelectorAll(".card");

if (sales) {
  sales.forEach((el) => {
    let currentSale = el;
    const sliderDots = el.querySelectorAll(".card__image-slider");

    sliderDots.forEach((el, index) => {
      el.setAttribute("data-index", index);
      el.addEventListener("click", (e) => {
        currentSale.querySelectorAll(".card__image-slider").forEach((el) => {
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

const images = document.querySelectorAll(".card__image, .card__shop-image");
images.forEach((element) => {
  element.setAttribute("loading", "lazy");
  element.addEventListener("error", (e) => {
    e.currentTarget.setAttribute("src", "../images/no-image.jpg");
  });
});
