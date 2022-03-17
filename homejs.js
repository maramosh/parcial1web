const categories = document.getElementsByClassName("category");
const dashBoard = document.getElementById("dashboard");
const currentName = document.getElementById("currentItemName");
const navBrand = document.getElementById("navbarTitle");
const itemNumber = document.getElementById("itemNumber");
const botonCarrito = document.getElementById("botonCarrito");
botonCarrito.addEventListener("click", (event) => {
  mostrarCarrito();
});

const carrito = [];
let totalAmount = 0;

for (let i = 0; i < categories.length; i++) {
  let itemActual = categories.item(i);
  itemActual.addEventListener("click", (event) => {
    removeAllChildNodes(dashBoard);
    getItems(itemActual.innerText);
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
        if (nombre === category) {
          for (let j = 0; j < data[i].products.length; j++) {
            const item = data[i].products[j];
            //
            let card = document.createElement("div");
            card.classList.add("card", "my-2");
            //
            let img = document.createElement("img");
            img.classList.add("card-img-top", "mt-2", "mx-auto");
            img.src = item.image;
            //
            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            let itemName = document.createElement("p");
            itemName.classList.add("item-name", "text-center", "card-title");
            itemName.textContent = item.name;
            let description = document.createElement("p");
            description.textContent = item.description;
            description.classList.add("card-text");
            let price = document.createElement("p");
            price.classList.add("item-price", "card-text");
            price.textContent = item.price;
            let add = document.createElement("button");
            add.classList.add("btn", "justify-content-center");
            add.innerText = "Add to cart";
            add.addEventListener("click", (event) => {
              addToCart(data[i].products[j]);
            });
            //
            currentName.innerText = data[i].name.toUpperCase();
            navBrand.innerText = data[i].name;
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

function mostrarCarrito() {
  removeAllChildNodes(dashBoard);
  //HEADER
  currentName.textContent = "ORDER DETAIL";
  const table = document.createElement("table");
  table.classList.add("table");
  const tableHead = document.createElement("thead");
  const tableRow1 = document.createElement("tr");
  const thItem = document.createElement("th");
  thItem.textContent = "Item";
  const thQty = document.createElement("th");
  thQty.textContent = "Qty.";
  const thDescription = document.createElement("th");
  thDescription.textContent = "Description";
  const thUnit = document.createElement("th");
  thUnit.textContent = "Unit price";
  const thAmount = document.createElement("th");
  thAmount.textContent = "Amount";
  const thModify = document.createElement("th");
  thModify.textContent = "Modify";
  //BODY
  const tableBody = document.createElement("tbody");
  //Funcion que retorna la lista de items únicos en el carrito
  let uniqueObjArray = [
    ...new Map(carrito.map((item) => [item["name"], item])).values(),
  ];

  for (let i = 0; i < uniqueObjArray.length; i++) {
    const element = uniqueObjArray[i];
    const tr = document.createElement("tr");
    const tdItem = document.createElement("td");
    tdItem.textContent = i + 1;
    const tdQty = document.createElement("td");
    tdQty.textContent = countItems(element.name);
    const tdDescription = document.createElement("td");
    tdDescription.textContent = element.name;
    const tdUnit = document.createElement("td");
    tdUnit.textContent = element.price;
    const tdAmount = document.createElement("td");
    tdAmount.textContent =
      parseFloat(element.price).toFixed(2) * countItems(element.name);
    totalAmount += parseFloat(tdAmount.textContent);
    const botonSuma = document.createElement("button");
    botonSuma.classList.add("btnModify", "mx-2");
    botonSuma.textContent = "+";
    botonSuma.addEventListener("click", (event) => {
      addToCart(element);
      tdAmount.textContent =
        parseFloat(element.price).toFixed(2) * countItems(element.name);
      tdQty.textContent = countItems(element.name);
    });
    const botonResta = document.createElement("button");
    botonResta.classList.add("btnModify", "mx-2");
    botonResta.textContent = "-";
    botonResta.addEventListener("click", (event) => {
      removeFromCart(element);
      tdAmount.textContent =
        parseFloat(element.price).toFixed(2) * countItems(element.name);
      tdQty.textContent = countItems(element.name);
    });
    const tdModify = document.createElement("td");
    tdModify.append(botonSuma, botonResta);
    tr.append(tdItem, tdQty, tdDescription, tdUnit, tdAmount, tdModify);
    tableBody.appendChild(tr);
  }
  //TOTAL
  const footerDiv = document.createElement("div");
  footerDiv.classList.add("d-flex", "justify-content-between", "w-100");
  const totalText = document.createElement("p");
  totalText.classList.add();
  totalText.textContent = "Total: " + totalAmount;
  const buttonDiv = document.createElement("div");
  //CANCELACIÓN DE ORDEN
  const buttonCancel = document.createElement("button");
  buttonCancel.id = "myModal";
  buttonCancel.classList.add("btnCancel", "m-2");
  buttonCancel.textContent = "Cancel";
  buttonCancel.addEventListener("click", (event) => {});
  //CONFIRMACIÓN DE ORDEN
  const buttonConfirm = document.createElement("button");
  buttonConfirm.addEventListener("click", (event) => {
    let confirmArray = [];
    for (let i = 0; i < uniqueObjArray.length; i++) {
      const element = uniqueObjArray[i];
      const object = {
        item: i + 1,
        quantity: countItems(element.name),
        description: element.name,
        unitPrice: element.price,
      };
      confirmArray.push(object);
    }
    console.log(confirmArray);
  });
  buttonConfirm.classList.add("btnConfirm", "m-2");
  buttonConfirm.textContent = "Confirm order";
  buttonDiv.append(buttonConfirm, buttonCancel);
  footerDiv.append(totalText, buttonDiv);
  //CANCEL MODAL
  const divModal = document.createElement("div");
  divModal.id = "myModal";
  divModal.classList.add("modal");
  //APPEND
  table.appendChild(tableBody);
  tableRow1.append(thItem, thQty, thDescription, thUnit, thAmount, thModify);
  tableHead.appendChild(tableRow1);
  table.appendChild(tableHead);
  dashBoard.appendChild(table);
  dashBoard.appendChild(footerDiv);
}

function addToCart(item) {
  //Acá pues es sumar 1 al texto del carrito, no alcancé por tiempo
  const number = itemNumber.innerText.split(" ");
  let newNumber = parseInt(number[0]) + 1;
  if (number[0] === "") {
    newNumber = 1;
  }
  itemNumber.innerText = newNumber + " " + "items";
  carrito.push(item);
}

function removeFromCart(item) {
  const number = itemNumber.innerText.split(" ");
  let newNumber = parseInt(number[0]) - 1;
  if (number[0] === "") {
    newNumber = 0;
  }
  itemNumber.innerText = newNumber + " " + "items";
  for (let i = 0; i < carrito.length; i++) {
    const element = carrito[i];
    if (element.name === item.name) {
      carrito.splice(i, 1);
      return null;
    }
  }
}

function countItems(name) {
  let count = 0;
  for (let i = 0; i < carrito.length; i++) {
    const element = carrito[i];
    if (element.name == name) {
      count++;
    }
  }
  return count;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
