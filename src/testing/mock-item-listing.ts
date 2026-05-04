import { ItemListing } from '../app/item-listings/item-listing.model';

/**
 * Mocks an item listing for tests.
 */
export const mockListing: ItemListing = {
  title: 'test',
  description: 'test listing',
  price: 10.0,
  imageUrl: '',
  createdAt: '2026-01-01 00:00:00.000000',
  updatedAt: '2026-01-01 00:00:00.000000',
  id: '123',
  isActive: true,
  quantitySold: 0,
  categoryName: 'Uncategorized',
  categorySlug: 'uncategorized',
};
