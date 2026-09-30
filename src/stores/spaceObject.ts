import { defineStore } from 'pinia'
import type { SpaceObject } from '../types/spaceObject'

const STORAGE_KEY = 'alterra-space-objects'

function loadObjects(): SpaceObject[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return []
  }

  try {
    return JSON.parse(saved) as SpaceObject[]
  } catch {
    return []
  }
}

export const useSpaceObjectStore = defineStore('spaceObject', {
  state: () => ({
    objects: loadObjects(),
  }),

  getters: {
    totalObjects: (state) => state.objects.length,

    getObjectById: (state) => {
      return (id: string) =>
        state.objects.find((object) => object.id === id)
    },
  },

  actions: {
    addObject(object: SpaceObject) {
      this.objects.push(object)
      this.saveObjects()
    },

    removeObject(id: string) {
      this.objects = this.objects.filter(
        (object) => object.id !== id
      )

      this.saveObjects()
    },

    saveObjects() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.objects)
      )
    },
  },
})