import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  thumbnail: string;
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

export default Ecommerce;
