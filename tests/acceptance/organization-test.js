import setupAcceptance, {
  setupSession,
  renderAdapterErrorsAsPage,
} from '../helpers/setup-acceptance';

describe('Acceptance: Organization', function() {
  setupAcceptance();

  describe('user is member', function() {
    setupSession(function(server) {
      let organization = server.create('organization', 'withUser');
      let project = server.create('project', {organization});
      this.organization = organization;
      this.project = project;
    });

    it('denies billing settings', function() {
      visit(`/${this.organization.slug}`);
      andThen(() => {
        expect(currentPath()).to.equal('organization.project.index');
      });

      click('[data-test-settings-icon]');
      andThen(() => {
        expect(currentPath()).to.equal('organization.project.settings');
      });

      click('[data-test-sidenav] a:contains("Billing")');
      andThen(() => {
        expect(currentPath()).to.equal('organizations.organization.billing');
      });
      percySnapshot(this.test);
    });

    it('can create new organization', function() {
      visit(`/${this.organization.slug}`);

      click('.OrganizationsSwitcherNav-item');
      click('a:contains("Create new organization")');
      andThen(() => {
        expect(currentPath()).to.equal('organizations.new');
      });
      percySnapshot(this.test.fullTitle() + ' | new');
      fillIn('.FormsOrganizationNew input[type=text]', 'New organization');
      click('.FormsOrganizationNew input[type=submit]');
      andThen(() => {
        expect(currentPath()).to.equal('organization.index');
      });
      percySnapshot(this.test.fullTitle() + ' | setup');
    });
  });

  describe('user is admin', function() {
    setupSession(function(server) {
      this.organization = server.create('organization', 'withAdminUser');
    });

    it('can edit organization settings', function() {
      visit(`/${this.organization.slug}`);
      andThen(() => {
        expect(currentPath()).to.equal('organization.index');
      });

      click('[data-test-settings-link]:contains("Settings")');
      andThen(() => {
        expect(currentPath()).to.equal('organizations.organization.settings');
      });
      percySnapshot(this.test);

      renderAdapterErrorsAsPage(() => {
        fillIn('.FormsOrganizationEdit span:contains("Slug") + input', 'invalid/slug');
        click('.FormsOrganizationEdit input[type=submit]');
        return percySnapshot(this.test.fullTitle() + ' | Error when invalid slug');
      });

      click('[data-test-sidenav] a:contains("Users")');
      andThen(() => {
        expect(currentPath()).to.equal('organizations.organization.users.index');
      });
      percySnapshot(this.test.fullTitle() + ' | Users settings');

      click('.OrganizationsUserCard .Card.Card--linkable');
      andThen(() => {
        expect(currentPath()).to.equal('organizations.organization.users.index');
      });
      percySnapshot(this.test.fullTitle() + ' | Users settings expanded');

      click('[data-test-sidenav] a:contains("Billing")');
      andThen(() => {
        expect(currentPath()).to.equal('organizations.organization.billing');
      });
      percySnapshot(this.test.fullTitle() + ' | Billing settings');
    });

    it('can update billing email', function() {
      visit(`/organizations/${this.organization.slug}/billing`);
      andThen(() => {
        expect(currentPath()).to.equal('organizations.organization.billing');
      });
      percySnapshot(this.test);

      fillIn('.FormsBillingEdit span:contains("Billing email") + input', 'a_valid_email@gmail.com');
      click('.FormsBillingEdit input[type=submit]');
      andThen(() => {
        expect(
          find('.FormsBillingEdit .FormFieldsSubmit .SavingIndicator i.fa-check-circle').length,
        ).to.equal(1);
        expect(server.schema.subscriptions.first().billingEmail).to.equal(
          'a_valid_email@gmail.com',
        );
      });
      percySnapshot(this.test.fullTitle() + ' | ok modification');

      renderAdapterErrorsAsPage(() => {
        fillIn(
          '.FormsBillingEdit span:contains("Billing email") + input',
          'an invalid email@gmail.com',
        );
        click('.FormsBillingEdit input[type=submit]');
        andThen(() => {
          expect(
            find('.FormsBillingEdit .FormFieldsSubmit .SavingIndicator i.fa-check-circle').length,
          ).to.equal(0);
          expect(
            find('.FormsBillingEdit .FormFieldsSubmit .SavingIndicator i.fa-times-circle').length,
          ).to.equal(1);
          expect(find('.FormsBillingEdit .FormFieldsInput ul.Form-errors li').text()).to.equal(
            'Billing email is invalid',
          );
          expect(server.schema.subscriptions.first().billingEmail).to.equal(
            'a_valid_email@gmail.com',
          );
        });
        return percySnapshot(this.test.fullTitle() + ' | invalid modification');
      });
    });

    it('can select pricing', function() {
      visit('/login');
      visit('/pricing');
      andThen(() => expect(currentPath()).to.equal('pricing'));
      percySnapshot(this.test);

      click('a:contains("Jump to organization for billing")');
      andThen(() => expect(currentPath()).to.equal('pricing'));
      percySnapshot(this.test.fullTitle() + '| select organization');
    });

    describe('organization is on trial account', function() {
      setupSession(function(server) {
        this.organization = server.create('organization', 'withAdminUser', 'withTrial');
      });

      it('can view billing page', function() {
        visit(`/organizations/${this.organization.slug}/billing`);
        andThen(() => {
          expect(currentPath()).to.equal('organizations.organization.billing');
        });
        percySnapshot(this.test);
      });
    });
  });
});
