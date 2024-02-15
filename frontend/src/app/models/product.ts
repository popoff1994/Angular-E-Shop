export interface Product {
  PRODUCT_ID: number;
  NAME: string;
  SHORT_DESCRIPTION: string;
  LONG_DESCRIPTION: string;
  SPECS: { [key: string]: string };
  CATEGORY_ID: number;
  PRICE: number;
  IMAGE_URLS: string[];
  CATEGORY_NAME?: string;
  CATEGORY_DESCRIPTION?: string;
}
