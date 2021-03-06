import Route from '@ember/routing/route';
import EventWizardMixin from 'open-event-frontend/mixins/event-wizard';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, EventWizardMixin, {
  titleToken() {
    return this.l10n.t('Edit Event');
  },

  beforeModel(transition) {
    this._super(...arguments);
    if (transition.targetName === 'events.view.edit.index') {
      this.transitionTo('events.view.edit.basic-details');
    }

    let event = this.modelFor('events.view');
    let { currentUser } = this.authManager;
    if (!(currentUser.isAnAdmin || currentUser.email === event.owner.get('email') || event.organizers.includes(currentUser)
        || event.coorganizers.includes(currentUser) || event.trackOrganizers.includes(currentUser)
        || event.registrars.includes(currentUser) || event.moderators.includes(currentUser))) {
      this.transitionTo('index');
    }
  },

  async model() {
    return {
      event : this.modelFor('events.view'),
      steps : this.getSteps(),
      types : await this.store.query('event-type', {
        sort: 'name'
      }),
      module : await this.store.queryRecord('module', {}),
      topics : await this.store.query('event-topic', {
        sort    : 'name',
        include : 'event-sub-topics'
      })
    };
  }
});
