import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['subscription', 'versionControlIntegrations'],
  links(organization) {
    return {
      projects: {
        related: `/api/v1/organizations/${organization.slug}/projects`,
      },
    };
  },
});
