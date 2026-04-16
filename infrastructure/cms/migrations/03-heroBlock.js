module.exports = function (migration) {
  const hero = migration
    .createContentType('heroBlock')
    .name('heroBlock')
    .description(
      'Top section of a page with headline, supporting text, background image, and optional call-to-action.'
    )
    .displayField('title');

  hero.createField('title').name('title').type('Symbol').required(true);

  hero.createField('subtitle').name('subtitle').type('Symbol');

  hero
    .createField('backgroundImage')
    .name('backgroundImage')
    .type('Link')
    .linkType('Asset')
    .required(true);

  hero.createField('ctaText').name('ctaText').type('Symbol');

  hero.createField('ctaLink').name('ctaLink').type('Symbol');
};