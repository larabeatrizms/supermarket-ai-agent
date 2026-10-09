export const products = [
  {
    id: 1,
    name: "Arroz Tipo 1 5kg",
    category: "Mercearia",
    price: 28.9,
  },
  {
    id: 2,
    name: "Feijão Carioca 1kg",
    category: "Mercearia",
    price: 7.5,
  },
  {
    id: 3,
    name: "Leite Integral 1L",
    category: "Laticínios",
    price: 5.29,
  },
  {
    id: 4,
    name: "Café Torrado e Moído 500g",
    category: "Matinais",
    price: 18.4,
  },
  {
    id: 5,
    name: "Azeite de Oliva Extra Virgem 500ml",
    category: "Óleos e Temperos",
    price: 42.9,
  },
];

const cart: object[] = [];

export class MarketService {
  getProducts() {
    return products;
  }

  getProduct(productId: number) {
    const product = products.find((product) => product.id === productId);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    return product;
  }

  getProductsByCategory(category: string) {
    return products.filter((product) => product.category === category);
  }

  addProductToCart(product: any) {
    cart.push(product);
  }

  getCart() {
    return cart;
  }
}
