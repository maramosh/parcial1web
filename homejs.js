const categories = document.getElementsByClassName("category");
const tableBody = document.getElementById("table-body");
const tableHeader = document.getElementById("table-header");
const dashBoard = document.getElementById("dashboard");
const currentName = document.getElementById("currentItemName");

for (let i = 0; i < categories.length; i++) {
  let itemActual = categories.item(i);
  itemActual.addEventListener("click", (event) => {
    removeAllChildNodes(dashBoard);
    getItems(itemActual.innerText);
    console.log(itemActual.innerText);
  });
}

function getItems(category) {
  const resp = fetch(
    "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json"
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        const nombre = data[i].name;
        console.log(data[i].name);
        if (nombre === category) {
          for (let j = 0; j < data[i].products.length; j++) {
            const item = data[i].products[j];
            //
            let card = document.createElement("div");
            card.classList.add("card");
            //
            let img = document.createElement("img");
            img.classList.add("card-img-top", "w-25");
            img.src = item.image;
            //
            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body(");
            let itemName = document.createElement("p");
            itemName.classList.add("item-name");
            itemName.textContent = item.name;
            let description = document.createElement("p");
            description.textContent = item.description;
            let price = document.createElement("p");
            price.classList.add("item-price");
            price.textContent = item.price;
            let add = document.createElement("button");
            add.classList.add("btn", "btn-primary");
            add.innerText = "Add to cart";
            add.addEventListener("click", (event) => {
              addToCart();
            });
            //
            currentName.textContent = data[i].name;
            cardBody.appendChild(itemName);
            cardBody.appendChild(description);
            cardBody.appendChild(price);
            cardBody.appendChild(add);
            card.appendChild(img);
            card.appendChild(cardBody);
            dashBoard.appendChild(card);
          }
        }
      }
    });
}

function addToCart() {
  //Acá pues es sumar 1 al texto del carrito, no alcancé por tiempo
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
