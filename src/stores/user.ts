import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  password: string
  points: number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(
      localStorage.getItem('alterra-logged-user') || 'null'
    ) as User | null,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
  },

  actions: {
    setUser(user: User) {
      this.user = user

      localStorage.setItem(
        'alterra-logged-user',
        JSON.stringify(user)
      )
    },

    logout() {
      this.user = null
      localStorage.removeItem('alterra-logged-user')
    },
  },
})