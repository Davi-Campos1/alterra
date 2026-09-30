```vue
<template>
  <main class="planet-page">
    <header class="navbar">
      <div class="logo">ALTERRA</div>

      <nav>
        <a href="/explorar">Explorar</a>
        <a href="/">Início</a>
      </nav>
    </header>

    <section v-if="planet" class="planet-content">
      <!-- PLANETA -->
      <div class="planet-visual">
        <div
          class="planet"
          :class="[
            `water-${planet.waterLevel}`,
            `land-${planet.continentStyle}`,
            `land-qty-${planet.landAmount}`,
            `land-tex-${planet.landTexture}`,
            `atmo-tex-${planet.atmosphereTexture}`,
            { 'has-atmosphere': planet.hasAtmosphere }
          ]"
          :style="{
            background: planet.planetColor,
            '--atmosphere-color': planet.atmosphereColor,
            '--atmosphere-opacity': planet.atmosphereOpacity / 100
          }"
        >
          <div class="ocean"></div>

          <div
            v-for="n in 6"
            :key="n"
            :class="['continent', `continent-${n}`]"
            :style="{ backgroundColor: planet.landColor }"
          ></div>

          <div
            v-if="planet.hasAtmosphere"
            class="atmosphere"
          ></div>

          <div class="planet-shadow"></div>
        </div>
      </div>

      <!-- INFORMAÇÕES -->
      <div class="planet-details">
        <span class="subtitle">PLANETA</span>

        <h1>{{ planet.name }}</h1>

        <p v-if="planet.demonym" class="demonym">
          {{ planet.demonym }}
        </p>

        <p v-if="planet.description" class="description">
          {{ planet.description }}
        </p>

        <!-- CARACTERÍSTICAS -->
        <div class="info-grid">
          <div class="info">
            <span>Tamanho</span>
            <strong>{{ translate(planet.size) }}</strong>
          </div>

          <div class="info">
            <span>Temperatura</span>
            <strong>{{ translate(planet.temperature) }}</strong>
          </div>

          <div class="info">
            <span>Água</span>
            <strong>{{ translate(planet.waterLevel) }}</strong>
          </div>

          <div class="info">
            <span>Gravidade</span>
            <strong>{{ translate(planet.gravity) }}</strong>
          </div>

          <div class="info">
            <span>Clima</span>
            <strong>{{ translate(planet.climate) }}</strong>
          </div>

          <div class="info">
            <span>Vegetação</span>
            <strong>{{ translate(planet.vegetation) }}</strong>
          </div>

          <div class="info">
            <span>Relevo</span>
            <strong>{{ translate(planet.relief) }}</strong>
          </div>

          <div class="info">
            <span>Vida</span>
            <strong>{{ translate(planet.lifeLevel) }}</strong>
          </div>

          <div class="info">
            <span>Habitantes</span>
            <strong>{{ planet.population }}</strong>
          </div>
        </div>

        <!-- HABITANTES -->
        <div
          v-if="planet.inhabitantType"
          class="section"
        >
          <h2>Habitantes</h2>

          <p>{{ planet.inhabitantType }}</p>

          <p
            v-if="planet.inhabitantCharacteristics"
          >
            {{ planet.inhabitantCharacteristics }}
          </p>
        </div>

        <!-- TECNOLOGIA -->
        <div
          v-if="planet.techLevel"
          class="section"
        >
          <h2>Tecnologia</h2>

          <p>
            {{ translate(planet.techLevel) }}
          </p>
        </div>

        <!-- MORAR NO PLANETA -->
        <div class="residency">
  <p class="residency-info">
    {{ planet.population }} habitantes vivem neste planeta.
  </p>

  <button
    v-if="!isResident"
    class="live-button"
    @click="liveOnPlanet"
  >
    Morar neste planeta
  </button>

  <div
    v-else
    class="residency-actions"
  >
    <div class="already-resident">
      Você mora neste planeta.
    </div>

    <button
      class="leave-button"
      @click="leavePlanet"
    >
      Sair deste planeta
    </button>
  </div>
</div>

        <!-- VOLTAR -->
        <button
          class="back-button"
          @click="router.push('/explorar')"
        >
          Voltar para explorar
        </button>
      </div>
    </section>

    <!-- PLANETA NÃO ENCONTRADO -->
    <section
      v-else
      class="not-found"
    >
      <h1>Planeta não encontrado</h1>

      <button
        @click="router.push('/explorar')"
      >
        Voltar para explorar
      </button>
    </section>
  </main>
</template>

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanetStore } from '../stores/planet'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()

const planetStore = usePlanetStore()
const userStore = useUserStore()

const planet = computed(() =>
  planetStore.getPlanetById(route.params.id as string)
)

const loggedUser = computed(() => userStore.user)

const isResident = computed(() => {
  if (!planet.value || !loggedUser.value) {
    return false
  }

  const residents = planet.value.residents || []

  return residents.includes(loggedUser.value.id)
})

function liveOnPlanet() {
  if (!planet.value || !loggedUser.value) {
    router.push('/login')
    return
  }

  if (!planet.value.residents) {
    planet.value.residents = []
  }

  if (!planet.value.pointsAwardedTo) {
    planet.value.pointsAwardedTo = []
  }

  if (planet.value.residents.includes(loggedUser.value.id)) {
    return
  }

  planet.value.residents.push(loggedUser.value.id)
  planet.value.population += 1

  // Só dá os 10 pontos na PRIMEIRA vez
  if (!planet.value.pointsAwardedTo.includes(loggedUser.value.id)) {
    planet.value.pointsAwardedTo.push(loggedUser.value.id)

    const savedUsers = localStorage.getItem('alterra-users')

    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers)

        const creator = users.find(
          (user: {
            id: string
            name: string
            email: string
            password: string
            points?: number
          }) => user.id === planet.value?.creatorId
        )

        if (creator) {
          creator.points = (creator.points || 0) + 10

          localStorage.setItem(
            'alterra-users',
            JSON.stringify(users)
          )

          if (userStore.user?.id === creator.id) {
            userStore.setUser(creator)
          }
        }
      } catch {
        console.error('Erro ao atualizar os pontos do criador.')
      }
    }
  }

  planetStore.savePlanets()
}
function leavePlanet() {
  if (!planet.value || !loggedUser.value) {
    return
  }

  if (!planet.value.residents) {
    return
  }

  const index = planet.value.residents.indexOf(
    loggedUser.value.id
  )

  if (index === -1) {
    return
  }

  planet.value.residents.splice(index, 1)

  if (planet.value.population > 0) {
    planet.value.population -= 1
  }

  // IMPORTANTE:
  // pointsAwardedTo NÃO é alterado.
  // Portanto, se voltar depois, não ganha +10 novamente.

  planetStore.savePlanets()
} 
function translate(value: string) {
  const translations: Record<string, string> = {
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
    giant: 'Gigante',

    freezing: 'Congelado',
    frozen: 'Gélido',
    cold: 'Frio',
    temperate: 'Temperado',
    hot: 'Quente',
    volcanic: 'Vulcânico',

    none: 'Nenhuma',
    low: 'Baixa',
    high: 'Alta',
    normal: 'Normal',
    extreme: 'Extremo',

    arid: 'Árido',
    tropical: 'Tropical',
    rainy: 'Chuvoso',
    boreal: 'Boreal',

    little: 'Pouca',
    moderate: 'Moderada',
    abundant: 'Abundante',

    plains: 'Planícies',
    mountains: 'Montanhoso',
    craters: 'Crateras',
    varied: 'Variado',

    simple: 'Simples',
    tribal: 'Tribal',
    industrial: 'Industrial',
    advanced: 'Avançada',
  }

  return translations[value] || value
}
</script>
```


<style scoped>
.planet-page {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

/* NAVBAR */

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
  gap: 30px;
}

nav a {
  color: var(--color-text-secondary);
  transition: 0.2s ease;
}

nav a:hover {
  color: white;
}

/* CONTEÚDO */

.planet-content {
  max-width: 1200px;
  margin: 0 auto;

  padding: 70px 30px;

  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 80px;

  align-items: center;
}

/* PLANETA */

.planet-visual {
  display: flex;
  justify-content: center;
}

.planet {
  position: relative;
  overflow: hidden;

  width: 420px;
  height: 420px;

  margin: 0 auto;

  border-radius: 50%;

  transition:
    background 0.4s ease,
    transform 0.4s ease;
}

/* ÁGUA */

.ocean {
  position: absolute;
  inset: 0;

  z-index: 2;

  pointer-events: none;

  background:
    radial-gradient(
      circle at 35% 30%,
      rgba(255, 255, 255, 0.12),
      transparent 35%
    ),
    radial-gradient(
      circle at 65% 70%,
      rgba(0, 80, 140, 0.28),
      transparent 50%
    );

  mix-blend-mode: multiply;
}

/* CONTINENTES */

.continent {
  position: absolute;

  z-index: 4;

  display: none;

  transition:
    transform 0.4s ease,
    background-color 0.4s ease;
}

.planet.land-qty-none .continent {
  display: none !important;
}

/* TEXTURAS */

.planet.land-tex-forest .continent {
  background-image:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.12),
      transparent 25%
    ),
    radial-gradient(
      circle at 70% 70%,
      rgba(0, 0, 0, 0.18),
      transparent 35%
    );
}

.planet.land-tex-flat .continent {
  background-image:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.08),
      transparent 45%
    );
}

.planet.land-tex-mountains .continent {
  background-image:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0px,
      rgba(255, 255, 255, 0.12) 3px,
      transparent 3px,
      transparent 8px
    );
}

.planet.land-tex-craters .continent {
  background-image:
    radial-gradient(
      circle at 25% 35%,
      rgba(0, 0, 0, 0.2) 0 8%,
      transparent 9%
    ),
    radial-gradient(
      circle at 70% 65%,
      rgba(0, 0, 0, 0.18) 0 10%,
      transparent 11%
    );
}

/* FORMATOS */

.planet.land-continental .continent {
  border-radius:
    42% 58% 48% 52% /
    55% 42% 58% 45%;
}

.planet.land-ilhas .continent {
  border-radius:
    55% 45% 60% 40% /
    45% 55% 42% 58%;
}

.planet.land-fragmentada .continent {
  border-radius:
    25% 65% 35% 70% /
    55% 30% 65% 40%;
}

/* CONTINENTES */

.land-continental .continent-1 {
  width: 170px;
  height: 130px;
  top: 48px;
  left: 38px;

  clip-path: polygon(
    5% 35%,
    20% 10%,
    45% 18%,
    65% 5%,
    90% 25%,
    82% 50%,
    95% 70%,
    65% 92%,
    40% 75%,
    18% 88%,
    2% 60%
  );
}

.land-continental .continent-2 {
  width: 140px;
  height: 175px;
  top: 135px;
  right: 38px;

  clip-path: polygon(
    20% 5%,
    55% 12%,
    85% 30%,
    72% 50%,
    92% 70%,
    60% 95%,
    35% 78%,
    10% 85%,
    5% 55%,
    20% 35%
  );
}

.land-continental .continent-3 {
  width: 185px;
  height: 110px;
  bottom: 38px;
  left: 55px;

  clip-path: polygon(
    5% 40%,
    20% 18%,
    45% 25%,
    60% 5%,
    82% 20%,
    98% 45%,
    80% 65%,
    65% 90%,
    40% 75%,
    20% 95%,
    5% 70%
  );
}

.land-continental .continent-4 {
  width: 100px;
  height: 110px;
  top: 38px;
  right: 75px;

  clip-path: polygon(
    20% 5%,
    60% 10%,
    90% 30%,
    75% 55%,
    90% 80%,
    50% 95%,
    25% 75%,
    5% 50%,
    15% 25%
  );
}

.land-continental .continent-5 {
  width: 150px;
  height: 95px;
  bottom: 65px;
  right: 48px;

  clip-path: polygon(
    10% 20%,
    40% 5%,
    80% 15%,
    95% 45%,
    85% 80%,
    50% 90%,
    15% 75%,
    5% 50%
  );
}

.land-continental .continent-6 {
  width: 110px;
  height: 85px;
  top: 210px;
  left: 160px;

  clip-path: polygon(
    20% 10%,
    60% 15%,
    90% 40%,
    75% 85%,
    35% 95%,
    5% 60%
  );
}

/* ILHAS */

.land-ilhas .continent-1 {
  width: 55px;
  height: 45px;
  top: 55px;
  left: 55px;

  clip-path: polygon(
    10% 40%,
    30% 10%,
    65% 20%,
    90% 50%,
    65% 85%,
    30% 90%,
    5% 60%
  );
}

.land-ilhas .continent-2 {
  width: 44px;
  height: 37px;
  top: 120px;
  left: 140px;

  clip-path: polygon(
    15% 25%,
    50% 5%,
    90% 35%,
    75% 80%,
    35% 95%,
    5% 60%
  );
}

.land-ilhas .continent-3 {
  width: 65px;
  height: 52px;
  bottom: 75px;
  left: 84px;

  clip-path: polygon(
    15% 30%,
    50% 10%,
    85% 25%,
    95% 60%,
    60% 90%,
    10% 75%
  );
}

.land-ilhas .continent-4 {
  width: 47px;
  height: 41px;
  top: 92px;
  right: 75px;

  clip-path: polygon(
    20% 20%,
    60% 0%,
    100% 40%,
    80% 80%,
    30% 100%,
    0% 60%
  );
}

.land-ilhas .continent-5 {
  width: 52px;
  height: 59px;
  bottom: 110px;
  right: 84px;

  clip-path: polygon(
    10% 40%,
    40% 5%,
    80% 20%,
    90% 60%,
    50% 95%,
    5% 75%
  );
}

.land-ilhas .continent-6 {
  width: 37px;
  height: 33px;
  bottom: 55px;
  left: 205px;

  clip-path: polygon(
    30% 10%,
    80% 20%,
    95% 60%,
    60% 90%,
    10% 70%
  );
}

/* FRAGMENTADA */

.land-fragmentada .continent-1 {
  width: 92px;
  height: 70px;
  top: 48px;
  left: 48px;

  clip-path: polygon(
    5% 20%,
    35% 5%,
    55% 25%,
    90% 15%,
    75% 55%,
    45% 50%,
    25% 90%,
    5% 60%
  );
}

.land-fragmentada .continent-2 {
  width: 83px;
  height: 65px;
  top: 65px;
  right: 55px;

  clip-path: polygon(
    10% 30%,
    40% 0%,
    90% 25%,
    85% 70%,
    45% 100%,
    0% 65%
  );
}

.land-fragmentada .continent-3 {
  width: 102px;
  height: 74px;
  bottom: 55px;
  left: 48px;

  clip-path: polygon(
    15% 15%,
    60% 5%,
    95% 45%,
    70% 90%,
    20% 80%,
    0% 40%
  );
}

.land-fragmentada .continent-4 {
  width: 74px;
  height: 83px;
  bottom: 75px;
  right: 48px;

  clip-path: polygon(
    25% 10%,
    75% 0%,
    100% 50%,
    65% 95%,
    15% 85%,
    0% 45%
  );
}

.land-fragmentada .continent-5 {
  width: 65px;
  height: 55px;
  top: 185px;
  left: 148px;

  clip-path: polygon(
    10% 20%,
    50% 5%,
    90% 30%,
    80% 80%,
    40% 95%,
    0% 60%
  );
}

.land-fragmentada .continent-6 {
  width: 55px;
  height: 46px;
  top: 38px;
  left: 167px;

  clip-path: polygon(
    20% 10%,
    80% 15%,
    95% 60%,
    60% 95%,
    5% 70%
  );
}

/* QUANTIDADE */

.planet.land-qty-low .continent-1,
.planet.land-qty-low .continent-2 {
  display: block;
}

.planet.land-qty-medium .continent-1,
.planet.land-qty-medium .continent-2,
.planet.land-qty-medium .continent-3,
.planet.land-qty-medium .continent-4 {
  display: block;
}

.planet.land-qty-high .continent-1,
.planet.land-qty-high .continent-2,
.planet.land-qty-high .continent-3,
.planet.land-qty-high .continent-4,
.planet.land-qty-high .continent-5,
.planet.land-qty-high .continent-6 {
  display: block;
}

/* ATMOSFERA */

.atmosphere {
  position: absolute;
  inset: 0;

  z-index: 8;

  pointer-events: none;

  background-color: var(--atmosphere-color);

  opacity: var(--atmosphere-opacity);

  box-shadow:
    inset 0 0 25px rgba(255, 255, 255, 0.15);

  mix-blend-mode: overlay;
}

/* SOMBRA */

.planet-shadow {
  position: absolute;
  inset: 0;

  z-index: 10;

  pointer-events: none;

  box-shadow:
    inset -32px -25px 45px rgba(0, 0, 0, 0.65),
    inset 15px 10px 22px rgba(255, 255, 255, 0.2);
}

/* INFORMAÇÕES */

.subtitle {
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
}

.planet-details h1 {
  margin: 10px 0 5px;

  font-family: 'Space Grotesk', sans-serif;
  font-size: 56px;
}

.demonym {
  color: var(--color-text-secondary);
  font-size: 17px;
}

.description {
  color: #b8bdd6;

  font-size: 17px;
  line-height: 1.6;

  margin-bottom: 30px;
}

/* GRID */

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 12px;
}

.info {
  padding: 16px;

  border-radius: 14px;

  border: 1px solid rgba(174, 181, 208, 0.12);

  background: rgba(255, 255, 255, 0.04);
}

.info span {
  display: block;

  color: var(--color-text-secondary);

  font-size: 12px;

  margin-bottom: 6px;
}

.info strong {
  font-size: 15px;
}

/* SEÇÕES */

.section {
  margin-top: 30px;
}

.section h2 {
  font-family: 'Space Grotesk', sans-serif;

  margin-bottom: 8px;
}

.section p {
  color: #b8bdd6;

  line-height: 1.5;
}

/* MORAR */

.residency {
  margin-top: 30px;
  padding: 20px;

  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 16px;
}

.residency-info {
  margin: 0 0 16px;

  color: var(--color-text-secondary);
  font-size: 15px;
}

.live-button {
  width: 100%;
  padding: 14px;

  border: 1px solid rgba(124, 92, 255, 0.5);
  border-radius: 10px;

  background: rgba(124, 92, 255, 0.15);
  color: white;

  font-weight: 600;
  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.live-button:hover {
  background: rgba(124, 92, 255, 0.25);
  border-color: rgba(124, 92, 255, 0.8);
  transform: translateY(-2px);
}

.residency-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.already-resident {
  width: 100%;
  padding: 13px 14px;

  background: rgba(77, 217, 255, 0.07);
  border: 1px solid rgba(77, 217, 255, 0.2);
  border-radius: 10px;

  color: var(--color-accent);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}

.leave-button {
  width: 100%;
  padding: 11px 20px;

  background: rgba(255, 255, 255, 0.03);
  color: #aeb5d0;

  border: 1px solid rgba(174, 181, 208, 0.18);
  border-radius: 10px;

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.leave-button:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(174, 181, 208, 0.35);
  color: white;
  transform: translateY(-1px);
}

.leave-button:active {
  transform: translateY(0);
}
.back-button {
  width: 100%;
  margin-top: 30px;
  padding: 13px 18px;

  border: 1px solid rgba(124, 92, 255, 0.25);
  border-radius: 12px;

  background: rgba(124, 92, 255, 0.06);
  color: var(--color-text-secondary);

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.back-button:hover {
  background: rgba(124, 92, 255, 0.12);
  border-color: rgba(124, 92, 255, 0.5);
  color: white;
  transform: translateY(-1px);
}

.back-button:active {
  transform: translateY(0);
}
</style>
