export interface ItemListing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  quantitySold: number;
  categorySlug: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}
