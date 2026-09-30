<template>
  <main class="explore">
   <header class="navbar">
  <div class="logo">ALTERRA</div>

<nav>
  <a href="/">Início</a>

  <a href="/criar-planeta">
    Criar planeta
  </a>

  <a href="/criar-objeto">
    Criar objeto
  </a>

  <a
    v-if="userStore.isLoggedIn"
    href="/minhas-criacoes"
  >
    Minhas criações
  </a>

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

    <section class="content">
      <div class="heading">
        <span>UNIVERSO</span>
        <h1>Explore novos mundos.</h1>
        <p>
          Descubra planetas criados por outras pessoas
          e encontre um lugar para chamar de seu.
        </p>
      </div>

      <div class="planets">
  <div
    v-for="planet in planetStore.planets"
    :key="planet.id"
    class="planet-card"
  >
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
        v-for="n in 12"
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

    <h2>{{ planet.name }}</h2>

    <p
      v-if="planet.demonym"
      class="demonym"
    >
      {{ planet.demonym }}
    </p>

    <p
      v-if="planet.description"
      class="description"
    >
      {{ planet.description }}
    </p>

    <div class="planet-info">
      <span>{{ translate(planet.temperature) }}</span>
      <span>{{ translate(planet.waterLevel) }} de água</span>
      <span>{{ translate(planet.vegetation) }}</span>
    </div>

    <p class="population">
      {{ planet.population }} habitantes
    </p>

    <button
      @click="router.push(`/planeta/${planet.id}`)"
    >
      Visitar planeta
    </button>

    <button
      v-if="planet.creatorId === userStore.user?.id"
      class="delete-button"
      @click="planetStore.removePlanet(planet.id)"
    >
      Excluir planeta
    </button>
  </div>
</div>

<section
  v-if="spaceObjectStore.objects.length"
  class="space-objects"
>
  <div class="heading">
    <span>OBJETOS ESPACIAIS</span>

    <h2>Outras criações do universo.</h2>

    <p>
      Estrelas, buracos negros e nebulosas criados pelos usuários.
    </p>
  </div>

  <div class="objects-grid">
    <div
  v-for="object in spaceObjectStore.objects"
  :key="object.id"
  class="space-object-card"
  @click="router.push(`/objeto/${object.id}`)"
>
      <div
  v-if="object.type === 'star'"
  class="explore-star"
  :class="[
    `explore-star-${object.starSize?.toLowerCase().replaceAll(' ', '-')}`,
    `explore-star-${object.starColor?.toLowerCase()}`,
    `explore-star-${object.starLuminosity?.toLowerCase()}`,
  ]"
>
  <div
    class="explore-star-surface"
    :class="`explore-star-temperature-${object.starTemperature?.toLowerCase()}`"
  ></div>
</div>

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

<div
  v-else
  class="object-placeholder"
>
  🌌
</div>


      <div class="object-content">
        <span class="object-type">
          {{
            object.type === 'star'
              ? 'ESTRELA'
              : object.type === 'black-hole'
                ? 'BURACO NEGRO'
                : 'NEBULOSA'
          }}
        </span>

        <h3>{{ object.name }}</h3>

        <p v-if="object.description">
          {{ object.description }}
        </p>

        <small>
          Criado por {{ object.creatorName }}
        </small>
      </div>
    </div>
  </div>
</section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { usePlanetStore } from '../stores/planet'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useSpaceObjectStore } from '../stores/spaceObject'

const router = useRouter()
const planetStore = usePlanetStore()
const userStore = useUserStore()
const spaceObjectStore = useSpaceObjectStore()

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
    volcanic: 'Vulcânico',

    none: 'Nenhuma',
    low: 'Baixa',
    high: 'Alta',

    normal: 'Normal',

    extreme: 'Extremo',
    arid: 'Árido',

    little: 'Pouca',
    moderate: 'Moderada',
    abundant: 'Abundante',

    plains: 'Planícies',
    mountains: 'Montanhoso',
    craters: 'Crateras',
    varied: 'Variado',
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

<style scoped>
.explore {
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
  gap: 30px;
}

nav a {
  color: var(--color-text-secondary);
  transition: 0.2s ease;
}

nav a:hover {
  color: white;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 30px;
}

.heading span {
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
}

.heading h1 {
  margin: 10px 0;
  font-size: 48px;
}

.heading p {
  max-width: 600px;
  color: #b8bdd6;
  font-size: 18px;
}

.planets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 60px;
}

.planet-card {
  padding: 25px;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(174, 181, 208, 0.12);

  transition: 0.25s ease;
}

.planet-card:hover {
  transform: translateY(-6px);
  border-color: rgba(124, 92, 255, 0.5);
}

.planet-card h2 {
  margin: 0 0 5px 0;
  font-family: 'Space Grotesk', sans-serif;
}

.planet-card .demonym {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: 12px;
}

.planet-card .description {
  color: #b8bdd6;
  font-size: 14px;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.planet-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(174, 181, 208, 0.1);
}

.population {
  font-size: 13px;
  color: white;
  margin-bottom: 15px;
}

.planet-card button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(174, 181, 208, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  cursor: pointer;
  margin-top: 8px;
  transition: 0.2s ease;
}

.planet-card button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.planet-card button.delete-button {
  border-color: rgba(255, 99, 99, 0.3);
  color: #ff9999;
}

.planet-card button.delete-button:hover {
  background: rgba(255, 99, 99, 0.1);
}

@media (max-width: 800px) {
  .planets {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 50px 20px;
  }

  .heading h1 {
    font-size: 38px;
  }

  .navbar {
    padding: 0 20px;
  }
}

/* ================================= */
/* PLANETA E TEXTURAS CSS ( ATUALIZADO ) */
/* ================================= */

.planet {
  position: relative;
  overflow: hidden;
  width: 220px;
  height: 220px;
  margin: 0 auto 25px;
  border-radius: 50%;

  transform: scale(0.68);

  transition:
    background 0.4s ease,
    box-shadow 0.4s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: inset -22px -18px 40px rgba(0, 0, 0, 0.6),
              inset 15px 10px 25px rgba(255, 255, 255, 0.2);
}

.ocean {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.continent {
  position: absolute;
  z-index: 4;
  display: none;
  transition: transform 0.4s ease, background-color 0.4s ease;
}

.planet.land-qty-none .continent {
  display: none !important;
}

.planet.land-tex-flat .continent {
  background-image:
    radial-gradient(ellipse at 25% 20%, rgba(255, 255, 255, 0.18), transparent 30%),
    radial-gradient(ellipse at 70% 35%, rgba(255, 255, 255, 0.08), transparent 25%),
    radial-gradient(ellipse at 40% 75%, rgba(0, 0, 0, 0.15), transparent 40%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.12));

  box-shadow:
    inset 5px 5px 10px rgba(255, 255, 255, 0.12),
    inset -6px -7px 12px rgba(0, 0, 0, 0.20);
}

.planet.land-tex-mountains .continent {
  background-image:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.30) 0%,
      rgba(255, 255, 255, 0.10) 18%,
      transparent 35%,
      rgba(0, 0, 0, 0.08) 50%,
      rgba(0, 0, 0, 0.28) 72%,
      rgba(0, 0, 0, 0.40) 100%
    ),
    repeating-linear-gradient(
      125deg,
      rgba(255, 255, 255, 0.07) 0px,
      rgba(255, 255, 255, 0.07) 5px,
      transparent 5px,
      transparent 13px
    ),
    radial-gradient(
      ellipse at 30% 25%,
      rgba(255, 255, 255, 0.20),
      transparent 32%
    );

  box-shadow:
    inset 5px 5px 10px rgba(255, 255, 255, 0.24),
    inset -7px -8px 14px rgba(0, 0, 0, 0.34);
}

.planet.land-tex-craters .continent {
  background-image:
    radial-gradient(
      ellipse at 25% 25%,
      rgba(0, 0, 0, 0.30) 0%,
      rgba(0, 0, 0, 0.22) 8%,
      rgba(255, 255, 255, 0.12) 13%,
      transparent 20%
    ),
    radial-gradient(
      ellipse at 65% 35%,
      rgba(0, 0, 0, 0.28) 0%,
      rgba(0, 0, 0, 0.18) 7%,
      rgba(255, 255, 255, 0.10) 12%,
      transparent 18%
    ),
    radial-gradient(
      ellipse at 40% 72%,
      rgba(0, 0, 0, 0.26) 0%,
      rgba(0, 0, 0, 0.16) 8%,
      rgba(255, 255, 255, 0.10) 13%,
      transparent 20%
    ),
    radial-gradient(
      ellipse at 80% 78%,
      rgba(0, 0, 0, 0.20),
      transparent 18%
    );

  box-shadow:
    inset 4px 4px 8px rgba(255, 255, 255, 0.10),
    inset -6px -7px 12px rgba(0, 0, 0, 0.25);
}

.planet.land-tex-forest .continent {
  background-image:
    radial-gradient(
      ellipse at 25% 25%,
      rgba(120, 255, 150, 0.35),
      transparent 28%
    ),
    radial-gradient(
      ellipse at 65% 35%,
      rgba(20, 100, 45, 0.35),
      transparent 30%
    ),
    radial-gradient(
      ellipse at 40% 70%,
      rgba(80, 180, 80, 0.28),
      transparent 35%
    ),
    radial-gradient(
      ellipse at 80% 75%,
      rgba(10, 70, 35, 0.30),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.10),
      rgba(0, 0, 0, 0.15)
    );

  box-shadow:
    inset 5px 5px 9px rgba(255, 255, 255, 0.14),
    inset -6px -7px 12px rgba(0, 0, 0, 0.26);
}

.planet.land-continental .continent {
  border-radius: 42% 58% 48% 52% / 55% 42% 58% 45%;
}

.planet.land-ilhas .continent {
  border-radius: 55% 45% 60% 40% / 45% 55% 42% 58%;
}

.planet.land-fragmentada .continent {
  border-radius: 25% 65% 35% 70% / 55% 30% 65% 40%;
}

/* Formatos das terras */

.land-continental .continent-1 {
  width: 90px;
  height: 70px;
  top: 25px;
  left: 20px;
  clip-path: polygon(
    5% 35%, 20% 10%, 45% 18%, 65% 5%, 90% 25%,
    82% 50%, 95% 70%, 65% 92%, 40% 75%, 18% 88%, 2% 60%
  );
}

.land-continental .continent-2 {
  width: 75px;
  height: 95px;
  top: 70px;
  right: 20px;
  clip-path: polygon(
    20% 5%, 55% 12%, 85% 30%, 72% 50%, 92% 70%,
    60% 95%, 35% 78%, 10% 85%, 5% 55%, 20% 35%
  );
}

.land-continental .continent-3 {
  width: 100px;
  height: 60px;
  bottom: 20px;
  left: 30px;
  clip-path: polygon(
    5% 40%, 20% 18%, 45% 25%, 60% 5%, 82% 20%,
    98% 45%, 80% 65%, 65% 90%, 40% 75%, 20% 95%, 5% 70%
  );
}

.land-continental .continent-4 {
  width: 55px;
  height: 60px;
  top: 20px;
  right: 40px;
  clip-path: polygon(
    20% 5%, 60% 10%, 90% 30%, 75% 55%, 90% 80%,
    50% 95%, 25% 75%, 5% 50%, 15% 25%
  );
}

.land-continental .continent-5 {
  width: 80px;
  height: 50px;
  bottom: 35px;
  right: 25px;
  clip-path: polygon(
    10% 20%, 40% 5%, 80% 15%, 95% 45%, 85% 80%,
    50% 90%, 15% 75%, 5% 50%
  );
}

.land-continental .continent-6 {
  width: 60px;
  height: 45px;
  top: 110px;
  left: 85px;
  clip-path: polygon(
    20% 10%, 60% 15%, 90% 40%, 75% 85%, 35% 95%, 5% 60%
  );
}

.land-ilhas .continent-1 {
  width: 30px;
  height: 25px;
  top: 30px;
  left: 30px;
  clip-path: polygon(
    10% 40%, 30% 10%, 65% 20%, 90% 50%,
    65% 85%, 30% 90%, 5% 60%
  );
}

.land-ilhas .continent-2 {
  width: 24px;
  height: 20px;
  top: 65px;
  left: 75px;
  clip-path: polygon(
    15% 25%, 50% 5%, 90% 35%, 75% 80%,
    35% 95%, 5% 60%
  );
}

.land-ilhas .continent-3 {
  width: 35px;
  height: 28px;
  bottom: 40px;
  left: 45px;
  clip-path: polygon(
    15% 30%, 50% 10%, 85% 25%, 95% 60%,
    60% 90%, 10% 75%
  );
}

.land-ilhas .continent-4 {
  width: 25px;
  height: 22px;
  top: 50px;
  right: 40px;
  clip-path: polygon(
    20% 20%, 60% 0%, 100% 40%, 80% 80%,
    30% 100%, 0% 60%
  );
}

.land-ilhas .continent-5 {
  width: 28px;
  height: 32px;
  bottom: 60px;
  right: 45px;
  clip-path: polygon(
    10% 40%, 40% 5%, 80% 20%, 90% 60%,
    50% 95%, 5% 75%
  );
}

.land-ilhas .continent-6 {
  width: 20px;
  height: 18px;
  bottom: 30px;
  left: 110px;
  clip-path: polygon(
    30% 10%, 80% 20%, 95% 60%, 60% 90%, 10% 70%
  );
}

.land-fragmentada .continent-1 {
  width: 50px;
  height: 38px;
  top: 25px;
  left: 25px;
  clip-path: polygon(
    5% 20%, 35% 5%, 55% 25%, 90% 15%,
    75% 55%, 45% 50%, 25% 90%, 5% 60%
  );
}

.land-fragmentada .continent-2 {
  width: 45px;
  height: 35px;
  top: 35px;
  right: 30px;
  clip-path: polygon(
    10% 30%, 40% 0%, 90% 25%, 85% 70%,
    45% 100%, 0% 65%
  );
}

.land-fragmentada .continent-3 {
  width: 55px;
  height: 40px;
  bottom: 30px;
  left: 25px;
  clip-path: polygon(
    15% 15%, 60% 5%, 95% 45%, 70% 90%,
    20% 80%, 0% 40%
  );
}

.land-fragmentada .continent-4 {
  width: 40px;
  height: 45px;
  bottom: 40px;
  right: 25px;
  clip-path: polygon(
    25% 10%, 75% 0%, 100% 50%, 65% 95%,
    15% 85%, 0% 45%
  );
}

.land-fragmentada .continent-5 {
  width: 35px;
  height: 30px;
  top: 100px;
  left: 80px;
  clip-path: polygon(
    10% 20%, 50% 5%, 90% 30%, 80% 80%,
    40% 95%, 0% 60%
  );
}

.land-fragmentada .continent-6 {
  width: 30px;
  height: 25px;
  top: 20px;
  left: 90px;
  clip-path: polygon(
    20% 10%, 80% 15%, 95% 60%, 60% 95%, 5% 70%
  );
}

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

.atmosphere {
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  border: 10px solid var(--atmosphere-color);
  opacity: var(--atmosphere-opacity);
  pointer-events: none;
}

.planet-shadow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 70% 60%, transparent 40%, rgba(0, 0, 0, 0.75) 85%);
  pointer-events: none;
}
.points {
  color: var(--color-accent);
  font-weight: 600;
}
/* ================================= */
/* ESTRELA DOS OBJETOS ESPACIAIS */
/* ================================= */

.explore-star {
  position: relative;
  overflow: hidden;

  width: 220px;
  height: 220px;

  margin: 0 auto 25px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff 0%,
      #fff4bd 18%,
      #ffd45c 45%,
      #ff9f2f 72%,
      #d85b22 100%
    );

  box-shadow:
    0 0 35px rgba(255, 180, 70, 0.45),
    0 0 80px rgba(255, 150, 50, 0.22),

    inset -22px -18px 40px rgba(80, 20, 0, 0.35),
    inset 15px 10px 25px rgba(255, 255, 255, 0.18);

  transition:
    width 0.35s ease,
    height 0.35s ease,
    box-shadow 0.35s ease,
    background 0.35s ease;
}

/* tamanhos */

.explore-star-pequena {
  width: 150px;
  height: 150px;
}

.explore-star-média {
  width: 190px;
  height: 190px;
}

.explore-star-grande {
  width: 220px;
  height: 220px;
}

.explore-star-gigante {
  width: 260px;
  height: 260px;
}

/* cores */

.explore-star-vermelha {
  background:
    radial-gradient(
      circle at 35% 30%,
      #fff0d8,
      #ffb060 35%,
      #d94830 70%,
      #7d211b
    );
}

.explore-star-laranja {
  background:
    radial-gradient(
      circle at 35% 30%,
      #fff5d0,
      #ffc15a 35%,
      #ff762c 70%,
      #a52d1c
    );
}

.explore-star-amarela {
  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #fff2a3 30%,
      #ffd23f 65%,
      #d9821f
    );
}

.explore-star-branca {
  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #e9f5ff 40%,
      #b7d7ff 70%,
      #6c8fc5
    );
}

.explore-star-azul {
  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #b9eaff 30%,
      #4ab8ff 65%,
      #2354c7
    );
}

/* luminosidade */

.explore-star-vermelha.explore-star-baixa {
  box-shadow:
    0 0 20px rgba(220, 70, 50, 0.25),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-vermelha.explore-star-média {
  box-shadow:
    0 0 35px rgba(220, 70, 50, 0.45),
    0 0 70px rgba(220, 70, 50, 0.2),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-vermelha.explore-star-alta {
  box-shadow:
    0 0 45px rgba(220, 70, 50, 0.6),
    0 0 100px rgba(220, 70, 50, 0.3),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-vermelha.explore-star-extrema {
  box-shadow:
    0 0 60px rgba(220, 70, 50, 0.8),
    0 0 130px rgba(220, 70, 50, 0.45),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-laranja.explore-star-baixa {
  box-shadow:
    0 0 20px rgba(255, 120, 40, 0.25),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-laranja.explore-star-média {
  box-shadow:
    0 0 35px rgba(255, 120, 40, 0.45),
    0 0 70px rgba(255, 120, 40, 0.2),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-laranja.explore-star-alta {
  box-shadow:
    0 0 45px rgba(255, 120, 40, 0.6),
    0 0 100px rgba(255, 120, 40, 0.3),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-laranja.explore-star-extrema {
  box-shadow:
    0 0 60px rgba(255, 120, 40, 0.8),
    0 0 130px rgba(255, 120, 40, 0.45),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-amarela.explore-star-baixa {
  box-shadow:
    0 0 20px rgba(255, 210, 60, 0.25),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-amarela.explore-star-média {
  box-shadow:
    0 0 35px rgba(255, 210, 60, 0.45),
    0 0 70px rgba(255, 210, 60, 0.2),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-amarela.explore-star-alta {
  box-shadow:
    0 0 45px rgba(255, 210, 60, 0.6),
    0 0 100px rgba(255, 210, 60, 0.3),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-amarela.explore-star-extrema {
  box-shadow:
    0 0 60px rgba(255, 210, 60, 0.8),
    0 0 130px rgba(255, 210, 60, 0.45),
    inset -22px -18px 40px rgba(80, 20, 0, 0.35);
}

.explore-star-branca.explore-star-baixa {
  box-shadow:
    0 0 20px rgba(210, 235, 255, 0.25),
    inset -22px -18px 40px rgba(20, 40, 70, 0.35);
}

.explore-star-branca.explore-star-média {
  box-shadow:
    0 0 35px rgba(210, 235, 255, 0.45),
    0 0 70px rgba(210, 235, 255, 0.2),
    inset -22px -18px 40px rgba(20, 40, 70, 0.35);
}

.explore-star-branca.explore-star-alta {
  box-shadow:
    0 0 45px rgba(210, 235, 255, 0.6),
    0 0 100px rgba(210, 235, 255, 0.3),
    inset -22px -18px 40px rgba(20, 40, 70, 0.35);
}

.explore-star-branca.explore-star-extrema {
  box-shadow:
    0 0 60px rgba(210, 235, 255, 0.8),
    0 0 130px rgba(210, 235, 255, 0.45),
    inset -22px -18px 40px rgba(20, 40, 70, 0.35);
}

.explore-star-azul.explore-star-baixa {
  box-shadow:
    0 0 20px rgba(70, 170, 255, 0.25),
    inset -22px -18px 40px rgba(10, 30, 80, 0.35);
}

.explore-star-azul.explore-star-média {
  box-shadow:
    0 0 35px rgba(70, 170, 255, 0.45),
    0 0 70px rgba(70, 170, 255, 0.2),
    inset -22px -18px 40px rgba(10, 30, 80, 0.35);
}

.explore-star-azul.explore-star-alta {
  box-shadow:
    0 0 45px rgba(70, 170, 255, 0.6),
    0 0 100px rgba(70, 170, 255, 0.3),
    inset -22px -18px 40px rgba(10, 30, 80, 0.35);
}

.explore-star-azul.explore-star-extrema {
  box-shadow:
    0 0 60px rgba(70, 170, 255, 0.8),
    0 0 130px rgba(70, 170, 255, 0.45),
    inset -22px -18px 40px rgba(10, 30, 80, 0.35);
}

/* superfície */

.explore-star-surface {
  position: absolute;
  inset: 0;
  border-radius: 50%;

  background:
    radial-gradient(
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

/* temperatura */

.explore-star-temperature-baixa {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 170, 100, 0.15),
      transparent 45%
    );
}

.explore-star-temperature-moderada {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 220, 150, 0.22),
      transparent 45%
    );
}

.explore-star-temperature-alta {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 245, 210, 0.35),
      transparent 48%
    );
}

.explore-star-temperature-extrema {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.55),
      transparent 50%
    );
}
.space-object-card {
  padding: 25px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(174, 181, 208, 0.12);
  transition: 0.25s ease;
  cursor: pointer;
}

.space-object-card:hover {
  transform: translateY(-6px);
  border-color: rgba(124, 92, 255, 0.5);
}
.objects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 40px;
}
/* =================================
   BURACO NEGRO NO EXPLORAR
================================= */

.black-hole-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 260px;
  margin: 0 0 25px;
  overflow: hidden;
}

.black-hole {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

/* Tamanhos */

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

/* Disco de acreção */

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
      rgba(255, 255, 255, 0.85) 27%,
      rgba(255, 150, 50, 0.9) 40%,
      rgba(255, 70, 20, 0.75) 55%,
      transparent 72%
    );

  filter: blur(1px);
}

/* Núcleo */

.black-hole-core {
  position: absolute;
  width: 92px;
  height: 92px;
  border-radius: 50%;

  background: #000000;

  box-shadow:
    0 0 18px rgba(0, 0, 0, 0.95),
    0 0 35px rgba(0, 0, 0, 0.8);

  z-index: 2;
}

/* Intensidade do disco */

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

/* Cores */

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

.black-hole-disk-azul .black-hole-disk {
  background:
    radial-gradient(
      ellipse at center,
      transparent 0 24%,
      rgba(230, 250, 255, 0.98) 27%,
      rgba(70, 170, 255, 0.95) 42%,
      rgba(30, 70, 200, 0.8) 58%,
      transparent 74%
    );
}

/* Temperatura */

.black-hole-baixa .black-hole-disk {
  filter: blur(2px) brightness(0.65);
}

.black-hole-moderada .black-hole-disk {
  filter: blur(1px) brightness(1);
}

.black-hole-alta .black-hole-disk {
  filter: blur(0.6px) brightness(1.25);
}

.black-hole-extrema .black-hole-disk {
  filter: blur(0.3px) brightness(1.5);
}

/* =================================
   NEBULOSA NO EXPLORAR
================================= */

.explore-nebula-preview {
  min-height: 260px;
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

/* Tamanho */

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

/* Intensidade */

.explore-nebula-fraca {
  filter: saturate(0.75) brightness(0.75);
}

.explore-nebula-moderada {
  filter: saturate(1) brightness(1);
}

.explore-nebula-intensa {
  filter: saturate(1.35) brightness(1.2);
}

/* Nuvens */

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

/* Faixa de poeira */

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

/* Brilho central */

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

/* Estrelas */

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