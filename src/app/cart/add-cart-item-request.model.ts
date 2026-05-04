import { ItemListing } from '../item-listings/item-listing.model';

export interface AddCartItemRequest {
  guestSessionId: string;
  listingInfo: ItemListing;
  itemQuantity: number;
}
