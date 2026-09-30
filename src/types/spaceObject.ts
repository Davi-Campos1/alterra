export type SpaceObjectType =
  | 'star'
  | 'black-hole'
  | 'nebula'

export interface SpaceObject {
  id: string
  type: SpaceObjectType
  name: string
  description: string
  creatorId: string
  creatorName: string
  pointsCost: number

  // Características da estrela
  starType?: string
  starColor?: string
  starSize?: string
  starTemperature?: string
  starLuminosity?: string

  // Características da nebulosa
  nebulaType?: string
  nebulaColor?: string
  nebulaSize?: string
  nebulaIntensity?: string

  rewardedPlanetIds?: string[]

  createdAt: string
}

