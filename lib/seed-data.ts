import { Product } from '@/types/product';
import { getStorageBaseUrl } from './storage';

const getPhotoUrl = (barcode: string, type: 'front' | 'nutrition') => {
  return `${getStorageBaseUrl()}/products/${barcode}-${type}.jpg`;
};

export const seedProducts: Omit<Product, '_id'>[] = [
  {
    bar_code: '1111',
    product_name: 'Nutella',
    brand_name: 'Ferrero',
    nutrition: {
      energy_kcal: 539,
      energy_kj: 2255,
      fat: 30.9,
      carbohydrates: 57.5,
      protein: 6.3,
      salt: 0.107,
    },
    photos: {
      front: getPhotoUrl('1111', 'front'),
      nutrition: getPhotoUrl('1111', 'nutrition'),
    },
  },
  {
    bar_code: '2222',
    product_name: 'Coca-Cola Original Taste',
    brand_name: 'Coca-Cola',
    nutrition: {
      energy_kcal: 42,
      energy_kj: 180,
      fat: 0,
      carbohydrates: 10.6,
      protein: 0,
      salt: 0,
    },
    photos: {
      front: getPhotoUrl('2222', 'front'),
      nutrition: getPhotoUrl('2222', 'nutrition'),
    },
  },
  {
    bar_code: '3333',
    product_name: 'Nature Yogurt',
    brand_name: 'Danone',
    nutrition: {
      energy_kcal: 74,
      energy_kj: 272,
      fat: 3.0,
      carbohydrates: 7.0,
      protein: 4.8,
      salt: 0.07,
    },
    photos: {
      front: getPhotoUrl('3333', 'front'),
      nutrition: getPhotoUrl('3333', 'nutrition'),
    },
  },
  {
    bar_code: '11',
    product_name: 'Nutella',
    brand_name: 'Ferrero'
  },
  {
    bar_code: '22',
    product_name: 'Coca-Cola Original Taste',
    brand_name: 'Coca-Cola'
  },
  {
    bar_code: '33',
    product_name: 'Nature Yogurt',
    brand_name: 'Danone'
  },
];
