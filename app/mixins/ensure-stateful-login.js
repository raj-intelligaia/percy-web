import Mixin from '@ember/object/mixin';
import lockOptions from 'percy-web/lib/lock-settings';
import {inject as service} from '@ember/service';
import $ from 'jquery';
import {Promise, resolve} from 'rsvp';

// This mixin should be used when accessing the lock.js authentication modal.
// This mixin fires a request to our backend's `/api/auth/session` endoint and
// gets back an object with a state token (`{state: 'foo'}`).
// We wait for this token to get back, set it in the lock options, and
// only then have the lock modal show up.
// This should protect against CSRF attacks.
var EnsureStatefulLogin = Mixin.create({
  auth0: service(),

  _hasOpenedLoginModal: false,

  // Use this instead of calling `this.get('session').authenticate...` from your routes
  showLoginModalEnsuringState() {
    if (this.get('_hasOpenedLoginModal')) {
      return resolve();
    }
    return this._getStateToken().then(stateToken => {
      lockOptions.auth.params.state = stateToken.state;
      this._showLock(lockOptions);
    });
  },

  _getStateToken() {
    this.set('_hasOpenedLoginModal', true);
    return $.ajax({
      type: 'GET',
      url: '/api/auth/session',
    });
  },

  _showLock(options) {
    // This code is taken from
    // https://github.com/auth0-community/ember-simple-auth-auth0/
    //   blob/develop/addon/services/auth0.js#L93
    return new Promise((resolve, reject) => {
      // Despite the name of the method,
      // getAuth0LockInstance actually _creates_ an instance
      const lock = this.get('auth0').getAuth0LockInstance(options);

      this.get('auth0')._setupLock(lock, resolve, reject);
      lock.on('hide', this._onLockClosed.bind(this));
      lock.show();
    });
  },

  _onLockClosed() {
    this.set('_hasOpenedLoginModal', false);
    this.transitionTo('/');
  },
});

export default EnsureStatefulLogin;
