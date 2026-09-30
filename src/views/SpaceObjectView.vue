<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpaceObjectStore } from '../stores/spaceObject'
import { useUserStore } from '../stores/user'
import { usePlanetStore } from '../stores/planet'

const route = useRoute()
const router = useRouter()

const spaceObjectStore = useSpaceObjectStore()
const userStore = useUserStore()
const planetStore = usePlanetStore()

const object = computed(() =>
  spaceObjectStore.getObjectById(route.params.id as string)
)

const userPlanets = computed(() =>
  planetStore.planets.filter(
    (planet) =>
      planet.creatorId === userStore.user?.id &&
      !planet.starId
  )
)

const orbitingPlanets = computed(() =>
  planetStore.planets.filter(
    (planet) => planet.starId === object.value?.id
  )
)

function deleteObject() {
  if (!object.value) return

  const confirmed = window.confirm(
    'Tem certeza que deseja excluir este objeto?'
  )

  if (!confirmed) return

  spaceObjectStore.removeObject(object.value.id)
  router.push('/explorar')
}

function addPlanetToOrbit(planetId: string) {
  const planet = planetStore.getPlanet(planetId)
  const star = object.value

  if (!planet || !star || star.type !== 'star') return

  planet.starId = star.id
  planetStore.savePlanets()

  if (planet.creatorId === star.creatorId) return

  const rewardedPlanetIds = star.rewardedPlanetIds ?? []

  if (rewardedPlanetIds.includes(planet.id)) return

  star.rewardedPlanetIds = [...rewardedPlanetIds, planet.id]
  spaceObjectStore.saveObjects()

  const savedUsers = JSON.parse(
    localStorage.getItem('alterra-users') || '[]'
  ) as Array<{
    id: string
    name: string
    email: string
    password: string
    points: number
  }>

  const starOwner = savedUsers.find(
    (user) => user.id === star.creatorId
  )

  if (!starOwner) return

  starOwner.points += 20

  localStorage.setItem('alterra-users', JSON.stringify(savedUsers))

  if (userStore.user?.id === starOwner.id) {
    userStore.setUser(starOwner)
  }
}

function removePlanetFromOrbit(planetId: string) {
  const planet = planetStore.getPlanet(planetId)

  if (!planet) return

  planet.starId = undefined
  planetStore.savePlanets()
}

function translate(value: string) {
  const translations: Record<string, string> = {
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
    giant: 'Gigante',

    freezing: 'Congelado',
    cold: 'Frio',
    temperate: 'Temperado',
    hot: 'Quente',

    little: 'Pouca',
    moderate: 'Moderada',
    abundant: 'Abundante',
  }

  return translations[value] || value
}

function getNebulaGradient(
  color: string | undefined,
  cloudLayer: number
) {
  const gradients: Record<string, string[]> = {
    Roxa: [
      'radial-gradient(ellipse at 35% 45%, rgba(210, 110, 255, 0.95) 0%, rgba(160, 65, 245, 0.7) 25%, rgba(100, 40, 210, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(180, 70, 255, 0.9) 0%, rgba(120, 55, 235, 0.55) 28%, rgba(70, 30, 180, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(255, 120, 210, 0.85) 0%, rgba(200, 65, 180, 0.55) 25%, rgba(130, 40, 160, 0.25) 50%, transparent 75%)',
    ],

    Azul: [
      'radial-gradient(ellipse at 35% 45%, rgba(110, 200, 255, 0.95) 0%, rgba(65, 130, 245, 0.7) 25%, rgba(40, 80, 210, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(70, 170, 255, 0.9) 0%, rgba(35, 110, 235, 0.55) 28%, rgba(15, 50, 180, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(120, 220, 255, 0.85) 0%, rgba(65, 150, 220, 0.55) 25%, rgba(40, 90, 180, 0.25) 50%, transparent 75%)',
    ],

    Vermelha: [
      'radial-gradient(ellipse at 35% 45%, rgba(255, 110, 110, 0.95) 0%, rgba(245, 65, 65, 0.7) 25%, rgba(210, 40, 40, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(255, 70, 70, 0.9) 0%, rgba(235, 35, 35, 0.55) 28%, rgba(180, 15, 15, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(255, 120, 120, 0.85) 0%, rgba(220, 65, 65, 0.55) 25%, rgba(180, 40, 40, 0.25) 50%, transparent 75%)',
    ],

    Rosa: [
      'radial-gradient(ellipse at 35% 45%, rgba(255, 110, 200, 0.95) 0%, rgba(245, 65, 160, 0.7) 25%, rgba(210, 40, 120, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(255, 70, 180, 0.9) 0%, rgba(235, 35, 130, 0.55) 28%, rgba(180, 15, 90, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(255, 150, 220, 0.85) 0%, rgba(220, 80, 170, 0.55) 25%, rgba(180, 40, 130, 0.25) 50%, transparent 75%)',
    ],

    Verde: [
      'radial-gradient(ellipse at 35% 45%, rgba(110, 255, 180, 0.95) 0%, rgba(65, 245, 130, 0.7) 25%, rgba(40, 210, 90, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(70, 255, 150, 0.9) 0%, rgba(35, 235, 100, 0.55) 28%, rgba(15, 180, 60, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(150, 255, 200, 0.85) 0%, rgba(80, 220, 140, 0.55) 25%, rgba(40, 180, 90, 0.25) 50%, transparent 75%)',
    ],
  }

  const fallback = gradients['Roxa']!
  const selected = gradients[color || 'Roxa'] ?? fallback

  return selected[cloudLayer - 1] ?? fallback[0]
}
</script>

<template>
  <main class="object-view">
    <header class="navbar">
      <div class="logo">ALTERRA</div>

      <nav>
        <a href="/explorar">Explorar</a>

        <span v-if="userStore.isLoggedIn" class="points">
          ⭐ {{ userStore.user?.points || 0 }} pontos
        </span>

        <a
          v-if="userStore.isLoggedIn"
          href="#"
          @click.prevent="userStore.logout()"
        >
          Sair
        </a>

        <a v-else href="/login">
          Entrar
        </a>
      </nav>
    </header>

    <section v-if="object" class="content">
      <button
        class="back-button"
        type="button"
        @click="router.push('/explorar')"
      >
        ← Voltar para exploração
      </button>

      <div class="object-detail">
        <div class="object-visual">

          <!-- ESTRELA -->
          <div
            v-if="object.type === 'star'"
            class="detail-star"
            :class="[
              `detail-star-${object.starSize?.toLowerCase().replaceAll(' ', '-')}`,
              `detail-star-${object.starColor?.toLowerCase()}`,
              `detail-star-${object.starLuminosity?.toLowerCase()}`,
            ]"
          >
            <div
              class="detail-star-surface"
              :class="`detail-star-temperature-${object.starTemperature?.toLowerCase()}`"
            ></div>
          </div>

          <!-- BURACO NEGRO -->
          <div
            v-else-if="object.type === 'black-hole'"
            class="black-hole-preview"
          >
            <div
              class="black-hole"
              :class="[
                `black-hole-${object.starSize?.toLowerCase().replaceAll(' ', '-')}`,
                `black-hole-${object.starTemperature?.toLowerCase()}`,
                `black-hole-disk-${object.starLuminosity?.toLowerCase().replaceAll(' ', '-')}`,
                `black-hole-disk-${object.starColor?.toLowerCase()}`,
              ]"
            >
              <div class="black-hole-disk"></div>
              <div class="black-hole-core"></div>
            </div>
          </div>

          <!-- NEBULOSA -->
          <div
            v-else-if="object.type === 'nebula'"
            class="explore-nebula-preview"
          >
            <div
              class="explore-nebula"
              :class="[
                `explore-nebula-${object.nebulaSize?.toLowerCase()}`,
                `explore-nebula-${object.nebulaIntensity?.toLowerCase()}`,
                `explore-nebula-type-${object.nebulaType?.toLowerCase()}`,
              ]"
            >
              <div
                class="explore-nebula-cloud explore-nebula-cloud-one"
                :style="{
                  background: getNebulaGradient(object.nebulaColor, 1)
                }"
              ></div>

              <div
                class="explore-nebula-cloud explore-nebula-cloud-two"
                :style="{
                  background: getNebulaGradient(object.nebulaColor, 2)
                }"
              ></div>

              <div
                class="explore-nebula-cloud explore-nebula-cloud-three"
                :style="{
                  background: getNebulaGradient(object.nebulaColor, 3)
                }"
              ></div>

              <div class="explore-nebula-stars"></div>
            </div>
          </div>

          <!-- ÓRBITAS DOS PLANETAS -->
          <div
            v-if="object.type === 'star' && orbitingPlanets.length"
            class="planet-orbits"
          >
            <div
              v-for="(planet, index) in orbitingPlanets"
              :key="planet.id"
              class="planet-orbit"
              :class="`planet-orbit-${index % 4}`"
            >
              <div class="orbit-path"></div>

              <div class="orbiting-planet-wrapper">
                <span
                  class="orbiting-planet"
                  :class="`orbiting-planet-${planet.planetColor?.toLowerCase()}`"
                ></span>

                <div class="orbit-planet-tooltip">
                  <strong>{{ planet.name }}</strong>

                  <button
                    type="button"
                    @click.stop="router.push(`/planeta/${planet.id}`)"
                  >
                    Visitar planeta →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="object-info">
          <span class="object-type">
            {{
              object.type === 'star'
                ? 'ESTRELA'
                : object.type === 'black-hole'
                  ? 'BURACO NEGRO'
                  : 'NEBULOSA'
            }}
          </span>

          <h1>{{ object.name }}</h1>

          <p v-if="object.description" class="description">
            {{ object.description }}
          </p>

          <!-- Características da estrela -->
          <div
            v-if="object.type === 'star'"
            class="characteristics"
          >
            <div>
              <span>Tipo</span>
              <strong>{{ object.starType }}</strong>
            </div>

            <div>
              <span>Cor</span>
              <strong>{{ object.starColor }}</strong>
            </div>

            <div>
              <span>Tamanho</span>
              <strong>{{ object.starSize }}</strong>
            </div>

            <div>
              <span>Temperatura</span>
              <strong>{{ object.starTemperature }}</strong>
            </div>

            <div>
              <span>Luminosidade</span>
              <strong>{{ object.starLuminosity }}</strong>
            </div>
          </div>
          <!-- CURIOSIDADE DA ESTRELA -->
<div
  v-if="object.type === 'star'"
  class="nebula-fact"
>
  <span class="nebula-fact-label">VOCÊ SABIA?</span>

  <h3>Curiosidade sobre estrelas</h3>

  <p>
    As estrelas são enormes esferas de plasma mantidas unidas pela
    gravidade. Elas produzem energia por meio de reações de fusão nuclear
    em seus núcleos, liberando luz e calor para o espaço.
  </p>
</div>

          <!-- Características da nebulosa -->
          <div
            v-if="object.type === 'nebula'"
            class="characteristics"
          >
            <div>
              <span>Tipo</span>
              <strong>{{ object.nebulaType }}</strong>
            </div>

            <div>
              <span>Cor</span>
              <strong>{{ object.nebulaColor }}</strong>
            </div>

            <div>
              <span>Tamanho</span>
              <strong>{{ object.nebulaSize }}</strong>
            </div>

            <div>
              <span>Intensidade</span>
              <strong>{{ object.nebulaIntensity }}</strong>
            </div>
          </div>
          <!-- Características do buraco negro -->
<div
  v-if="object.type === 'black-hole'"
  class="characteristics"
>
  <div>
    <span>Tipo</span>
    <strong>{{ object.starType }}</strong>
  </div>

  <div>
    <span>Cor</span>
    <strong>{{ object.starColor }}</strong>
  </div>

  <div>
    <span>Tamanho</span>
    <strong>{{ object.starSize }}</strong>
  </div>

  <div>
    <span>Temperatura</span>
    <strong>{{ object.starTemperature }}</strong>
  </div>

  <div>
    <span>Luminosidade</span>
    <strong>{{ object.starLuminosity }}</strong>
  </div>
</div>
<!-- CURIOSIDADE DA NEBULOSA -->
<div
  v-if="object.type === 'nebula'"
  class="nebula-fact"
>
  <span class="nebula-fact-label">VOCÊ SABIA?</span>

  <h3>Curiosidade sobre nebulosas</h3>

  <p>
    Nebulosas são enormes regiões de gás e poeira no espaço.
    Algumas são locais onde novas estrelas nascem, enquanto outras
    são formadas pelos restos de estrelas que chegaram ao fim de suas vidas.
  </p>
</div>

<!-- CURIOSIDADE DO BURACO NEGRO -->
<div
  v-if="object.type === 'black-hole'"
  class="nebula-fact"
>
  <span class="nebula-fact-label">VOCÊ SABIA?</span>

  <h3>Curiosidade sobre buracos negros</h3>

  <p>
    Um buraco negro possui uma região chamada horizonte de eventos,
    onde a gravidade é tão intensa que, depois de ultrapassá-la,
    nem mesmo a luz consegue escapar.
  </p>
</div>

          <p class="creator">
            Criado por <strong>{{ object.creatorName }}</strong>
          </p>

          <!-- Seção de Órbita -->
          <div
            v-if="object.type === 'star' && userStore.isLoggedIn"
            class="orbit-section"
          >
            <h2>Planetas em órbita</h2>

            <div v-if="userPlanets.length">
              <p>
                Escolha um dos seus planetas para colocá-lo em órbita desta estrela.
              </p>

              <div class="orbit-planets">
                <button
                  v-for="planet in userPlanets"
                  :key="planet.id"
                  type="button"
                  class="orbit-planet"
                  @click="addPlanetToOrbit(planet.id)"
                >
                  <span class="mini-planet"></span>

                  <span class="orbit-planet-info">
                    <strong>{{ planet.name }}</strong>

                    <small>
                      {{ translate(planet.temperature) }} ·
                      {{ translate(planet.size) }}
                    </small>
                  </span>

                  <span class="orbit-action">
                    Colocar em órbita
                    <span>→</span>
                  </span>
                </button>
              </div>
            </div>

            <p v-else class="no-planets">
              Você não possui planetas disponíveis para colocar em órbita.
            </p>

            <!-- Planetas já em órbita -->
            <div
              v-if="orbitingPlanets.length"
              class="orbiting-section"
            >
              <h3>Já em órbita</h3>

              <div class="orbit-planets">
                <div
                  v-for="planet in orbitingPlanets"
                  :key="planet.id"
                  class="orbit-planet orbiting"
                >
                  <span class="mini-planet"></span>

                  <span class="orbit-planet-info">
                    <strong>{{ planet.name }}</strong>
                    <small>Orbitando esta estrela</small>
                  </span>

                  <button
                    v-if="
                      planet.creatorId === userStore.user?.id ||
                      object.creatorId === userStore.user?.id
                    "
                    type="button"
                    class="remove-orbit"
                    @click="removePlanetFromOrbit(planet.id)"
                  >
                    Tirar da órbita
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="object.creatorId === userStore.user?.id"
            class="delete-button"
            type="button"
            @click="deleteObject"
          >
            Excluir objeto
          </button>
        </div>
      </div>
    </section>

    <section v-else class="not-found">
      <h1>Objeto não encontrado.</h1>

      <button
        type="button"
        @click="router.push('/explorar')"
      >
        Voltar para exploração
      </button>
    </section>
  </main>
</template>

<style scoped>
.object-view {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

.navbar {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  background: rgba(8, 11, 26, 0.5);
  border-bottom: 1px solid rgba(174, 181, 208, 0.1);
  backdrop-filter: blur(10px);
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
}

nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

nav a {
  color: var(--color-text-secondary);
  transition: 0.2s ease;
}

nav a:hover {
  color: white;
}

.points {
  color: var(--color-accent);
  font-weight: 600;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 30px;
}

.back-button {
  padding: 10px 16px;
  margin-bottom: 40px;
  border: 1px solid rgba(174, 181, 208, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: white;
  cursor: pointer;
}

.object-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
  align-items: center;
}

.object-visual {
  position: relative;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.object-type {
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
}

.object-info h1 {
  margin: 10px 0 15px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 52px;
}

.description {
  color: #b8bdd6;
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 30px;
}

.characteristics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 30px;
}

.characteristics div {
  padding: 15px;
  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.035);
}

.characteristics span {
  display: block;
  margin-bottom: 5px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.characteristics strong {
  font-size: 15px;
}

/* CURIOSIDADE DA NEBULOSA */

.nebula-fact {
  margin-top: 30px;
  padding: 24px;
  border-radius: 16px;
  background: rgba(124, 92, 255, 0.08);
  border: 1px solid rgba(124, 92, 255, 0.25);
}

.nebula-fact-label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.nebula-fact h3 {
  margin: 0 0 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
}

.nebula-fact p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.creator {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.creator strong {
  color: white;
}

.delete-button {
  width: 100%;
  padding: 13px;
  border: 1px solid rgba(255, 99, 99, 0.3);
  border-radius: 10px;
  background: rgba(255, 99, 99, 0.08);
  color: #ff9999;
  cursor: pointer;
  transition: 0.2s ease;
  margin-top: 20px;
}

.delete-button:hover {
  background: rgba(255, 99, 99, 0.15);
}

.orbit-section {
  margin-top: 35px;
  padding-top: 30px;
  border-top: 1px solid rgba(174, 181, 208, 0.1);
}

.orbit-section h2 {
  margin: 0 0 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
}

.orbit-section h3 {
  margin: 20px 0 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
}

.orbit-section > p,
.orbit-section > div > p {
  margin: 0 0 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.orbit-planets {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.orbit-planet {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  color: white;
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
}

.orbit-planet:hover {
  transform: translateX(5px);
  border-color: rgba(77, 217, 255, 0.35);
  background: rgba(77, 217, 255, 0.06);
}

.orbit-planet.orbiting {
  cursor: default;
}

.orbit-planet.orbiting:hover {
  transform: none;
  border-color: rgba(174, 181, 208, 0.12);
  background: rgba(255, 255, 255, 0.035);
}

.mini-planet {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    #ffffff 0%,
    #7c5cff 30%,
    #4d32b8 65%,
    #21165c 100%
  );
  box-shadow:
    inset -7px -6px 12px rgba(0, 0, 0, 0.4),
    inset 4px 3px 7px rgba(255, 255, 255, 0.15);
}

.orbit-planet-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.orbit-planet-info strong {
  font-size: 15px;
}

.orbit-planet-info small {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.orbit-action {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.orbit-action span {
  font-size: 16px;
  transition: 0.2s ease;
}

.orbit-planet:hover .orbit-action span {
  transform: translateX(4px);
}

.remove-orbit {
  margin-left: auto;
  padding: 8px 12px;
  border: 1px solid rgba(255, 99, 99, 0.3);
  border-radius: 8px;
  background: rgba(255, 99, 99, 0.08);
  color: #ff9999;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  white-space: nowrap;
}

.remove-orbit:hover {
  background: rgba(255, 99, 99, 0.15);
}

.no-planets {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.planet-orbits {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.planet-orbit {
  position: absolute;
  width: 430px;
  height: 430px;
  border-radius: 50%;
  animation: orbit-spin 18s linear infinite;
  pointer-events: none;
}

.planet-orbit-1 {
  width: 520px;
  height: 520px;
  animation-duration: 25s;
}

.planet-orbit-2 {
  width: 610px;
  height: 610px;
  animation-duration: 32s;
}

.planet-orbit-3 {
  width: 700px;
  height: 700px;
  animation-duration: 40s;
}

.orbit-path {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(174, 181, 208, 0.18);
  border-radius: 50%;
}

.orbiting-planet-wrapper {
  position: absolute;
  top: 50%;
  left: -9px;

  width: 155px;
  height: 75px;

  cursor: pointer;
  pointer-events: auto;
}

.orbiting-planet {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;

  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #7c5cff 35%,
      #302080 75%
    );

  box-shadow:
    inset -3px -3px 6px rgba(0, 0, 0, 0.45),
    inset 2px 2px 3px rgba(255, 255, 255, 0.2);

  transition: transform 0.2s ease;
}

.orbiting-planet-wrapper:hover .orbiting-planet {
  transform: scale(1.35);
}

.orbit-planet-tooltip {
  position: absolute;
  left: 50%;
  bottom: 35px;

  width: 155px;
  padding: 10px 12px;

  display: flex;
  flex-direction: column;
  gap: 7px;

  border: 1px solid rgba(174, 181, 208, 0.18);
  border-radius: 10px;

  background: rgba(8, 11, 26, 0.98);
  backdrop-filter: blur(10px);

  opacity: 0;
  visibility: hidden;

  transform: translateX(-50%);

  z-index: 9999;

  pointer-events: none;
}

.orbiting-planet-wrapper:hover .orbit-planet-tooltip {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.orbit-planet-tooltip strong {
  display: block;

  color: white;
  font-size: 13px;
  text-align: center;
  white-space: nowrap;
}

.orbit-planet-tooltip button {
  position: relative;
  z-index: 10000;

  width: 100%;
  padding: 8px;

  border: 0;
  border-radius: 7px;

  background: rgba(124, 92, 255, 0.2);
  color: var(--color-accent);

  font-size: 11px;
  font-weight: 600;

  cursor: pointer;
  pointer-events: auto;
}

.orbit-planet-tooltip button:hover {
  background: rgba(124, 92, 255, 0.35);
}

@keyframes orbit-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.planet-orbit:hover {
  animation-play-state: paused;
}

.planet-orbit:hover .orbiting-planet-wrapper {
  animation-play-state: paused;
}

@keyframes planet-counter-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

/* ESTRELA */

.detail-star {
  position: relative;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(
    circle at 35% 30%,
    #ffffff 0%,
    #fff4bd 18%,
    #ffd45c 45%,
    #ff9f2f 72%,
    #d85b22 100%
  );
  box-shadow:
    0 0 60px rgba(255, 220, 120, 0.45),
    0 0 140px rgba(255, 190, 80, 0.2),
    inset -30px -25px 55px rgba(80, 20, 0, 0.35),
    inset 20px 15px 35px rgba(255, 255, 255, 0.18);
}

.detail-star-pequena {
  width: 280px;
  height: 280px;
}

.detail-star-média {
  width: 330px;
  height: 330px;
}

.detail-star-grande {
  width: 380px;
  height: 380px;
}

.detail-star-gigante {
  width: 440px;
  height: 440px;
}

.detail-star-vermelha {
  background: radial-gradient(
    circle at 35% 30%,
    #fff0d8,
    #ffb060 35%,
    #d94830 70%,
    #7d211b
  );
  box-shadow:
    0 0 60px rgba(255, 70, 50, 0.55),
    0 0 140px rgba(220, 50, 40, 0.25),
    inset -30px -25px 55px rgba(80, 20, 0, 0.35),
    inset 20px 15px 35px rgba(255, 255, 255, 0.18);
}

.detail-star-laranja {
  background: radial-gradient(
    circle at 35% 30%,
    #fff5d0,
    #ffc15a 35%,
    #ff762c 70%,
    #a52d1c
  );
  box-shadow:
    0 0 60px rgba(255, 130, 45, 0.55),
    0 0 140px rgba(255, 90, 30, 0.25),
    inset -30px -25px 55px rgba(80, 20, 0, 0.35),
    inset 20px 15px 35px rgba(255, 255, 255, 0.18);
}

.detail-star-amarela {
  background: radial-gradient(
    circle at 35% 30%,
    #ffffff,
    #fff2a3 30%,
    #ffd23f 65%,
    #d9821f
  );
  box-shadow:
    0 0 60px rgba(255, 220, 70, 0.55),
    0 0 140px rgba(255, 190, 40, 0.25),
    inset -30px -25px 55px rgba(80, 20, 0, 0.35),
    inset 20px 15px 35px rgba(255, 255, 255, 0.18);
}

.detail-star-branca {
  background: radial-gradient(
    circle at 35% 30%,
    #ffffff,
    #e9f5ff 40%,
    #b7d7ff 70%,
    #6c8fc5
  );
  box-shadow:
    0 0 60px rgba(210, 235, 255, 0.55),
    0 0 140px rgba(150, 200, 255, 0.25),
    inset -30px -25px 55px rgba(30, 50, 80, 0.35),
    inset 20px 15px 35px rgba(255, 255, 255, 0.18);
}

.detail-star-azul {
  background: radial-gradient(
    circle at 35% 30%,
    #ffffff,
    #b9eaff 30%,
    #4ab8ff 65%,
    #2354c7
  );
  box-shadow:
    0 0 60px rgba(70, 180, 255, 0.55),
    0 0 140px rgba(40, 120, 255, 0.25),
    inset -30px -25px 55px rgba(10, 30, 80, 0.35),
    inset 20px 15px 35px rgba(255, 255, 255, 0.18);
}

.detail-star-surface {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
      circle at 30% 25%,
      rgba(255, 255, 255, 0.5),
      transparent 25%
    ),
    radial-gradient(
      circle at 70% 65%,
      rgba(130, 50, 20, 0.25),
      transparent 30%
    );
  box-shadow:
    inset -25px -20px 35px rgba(80, 20, 0, 0.35),
    inset 15px 10px 25px rgba(255, 255, 255, 0.18);
}

.detail-star-temperature-baixa {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 170, 100, 0.15),
    transparent 45%
  );
}

.detail-star-temperature-moderada {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 220, 150, 0.22),
    transparent 45%
  );
}

.detail-star-temperature-alta {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 245, 210, 0.35),
    transparent 48%
  );
}

.detail-star-temperature-extrema {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.55),
    transparent 50%
  );
}

.detail-placeholder {
  font-size: 180px;
}

.not-found {
  padding: 100px 30px;
  text-align: center;
}

.not-found button {
  margin-top: 20px;
  padding: 12px 20px;
  border: 0;
  border-radius: 10px;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
}

@media (max-width: 800px) {
  .navbar {
    padding: 0 20px;
  }

  .object-detail {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .object-visual {
    min-height: 350px;
  }

  .object-info h1 {
    font-size: 40px;
  }

  .detail-star-gigante {
    width: 300px;
    height: 300px;
  }
}

/* =================================
   BURACO NEGRO - DETALHES
================================= */

.black-hole-preview {
  width: 100%;
  min-height: 500px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;
}

.black-hole {
  position: relative;

  width: 360px;
  height: 360px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
}

/* TAMANHOS */

.black-hole-pequeno {
  transform: scale(0.7);
}

.black-hole-médio {
  transform: scale(0.85);
}

.black-hole-grande {
  transform: scale(1);
}

.black-hole-gigante {
  transform: scale(1.2);
}

/* DISCO DE ACREÇÃO */

.black-hole-disk {
  position: absolute;

  width: 100%;
  height: 42%;

  border-radius: 50%;

  transform: rotate(-12deg);

  background:
    radial-gradient(
      ellipse at center,
      transparent 0 24%,
      rgba(255, 255, 255, 0.9) 27%,
      rgba(255, 150, 50, 0.95) 40%,
      rgba(255, 70, 20, 0.8) 55%,
      transparent 72%
    );

  filter: blur(1px);
}

/* NÚCLEO */

.black-hole-core {
  position: absolute;

  width: 150px;
  height: 150px;

  border-radius: 50%;

  background: #000;

  z-index: 2;

  box-shadow:
    0 0 25px rgba(0, 0, 0, 0.95),
    0 0 55px rgba(0, 0, 0, 0.8);
}

/* INTENSIDADE DO DISCO */

.black-hole-disk-sem-disco .black-hole-disk {
  display: none;
}

.black-hole-disk-fraco .black-hole-disk {
  opacity: 0.45;
  transform: rotate(-12deg) scale(0.85);
}

.black-hole-disk-moderado .black-hole-disk {
  opacity: 0.75;
}

.black-hole-disk-intenso .black-hole-disk {
  opacity: 1;
  transform: rotate(-12deg) scale(1.12);
}

/* CORES */

.black-hole-disk-vermelho .black-hole-disk {
  background:
    radial-gradient(
      ellipse at center,
      transparent 0 24%,
      rgba(255, 220, 220, 0.9) 27%,
      rgba(255, 70, 50, 0.95) 42%,
      rgba(170, 20, 20, 0.8) 58%,
      transparent 74%
    );
}

.black-hole-disk-laranja .black-hole-disk {
  background:
    radial-gradient(
      ellipse at center,
      transparent 0 24%,
      rgba(255, 245, 210, 0.9) 27%,
      rgba(255, 150, 50, 0.95) 42%,
      rgba(210, 70, 20, 0.8) 58%,
      transparent 74%
    );
}

.black-hole-disk-amarelo .black-hole-disk {
  background:
    radial-gradient(
      ellipse at center,
      transparent 0 24%,
      rgba(255, 255, 240, 0.95) 27%,
      rgba(255, 220, 60, 0.95) 42%,
      rgba(220, 150, 20, 0.8) 58%,
      transparent 74%
    );
}

.black-hole-disk-branco .black-hole-disk {
  background:
    radial-gradient(
      ellipse at center,
      transparent 0 24%,
      rgba(255, 255, 255, 0.98) 27%,
      rgba(220, 240, 255, 0.95) 42%,
      rgba(150, 190, 230, 0.8) 58%,
      transparent 74%
    );
}

/* =================================
   NEBULOSA - MESMO VISUAL DO EXPLORAR
================================= */

.explore-nebula-preview {
  width: 100%;
  min-height: 500px;
  margin: 0 0 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.explore-nebula {
  position: relative;
  width: 230px;
  height: 170px;
  transform: rotate(-8deg);
  transition:
    transform 0.35s ease,
    filter 0.35s ease;
}

/* TAMANHO */

.explore-nebula-pequena {
  transform: rotate(-8deg) scale(0.75);
}

.explore-nebula-média {
  transform: rotate(-8deg) scale(0.9);
}

.explore-nebula-grande {
  transform: rotate(-8deg) scale(1);
}

.explore-nebula-gigante {
  transform: rotate(-8deg) scale(1.15);
}

/* INTENSIDADE */

.explore-nebula-fraca {
  filter: saturate(0.75) brightness(0.75);
}

.explore-nebula-moderada {
  filter: saturate(1) brightness(1);
}

.explore-nebula-intensa {
  filter: saturate(1.35) brightness(1.2);
}

/* NUVENS */

.explore-nebula-cloud {
  position: absolute;
  border-radius: 45% 55% 60% 40% / 55% 45% 50% 50%;
  filter: blur(15px);
  mix-blend-mode: screen;
  transition:
    background 0.35s ease,
    opacity 0.35s ease,
    filter 0.35s ease;
}

.explore-nebula-cloud-one {
  width: 95%;
  height: 80%;
  top: 8%;
  left: -5%;
  transform: rotate(12deg);
}

.explore-nebula-cloud-two {
  width: 80%;
  height: 75%;
  right: -10%;
  bottom: -5%;
  transform: rotate(-18deg);
}

.explore-nebula-cloud-three {
  width: 70%;
  height: 55%;
  left: 17%;
  top: 22%;
  transform: rotate(8deg);
}

/* FAIXA DE POEIRA */

.explore-nebula::before {
  content: '';
  position: absolute;
  width: 130%;
  height: 55%;
  left: -15%;
  top: 22%;
  border-radius: 50%;
  transform: rotate(-12deg);
  background:
    repeating-radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.08) 0 2px,
      transparent 3px 9px
    );
  filter: blur(3px);
  opacity: 0.8;
  pointer-events: none;
}

/* BRILHO CENTRAL */

.explore-nebula::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 75%;
  left: 0;
  top: 12%;
  background:
    radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.18),
      transparent 45%
    ),
    radial-gradient(
      ellipse at 30% 40%,
      rgba(255, 255, 255, 0.12),
      transparent 35%
    );
  filter: blur(8px);
  opacity: 0.7;
  pointer-events: none;
}

/* ESTRELAS */

.explore-nebula-stars {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 12% 20%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 25% 70%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 38% 30%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 52% 78%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 64% 25%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 75% 58%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 88% 35%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 82% 82%, white 0 1px, transparent 1.5px),
    radial-gradient(circle at 47% 50%, white 0 1px, transparent 1.5px);
  opacity: 0.8;
}
</style>