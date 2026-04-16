module.exports = function (migration) {
  const page = migration
    .createContentType('archivePage')
    .name('archivePage')
    .description(
      'Listing page used to display and filter a collection of creatures.'
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
    .createField('pageTitle')
    .name('pageTitle')
    .type('Symbol')
    .required(true);

  page
    .createField('pageDescription')
    .name('pageDescription')
    .type('Text');
};