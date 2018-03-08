import {Factory} from 'ember-cli-mirage';

export default Factory.extend({
  isEnabled: true,
  name(i) {
    return `The Project That We All Adore And Love Working On ${i}`;
  },
  slug() {
    return this.name.underscore();
  },
  fullSlug() {
    return `${this.organization.slug}/${this.slug}`;
  },

  afterCreate(project, server) {
    server.create('token', {project});
  },
});
