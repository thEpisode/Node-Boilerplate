/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, userService */
window.app = new Vue({
  el: '#vue-app',
  mixins: [
    popup,
    b64,
    format,
    time,
    auth,
    find,
    localization,
    loader,
    parameters,
    notificationService,
    userService],
  data: {
    vueBind: {
      model: {
        notification_type: 'franchisor',
        notifications: [],
        user: {},
        userDetail: {
          role: '',
          status: ''
        }
      },
      paths: {},
      visibility: {},
      style: {}
    }
  },
  mounted () {
    window.context = {
      identity: this.$cookies.get('user_identity'),
      token: this.$cookies.get('user_session')
    }

    this.initializeView()
  },
  methods: {
    async initializeView () {
      this.getUser()
      this.getAllNotifications()
      await this.getSelectedUser()

      this.hideLoader()
    },
    async getUser () {
      const userData = this.$cookies.get('user_data')

      if (userData) {
        this.vueBind.model.user = userData
        return
      }
      const identity = window.context.identity

      if (!identity) {
        this.showError({ message: 'Please, login again' })
        return
      }
      const userResponse = await this.services.user.getByIdentity(identity)

      if (!userResponse || !userResponse.success) {
        this.showDefaultError(userResponse)
        return
      }

      this.$cookies.set('user_data', userResponse.result, '1d', '/')
      this.vueBind.model.user = userResponse.result

      return this.vueBind.model.user
    },
    async getAllNotifications () {
      const notificationsResponse = await this.services.notification.getAllLastByReceiver({
        receiver: this.vueBind.model.user.id || window.context.identity || ''
      })

      if (notificationsResponse && notificationsResponse.success) {
        this.vueBind.model.notifications = notificationsResponse.result
      }
    },
    async getSelectedUser () {
      if (!window.location.queryString || !window.location.queryString.id) {
        this.showError({ message: 'Please return and select an user to use this action' })
        return
      }

      const userResponse = await this.services.user.getByIdentity({
        identity: window.location.queryString.id
      })

      if (!userResponse || !userResponse.success) {
        this.showDefaultError(userResponse)
        return
      }

      this.vueBind.model.userDetail = userResponse.result
    }
  }
})