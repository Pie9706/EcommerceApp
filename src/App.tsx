/*import { useState, useEffect } from "react";

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
  const [cartItems, setCartItems] = useState<number[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch(
        "https://mockend.up.railway.app/api/products"
      );
      const result = await response.json();
      setProducts(result);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  function onClickCart(product: Product) {
    setCartItems([...cartItems, product.id]);
  }

  return (
    <div id="root">
      <p id="counter">{cartItems.length}</p>
      <div id="title">
        <h1>Ecommerce</h1>
        <h2>Description</h2>
      </div>
      <div id="footer">
        <div>
          <ul>
            {products.map((product: Product, index: number) => (
              <li key={index}>
                {product.title}
                <img src={product.image} alt={product.thumbnail}></img>
                {product.description}
                <p>{product.qty}</p>

                {product.price}
                <button onClick={() => onClickCart(product)}>
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Ecommerce;*/

import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

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

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch(
        "https://mockend.up.railway.app/api/products"
      );
      const result = await response.json();
      setProducts(result);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  function onClickCart(product: Product) {
    if (product.qty > 0) {
      setCartItems([...cartItems, product]);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty - 1 } : p
        )
      );
    }
  }

  return (
    <div id="root" className="relative">
      <div className="absolute top-0 right-0 p-4">
        <div className="relative inline-block">
          <FaShoppingCart className="text-2xl mr-2" />
          <div className="absolute top-0 right-0">
            <div className="w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full">
              {cartItems.length}
            </div>
          </div>
        </div>
      </div>
      <div id="title" className="mt-16 ml-4">
        <h1 className="text-3xl font-bold">Ecommerce</h1>
        <h2 className="text-lg font-semibold">Description</h2>
      </div>
      <div id="product-list" className="grid grid-cols-3 gap-4 mt-4 ml-4">
        {products.map((product: Product) => (
          <div key={product.id} className="bg-white p-4 shadow-md rounded-md">
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <img
              src={product.image}
              alt={product.thumbnail}
              className="mt-2 w-full h-auto"
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
    </div>
  );
}

export default Ecommerce;
