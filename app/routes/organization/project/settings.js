import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {hash} from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const project = this.modelFor('organization.project');
    const organization = this.modelFor('organization');
    const projects = this.store.query('project', {organization: organization});

    return hash({organization, project, projects});
  },

  actions: {
    projectUpdated(project) {
      // If project slug changed, redirect to new URL slug:
      let projectSlug = project.get('slug');
      let organizationSlug = project.get('organization.slug');
      this.transitionTo('organization.project.index', organizationSlug, projectSlug);
    },
  },
});
