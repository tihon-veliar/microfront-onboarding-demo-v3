module.exports = function (migration) {
  const block = migration
    .createContentType('imageTextBlock')
    .name('imageTextBlock')
    .description(
      'Section combining image and text with configurable layout (image position).'
    )
    .displayField('title');

  block.createField('title').name('title').type('Symbol').required(true);

  block
    .createField('content')
    .name('content')
    .type('RichText')
    .required(true);

  block
    .createField('image')
    .name('image')
    .type('Link')
    .linkType('Asset')
    .required(true);

  block
    .createField('imageAlignment')
    .name('imageAlignment')
    .type('Symbol')
    .validations([
      {
        in: ['left', 'right', 'top', 'bottom'],
      },
    ])
    .defaultValue({
      'en-US': 'left',
    });
};