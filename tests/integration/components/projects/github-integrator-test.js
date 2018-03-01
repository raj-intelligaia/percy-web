import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {manualSetup, make} from 'ember-data-factory-guy';
import {clickTrigger} from 'ember-power-select/test-support/helpers';
import GithubIntegrator from 'percy-web/tests/pages/components/github-integrator';

describe('Integration: GithubIntegratorComponent', function() {
  setupComponentTest('github-integrator', {
    integration: true,
  });

  beforeEach(function() {
    GithubIntegrator.setContext(this);
    manualSetup(this.container);
  });

  describe('with a github integration', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', 'withGithubIntegration', 'withGithubRepos');
      project.set('organization', organization);

      this.setProperties({project});
    });

    it('renders powerselect closed', function() {
      this.render(hbs`{{projects/github-integrator project=project}}`);
      expect(GithubIntegrator.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      this.render(hbs`{{projects/github-integrator project=project}}`);
      clickTrigger();
      expect(GithubIntegrator.isSelectorOpen).to.eq(true);
      expect(GithubIntegrator.groups(0).name).to.eq('GitHub');

      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a github enterprise integration', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make(
        'organization',
        'withGithubEnterpriseIntegration',
        'withGithubEnterpriseRepos',
      );
      project.set('organization', organization);
      this.setProperties({project});
    });

    it('renders powerselect closed', function() {
      this.render(hbs`{{projects/github-integrator project=project}}`);
      expect(GithubIntegrator.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      this.render(hbs`{{projects/github-integrator project=project}}`);
      clickTrigger();
      expect(GithubIntegrator.isSelectorOpen).to.eq(true);
      expect(GithubIntegrator.groups(0).name).to.eq('GitHub Enterprise');

      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with multiple integrations', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', 'withMultipleIntegrations');
      project.set('organization', organization);
      this.setProperties({project});
    });

    it('renders powerselect closed', function() {
      this.render(hbs`{{projects/github-integrator project=project}}`);
      expect(GithubIntegrator.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      this.render(hbs`{{projects/github-integrator project=project}}`);
      clickTrigger();
      expect(GithubIntegrator.isSelectorOpen).to.eq(true);
      expect(GithubIntegrator.groups(0).name).to.eq('GitHub');
      expect(GithubIntegrator.lastGroup.name).to.eq('GitHub Enterprise');

      percySnapshot(this.test.fullTitle());
    });
  });
});
