import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';
import {hash} from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, ResetScrollMixin, {
  model() {
    let project = this.modelFor('organization.project');
    const orgId = project.belongsTo('organization').id();
    const organization = this.store.findRecord('organization', orgId);
    const projects = organization.then(org => {
      return org.get('projects');
    });

    return hash({
      organization,
      project,
      projects,
    });
  },

  setupController(controller, model) {
    controller.setProperties({
      project: model.project,
      projects: model.projects,
      sortedProjects: model.projects.sortBy('isDisabled', 'name'),
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      let project = this.modelFor(this.routeName).project;
      let organization = project.get('organization');
      let eventProperties = {
        project_id: project.get('id'),
        project_slug: project.get('slug'),
      };
      this.analytics.track('Project Viewed', organization, eventProperties);

      // If transitioning back to this page after first load, background reload the builds.
      if (project.get('builds').isFulfilled) {
        project.get('builds').reload();
      }
    },
  },
});
