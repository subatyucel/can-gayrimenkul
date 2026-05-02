import { ListingWithImages } from '@/components/admin/listing/listing-form/CreateUpdateListingForm';
import { ListingFormInput } from '@/lib/validations/listing';

export const TAB_FIELDS: Record<string, (keyof ListingFormInput)[]> = {
  general: ['title', 'description', 'listingType', 'price'],
  location: ['districtId', 'neighborhoodId'],
  features: [
    'netSquareMeters',
    'grossSquareMeters',
    'roomCount',
    'buildingAge',
    'floorAt',
    'totalFloor',
    'bathroomCount',
    'dues',
  ],
  media: ['images'],
};

export const TABS_ORDER = ['general', 'location', 'features', 'media'];

export const DEFAULT_LISTING_VALUES: Partial<ListingFormInput> = {
  title: '',
  description: '',
  listingType: undefined,
  price: '',
  districtId: '',
  neighborhoodId: '',
  roomCount: undefined,
  netSquareMeters: '',
  grossSquareMeters: '',
  buildingAge: '0',
  floorAt: undefined,
  totalFloor: '',
  bathroomCount: '0',
  kitchenType: undefined,
  heating: undefined,
  parking: undefined,
  dues: '0',
  balcony: undefined,
  elevator: undefined,
  furnished: undefined,
  creditworthy: undefined,
  images: [],
};

export function prepareFormValues(
  initialData?: Partial<ListingWithImages> | null,
) {
  if (!initialData) {
    return DEFAULT_LISTING_VALUES;
  }

  return {
    ...DEFAULT_LISTING_VALUES,
    ...initialData,
    districtId: initialData.districtId?.toString() ?? '',
    neighborhoodId: initialData.neighborhoodId?.toString() ?? '',
    price: initialData.price?.toString() ?? '',
    netSquareMeters: initialData.netSquareMeters?.toString() ?? '',
    grossSquareMeters: initialData.grossSquareMeters?.toString() ?? '',
    buildingAge: initialData.buildingAge?.toString() ?? '0',
    totalFloor: initialData.totalFloor?.toString() ?? '',
    bathroomCount: initialData.bathroomCount?.toString() ?? '0',
    dues: initialData.dues?.toString() ?? '0',
    images: [],
  };
}
