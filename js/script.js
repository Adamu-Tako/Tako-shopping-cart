function geById(container) {
    return document.getElementById(container);
};

function getByClass(container){
    return document.querySelector(container)
}

function getByClassAll (container){
    return document.querySelectorAll(container)
}

function createNode(node) {
    let element = document.createElement(node);
    return element;
};

closeBtn = getByClass('.close-btn')
cartSlide = getByClass('.cart-slide')
cartLink = getByClass('.cart-link')
cartTotalTxt = getByClass('.cart-total-text')
checkoutButton = getByClass('.checkout-button')
cartBox = getByClass('.cart-box')
row = getByClass('.box')
const cartItems = []

/**
 * 1. getAllProducts()
 * 2. apped products to page()
 * 3. add event listener to addToCartButton()
 * 4. add product to cart on click (called by 3)
 *  4.1 compute total for product ()
 *  4.2 compute total for cart ()
 *  4.3 increase qty if element already in cart ()
 *  4.4 remove element from cart if qty = 0 ()
 * 5. empty cart on checkout ()
 */
window.addEventListener('load', init)

cartLink.addEventListener('click', () => {
    cartSlide.style.display = 'flex'
})

closeBtn.addEventListener('click', () => {
    cartSlide.style.display = 'none'
})

// Initialize the page
async function init() {
    const  products = await getAllProducts()
    
    for (let i = 0; i < products.length; i++ ) {
        const productNode = creatingNodes(products[i])
        row.appendChild(productNode)
    }
    
    const addToCartBtns = getByClassAll('.add-to-cart')
    addEventListenerToCartButton(addToCartBtns, products)
    
}


async function getAllProducts(){
    let response = await fetch ('./assets/json/product.json')
    const products = await response.json()

    return products
}

function creatingNodes({ productImage, productName, price, rating, productId }){
    let productNode = createNode('div')
    productNode.setAttribute('class', 'first-item')
    
    prodImage = createNode('img')
    prodImage.src = `./assets/images/${productImage}`
    productNode.appendChild(prodImage)
    
    Name = createNode('p')
    Name.innerHTML = productName
    Name.style.fontWeight = 'bold'
    Name.style.alignSelf = 'start'
    Name.style.paddingLeft = '1rem'
    productNode.appendChild(Name)
    
    productPrice = createNode('p')
    productPrice.innerHTML = `#${price}`
    productPrice.style.color = '#063970'
    productPrice.style.fontSize = '1.5rem'
    // productPrice.style.alignSelf = 'start'
    // productPrice.style.paddingLeft = '1rem'
    productNode.appendChild(productPrice)

    productRating = createNode('div')
    productRating.setAttribute('class', 'rating')
    // productRating.innerHTML = rating
    productNode.appendChild(productRating)
    // create stars
    createStars(productRating)
    
    addToCartBtn = createNode('button')
    addToCartBtn.innerHTML = 'ADD TO CART'
    addToCartBtn.setAttribute('class', 'add-to-cart')
    addToCartBtn.setAttribute('id', productId)
    productNode.appendChild(addToCartBtn)

    return productNode
}

function createStars (parentDiv){
    
    for (let i = 0; i < 5; i++) {
        star = createNode('span')
        star.setAttribute('class', 'fa fa-star')
        parentDiv.append(star)
    }
}

function addEventListenerToCartButton (addToCartBtns, products){
    for (let i = 0; i < addToCartBtns.length; i++) {
        addToCartBtns[i].addEventListener('click', () => {
            let productId = addToCartBtns[i].id
            return addProductToCart(productId, products)
        })   
    }
}

function addProductToCart(id, products) {
    const item = products.find(p => Number(p.productId) === Number(id))
    
    const found = cartItems.find(p => Number(p.productId) === Number(id))

    if (found) {
        //item is already in cart
        found.qty += 1
        console.log(cartItems);
    }

    else if (found?.qty === item.count){
        alert('This Item Don Finish for Shop')
    }
    else{
        //item not in cart
        cartItems.push({...item, qty: 1 })
    }
 addingToCart()
}

function addingToCart(){
    cartBox.innerHTML = ''
    for (let i = 0; i < cartItems.length; i++ ) {
        const cartNode = creatingCartNodes(cartItems[i])
        cartBox.append(cartNode)
    }

    let initialValue = 0
    let cartTotalPrice = cartItems.reduce(
        (prev, next) => prev + ((Number(next.price * next.qty))),
        initialValue
    )
    checkoutButton.innerHTML = `CHECKOUT #${cartTotalPrice}`
    checkoutButton.addEventListener('click', () => {
        cartBox.innerHTML = ''
        cartTotalTxt.innerHTML = ''
        checkoutButton.innerText = 'CHECKOUT'
        cartItems.length = 0
        console.log(cartItems);
    })
    cartTotalTxt.innerHTML = `#${cartTotalPrice}`


}

function creatingCartNodes({productImage, productName, price, qty }){
    qty = Number(qty)

    let cartNode = createNode('div')
    cartNode.setAttribute('class', 'cart-item')

    let cartImg = createNode('img')
    cartImg.src = `./assets/images/${productImage}`
    cartImg.setAttribute('class', 'cart-image')
    cartNode.appendChild(cartImg)

    descriptionBox = createNode('div')
    descriptionBox.setAttribute('class', 'description')
    cartNode.appendChild(descriptionBox)

    itemName = createNode('p')
    itemName.innerHTML = productName
    descriptionBox.appendChild(itemName)

    itemPrice = createNode('h3')
    itemPrice.innerHTML = price
    descriptionBox.appendChild(itemPrice)

    addRemoveBox = createNode('div')
    addRemoveBox.setAttribute('class', 'add-remove-box')
    cartNode.appendChild(addRemoveBox)

    addButton = createNode('button')
    addButton.setAttribute('class', 'material-symbols-outlined')
    addRemoveBox.appendChild(addButton)
    addButton.innerHTML = 'add'
    addButton.addEventListener('click',  () => {
        qty++
    itemCount.innerHTML = qty
        console.log(qty);
    })   

    itemCount = createNode('span')
    itemCount.innerHTML = qty
    itemCount.setAttribute('class', 'item-count')
    addRemoveBox.appendChild(itemCount)

    removeButton = createNode('button')
    removeButton.setAttribute('class', 'material-symbols-outlined')
    addRemoveBox.appendChild(removeButton)
    removeButton.innerHTML = 'remove'
    removeButton.addEventListener('click',  () => {
        qty--
    itemCount.innerHTML = qty
        console.log(qty);
    })

    itemTotal = createNode('div')
    itemTotal.setAttribute('class', 'item-total')
    cartNode.appendChild(itemTotal)

    totalText = createNode('h5')
    itemTotal.appendChild(totalText)
    itemTotal.innerText = 'Cart Total'

    totalPrice = createNode('h3')
    itemTotal.appendChild(totalPrice)
    let itemTotalCost = price * qty
    totalPrice.innerText =  `#${itemTotalCost}`
    totalPrice.style.fontWeight = 'bold'
    totalPrice.style.fontSize = '20px'

    return cartNode
}


