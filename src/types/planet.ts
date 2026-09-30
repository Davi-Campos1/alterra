export interface Planet {
  id: string
    starId?: string

  // Identidade
  name: string
  demonym: string
  description: string

  // Características físicas
  size: string
  temperature: string
  waterLevel: string
  gravity: string

  // Natureza e clima
  climate: string
  vegetation: string
  relief: string

  // Vida
  lifeLevel: string
  inhabitantType: string
  techLevel: string
  inhabitantCharacteristics: string

  // Aparência
  planetColor: string
  landColor: string
  landAmount: string
  continentStyle: string
  landTexture: string

  // Atmosfera
  hasAtmosphere: boolean
  atmosphereTexture: string
  atmosphereColor: string
  atmosphereOpacity: number

  // Sistema social
  creatorId: string
  creatorName: string
  population: number
  residents: string[]
  pointsAwardedTo: string[]
  points: number

  // Data de criação
  createdAt: string
}

