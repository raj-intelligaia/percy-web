import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {hash} from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const project = this.modelFor('organization.project');
    const orgId = project.belongsTo('organization').id();
    const organization = this.store.findRecord('organization', orgId);
    const projects = organization.then(org => {
      return org.get('projects');
    });

    return hash({organization, project, projects});
  },

  setupController(controller, model) {
    controller.setProperties({
      project: model.project,
      organization: model.organization,
      projects: model.projects,
    });
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
