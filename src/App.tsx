import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  thumbnail: string;
  qty: number;
}

function Ecommerce() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch(
        "https://mockend.up.railway.app/api/products"
      );
      const result: Product[] = await response.json();
      setProducts(result.map((product) => ({ ...product, qty: 5 })));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  function onClickCart(product: Product) {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty - 1 } : p
        )
      );
    } else {
      setCartItems((prevCartItems) => [
        ...prevCartItems,
        { ...product, qty: 1 },
      ]);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty - 1 } : p
        )
      );
    }
  }

  function getTotalPrice() {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  }

  function toggleCart() {
    setShowCart(!showCart);
  }

  function toggleProductDetails(product: Product) {
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  }

  function onRemoveFromCart(product: Product) {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Se l'elemento è presente nel carrello con qty > 1, decrementa solo la quantità
      if (existingItem.qty > 1) {
        setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty - 1 } : item
          )
        );
      } else {
        // Se l'elemento ha qty === 1, rimuovilo completamente dal carrello
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== product.id)
        );
      }

      // Incrementa la quantità disponibile nel catalogo
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        )
      );
    }
  }

  return (
    <div id="root" className="container mx-auto p-4 relative">
      <h1 className="center-text text-3xl font-bold mb-1">Ecommerce</h1>
      <div className="absolute top-0 right-0 p-4">
        <div className="relative inline-block">
          <button
            onClick={toggleCart}
            className="bg-yellow-500 text-white px-2 py-2 rounded-full hover:bg-yellow-600 transition duration-300 mr-4"
          >
            {showCart
              ? "Home"
              : `Carrello (${cartItems.reduce(
                  (total, item) => total + item.qty,
                  0
                )})`}
          </button>
        </div>
      </div>
      {showCart ? (
        <div id="cart" className="mt-4">
          <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
          <p className="mb-2">Total Price: ${getTotalPrice()}</p>
          <button className="mt-2 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            BUY NOW
          </button>
          <div>
            {cartItems.map((item: Product) => (
              <div key={item.id} className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <img
                  src={item.image}
                  alt={item.thumbnail}
                  className="mt-2 w-full h-32 object-cover sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80"
                />
                <p className="mt-2">Quantity: {item.qty}</p>
                <p className="mt-2">${item.price}</p>
                <button
                  onClick={() => onRemoveFromCart(item)}
                  className="mt-2 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove from cart
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          id="product-list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white p-4 shadow-md rounded-md">
              <h3
                onClick={() => toggleProductDetails(product)}
                className="text-lg font-semibold mb-2 cursor-pointer"
              >
                {product.title}
              </h3>
              <img
                src={product.image}
                alt={product.thumbnail}
                className="mt-2 w-full h-32 object-cover"
              />
              {selectedProduct && selectedProduct.id === product.id && (
                <>
                  <p className="mt-2">{product.description}</p>
                  <p className="mt-2">Quantity: {product.qty}</p>
                  <p className="mt-2">${product.price}</p>
                  <button
                    onClick={() => onClickCart(product)}
                    disabled={product.qty === 0}
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleProductDetails(product)}
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    Go Back
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ecommerce;
