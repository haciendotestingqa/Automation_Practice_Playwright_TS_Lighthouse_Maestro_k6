/** @type {Readonly<{ demoUrl: string; shopReadyTimeout: number; category: string; productName: RegExp }>} */
const PRESTASHOP = {
  demoUrl: process.env.PRESTASHOP_DEMO_URL || 'https://demo.prestashop.com/',
  shopReadyTimeout: 120_000,
  category: 'Clothes',
  productName: /hummingbird printed t-shirt/i,
};

module.exports = { PRESTASHOP };
