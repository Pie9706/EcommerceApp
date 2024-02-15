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
    if (product.qty > 0) {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
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

  return (
    <div id="root" className="container mx-auto p-4">
      <div className="relative">
        <div className="absolute top-0 right-0 p-4">
          <div className="relative inline-block">
            <button
              onClick={toggleCart}
              className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition duration-300"
            >
              {showCart ? "Home" : "Carrello"}({cartItems.length})
            </button>
          </div>
        </div>
      </div>

      {showCart ? (
        <div id="cart" className="mt-4">
          <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
          <p className="mb-2">Total Price: ${getTotalPrice()}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cartItems.map((item: Product) => (
              <div key={item.id} className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <img
                  src={item.image}
                  alt={item.thumbnail}
                  className="mt-2 w-full h-32 object-cover"
                />
                <p className="mt-2">Quantity: {item.qty}</p>
                <p className="mt-2">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div id="product-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white p-4 shadow-md rounded-md">
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <img
                src={product.image}
                alt={product.thumbnail}
                className="mt-2 w-full h-32 object-cover"
              />
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ecommerce;
