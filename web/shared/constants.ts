export const PRESTASHOP = {
  demoUrl: process.env.PRESTASHOP_DEMO_URL || 'https://demo.prestashop.com/',
  shopReadyTimeout: 120_000,
  category: 'Clothes',
  productName: /hummingbird printed t-shirt/i,
} as const;

export interface Product {
  name: string;
  price?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}
