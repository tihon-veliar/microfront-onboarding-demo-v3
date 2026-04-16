module.exports = function (migration) {
  const block = migration
    .createContentType('featuredCreaturesBlock')
    .name('featuredCreaturesBlock')
    .description(
      'Section displaying a curated list of selected creatures on a page.'
    )
    .displayField('tile');

  block.createField('tile').name('tile').type('Symbol').required(true);

  block
    .createField('creatures')
    .name('creatures')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['creature'] }],
    });
};