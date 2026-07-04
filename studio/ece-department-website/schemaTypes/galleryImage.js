export default {
  name: 'galleryImage',
  type: 'document',
  title: 'Gallery Image',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'image', type: 'image', title: 'Photo', options: { hotspot: true } },
    { name: 'category', type: 'string', title: 'Category' },
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    }
  ]
}