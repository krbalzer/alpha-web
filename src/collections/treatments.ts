import type { CollectionConfig } from 'payload'
import { live, publicRead, slug } from './fields'

export const TREATMENT_CATEGORIES = ['Injectables', 'Laser + light', 'Skin tightening', 'Microneedling', 'Facials + peels', 'Body contouring', 'Wellness', 'Hair + scalp', 'Eyes, brows + lashes', 'Intimate wellness', 'Surgery']

/** One treatment on the network's master list. Tagged to brands; narrowed to locations only where a brand doesn't offer it everywhere. */
export const Treatments: CollectionConfig = {
  slug: 'treatments',
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'brands', 'live'] },
  defaultSort: 'order',
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true, admin: { description: 'As shown on the site, e.g. Wrinkle relaxers' } },
      { name: 'category', type: 'select', required: true, options: TREATMENT_CATEGORIES },
      { name: 'order', type: 'number', admin: { description: 'Order within the category.' } },
    ] },
    { name: 'products', label: 'Products + devices', type: 'text', admin: { description: 'Across the network, for reference. Not shown per brand.' } },
    { name: 'brands', label: 'Offered by', type: 'relationship', relationTo: 'brands', hasMany: true, index: true },
    { name: 'locations', label: 'Only at', type: 'relationship', relationTo: 'locations', hasMany: true, admin: { description: 'Only when a brand offers it at some of its locations. List those locations; that brand\'s other locations leave it off. Brands with none listed here offer it everywhere.' } },
    live,
    slug('name'),
  ],
}
