module.exports = function (migration) {
  const page = migration
    .createContentType('homePage')
    .name('homePage')
    .description(
      'Landing page containing hero section, featured content, and promotional sections.'
    )
    .displayField('title');

  page.createField('title').name('title').type('Symbol').required(true);

  page
    .createField('slug')
    .name('slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField('hero')
    .name('hero')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([{ linkContentType: ['heroBlock'] }]);

  page
    .createField('imageTextSection')
    .name('imageTextSection')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([{ linkContentType: ['imageTextBlock'] }]);

  page
    .createField('featuredSection')
    .name('featuredSection')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([{ linkContentType: ['featuredCreaturesBlock'] }]);
};