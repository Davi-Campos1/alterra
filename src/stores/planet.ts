import { defineStore } from 'pinia'
import type { Planet } from '../types/planet'

const STORAGE_KEY = 'alterra-planets'

function loadPlanets(): Planet[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return []
  }

  try {
    return JSON.parse(saved) as Planet[]
  } catch {
    return []
  }
}

export const usePlanetStore = defineStore('planet', {
  state: () => ({
    planets: loadPlanets(),
  }),

  getters: {
    getPlanetById: (state) => {
      return (id: string) => state.planets.find((planet) => planet.id === id)
    },

    totalPlanets: (state) => state.planets.length,
  },

  actions: {
    addPlanet(planet: Planet) {
      this.planets.push(planet)
      this.savePlanets()
    },

    removePlanet(id: string) {
      this.planets = this.planets.filter((planet) => planet.id !== id)
      this.savePlanets()
    },

    getPlanet(id: string) {
      return this.planets.find((planet) => planet.id === id)
    },

    savePlanets() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.planets))
    },
  },
})