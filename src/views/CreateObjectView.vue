```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const objects = [
  {
    type: 'star',
    icon: '⭐',
    name: 'Estrela',
    description: 'Crie uma estrela para fazer parte do universo.',
    cost: 50,
  },
  {
    type: 'black-hole',
    icon: '🕳️',
    name: 'Buraco negro',
    description: 'Crie um objeto extremamente massivo e misterioso.',
    cost: 200,
  },
  {
    type: 'nebula',
    icon: '🌌',
    name: 'Nebulosa',
    description: 'Crie uma grande região de gás e poeira espacial.',
    cost: 100,
  },
]

function selectObject(type: string) {
  router.push(`/criar-objeto/${type}`)
}
</script>

<template>
  <main class="create-object">
    <header class="navbar">
      <div class="logo">ALTERRA</div>

      <nav>
        <a href="/explorar">Explorar</a>

        <span class="points">
          ⭐ {{ userStore.user?.points || 0 }} pontos
        </span>
      </nav>
    </header>

    <section class="content">
      <div class="heading">
        <p class="eyebrow">NOVO OBJETO</p>

        <h1>Crie algo novo no universo.</h1>

        <p>
          Use seus pontos para criar estrelas, buracos negros
          e nebulosas.
        </p>
      </div>

      <div class="object-grid">
        <button
          v-for="object in objects"
          :key="object.type"
          class="object-card"
          type="button"
          @click="selectObject(object.type)"
        >
          <div class="object-icon">
            {{ object.icon }}
          </div>

          <h2>{{ object.name }}</h2>

          <p>{{ object.description }}</p>

          <span class="cost">
            ⭐ {{ object.cost }} pontos
          </span>
        </button>
      </div>

      <button
        class="back-button"
        type="button"
        @click="router.push('/explorar')"
      >
        Voltar para exploração
      </button>
    </section>
  </main>
</template>

<style scoped>
.create-object {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

.navbar {
  height: 80px;
  padding: 0 50px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid rgba(174, 181, 208, 0.08);
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
}

.navbar nav {
  display: flex;
  align-items: center;
  gap: 25px;
}

.navbar a {
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.navbar a:hover {
  color: white;
}

.points {
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 600;
}

.content {
  width: min(1100px, calc(100% - 40px));
  margin: 0 auto;
  padding: 80px 0;
}

.heading {
  max-width: 650px;
  margin-bottom: 50px;
}

.eyebrow {
  margin: 0 0 12px;

  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
}

.heading h1 {
  margin: 0 0 16px;

  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(38px, 6vw, 60px);
  line-height: 1.05;
}

.heading > p:last-child {
  margin: 0;

  color: var(--color-text-secondary);
  font-size: 17px;
  line-height: 1.6;
}

.object-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.object-card {
  min-height: 330px;
  padding: 30px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  text-align: left;

  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 18px;

  color: white;
  cursor: pointer;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.object-card:hover {
  transform: translateY(-5px);

  background: rgba(124, 92, 255, 0.06);
  border-color: rgba(124, 92, 255, 0.4);
}

.object-icon {
  width: 70px;
  height: 70px;
  margin-bottom: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;

  font-size: 34px;
}

.object-card h2 {
  margin: 0 0 10px;

  font-family: 'Space Grotesk', sans-serif;
  font-size: 25px;
}

.object-card p {
  margin: 0;

  color: var(--color-text-secondary);
  line-height: 1.5;
}

.cost {
  margin-top: auto;
  padding-top: 25px;

  color: var(--color-accent);
  font-size: 14px;
  font-weight: 700;
}

.back-button {
  margin-top: 35px;
  padding: 12px 18px;

  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(174, 181, 208, 0.18);
  border-radius: 10px;

  color: var(--color-text-secondary);
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(174, 181, 208, 0.35);
  color: white;
}

@media (max-width: 800px) {
  .object-grid {
    grid-template-columns: 1fr;
  }

  .navbar {
    padding: 0 20px;
  }

  .navbar nav {
    gap: 12px;
  }

  .content {
    padding: 50px 0;
  }
}
</style>
```
