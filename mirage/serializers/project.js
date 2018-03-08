import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['organization'],
  links(project) {
    return {
      tokens: {
        related: `/api/v1/projects/${project.fullSlug}/tokens`,
      },
      builds: {
        related: `/api/v1/projects/${project.fullSlug}/builds`,
      },
      organization: {
        related: `/api/v1/projects/${project.fullSlug}/organization`,
      },
    };
  },
});
