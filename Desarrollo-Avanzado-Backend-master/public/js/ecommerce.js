async function addToCart(pid) {
    // Usar siempre el carrito asociado al usuario logueado
    const cartId = window.__CART_ID__;
    if (!cartId) {
        return alert('No se encontró un carrito asociado a tu usuario.');
    }

    const addProductResponse = await fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'POST'
    });

    const addProduct = await addProductResponse.json();

    if (addProduct.status === 'error') {
        return alert(addProduct.message);
    }

    alert('Producto añadido satisfactoriamente!');
}