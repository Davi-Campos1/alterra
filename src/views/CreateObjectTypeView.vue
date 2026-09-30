<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpaceObjectStore } from '../stores/spaceObject'
import { useUserStore } from '../stores/user'
import type { SpaceObjectType } from '../types/spaceObject'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const spaceObjectStore = useSpaceObjectStore()

const name = ref('')
const description = ref('')

const starType = ref('')
const starColor = ref('')
const starSize = ref('')
const starTemperature = ref('')
const starLuminosity = ref('')
const nebulaType = ref('')
const nebulaColor = ref('')
const nebulaSize = ref('')
const nebulaIntensity = ref('')

const errorMessage = ref('')

const objectType = computed(
  () => route.params.type as SpaceObjectType
)

const objectInfo = computed(() => {
  const objects = {
    star: {
      name: 'Estrela',
      icon: '⭐',
      cost: 50,
      description:
        'Crie uma estrela que fará parte do universo do ALTERRA.',

      types: [
        'Anã vermelha',
        'Anã amarela',
        'Gigante vermelha',
        'Gigante azul',
        'Supergigante',
      ],

      colors: [
        'Vermelha',
        'Laranja',
        'Amarela',
        'Branca',
        'Azul',
      ],

      sizes: [
        'Pequena',
        'Média',
        'Grande',
        'Gigante',
      ],

      temperatures: [
        'Baixa',
        'Moderada',
        'Alta',
        'Extrema',
      ],

      luminosities: [
        'Baixa',
        'Média',
        'Alta',
        'Extrema',
      ],
      intensities: [],
    },

    'black-hole': {
      name: 'Buraco negro',
      icon: '🕳️',
      cost: 200,
      description:
        'Crie um buraco negro e personalize suas principais características.',

      types: [
        'Estelar',
        'Intermediário',
        'Supermassivo',
        'Primordial',
      ],

      colors: [
        'Vermelho',
        'Laranja',
        'Amarelo',
        'Branco',
        'Azul',
      ],

      sizes: [
        'Pequeno',
        'Médio',
        'Grande',
        'Gigante',
      ],

      temperatures: [
        'Baixa',
        'Moderada',
        'Alta',
        'Extrema',
      ],

      luminosities: [
        'Sem disco',
        'Fraco',
        'Moderado',
        'Intenso',
      ],
      intensities: [],
    },
    nebula: {
      name: 'Nebulosa',
      icon: '🌌',
      cost: 100,
      description:
        'Crie uma nebulosa, uma enorme região de gás e poeira espacial.',

      types: [
        'Emissão',
        'Reflexão',
        'Escura',
        'Planetária',
      ],

      colors: [
        'Roxa',
        'Azul',
        'Vermelha',
        'Rosa',
        'Verde',
      ],

      sizes: [
        'Pequena',
        'Média',
        'Grande',
        'Gigante',
      ],

      intensities: [
        'Fraca',
        'Moderada',
        'Intensa',
      ],

      temperatures: [],
      luminosities: [],
    },
  }
  return objects[objectType.value]
})

const hasEnoughPoints = computed(() => {
  return (
    (userStore.user?.points || 0) >=
    (objectInfo.value?.cost || 0)
  )
})

function getNebulaScale() {
  switch (nebulaSize.value) {
    case 'Pequena': return 0.75
    case 'Média': return 1
    case 'Grande': return 1.25
    case 'Gigante': return 1.5
    default: return 1
  }
}

function getNebulaIntensityOpacity() {
  switch (nebulaIntensity.value) {
    case 'Fraca': return 0.4
    case 'Moderada': return 0.7
    case 'Intensa': return 1
    default: return 0.85
  }
}

function getNebulaIntensityFilter() {
  switch (nebulaIntensity.value) {
    case 'Fraca':
      return 'saturate(0.75) brightness(0.75) blur(20px)'

    case 'Moderada':
      return 'saturate(1) brightness(1) blur(18px)'

    case 'Intensa':
      return 'saturate(1.35) brightness(1.2) blur(15px)'

    default:
      return 'saturate(1) brightness(1) blur(18px)'
  }
}



function getNebulaGradient(cloudLayer: number) {
  const color = nebulaColor.value || 'Roxa'
  
  const gradients: Record<string, string[]> = {
    'Roxa': [
      'radial-gradient(ellipse at 35% 45%, rgba(210, 110, 255, 0.95) 0%, rgba(160, 65, 245, 0.7) 25%, rgba(100, 40, 210, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(180, 70, 255, 0.9) 0%, rgba(120, 55, 235, 0.55) 28%, rgba(70, 30, 180, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(255, 120, 210, 0.85) 0%, rgba(200, 65, 180, 0.55) 25%, rgba(130, 40, 160, 0.25) 50%, transparent 75%)'
    ],
    'Azul': [
      'radial-gradient(ellipse at 35% 45%, rgba(110, 200, 255, 0.95) 0%, rgba(65, 130, 245, 0.7) 25%, rgba(40, 80, 210, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(70, 170, 255, 0.9) 0%, rgba(35, 110, 235, 0.55) 28%, rgba(15, 50, 180, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(120, 220, 255, 0.85) 0%, rgba(65, 150, 220, 0.55) 25%, rgba(40, 90, 180, 0.25) 50%, transparent 75%)'
    ],
    'Vermelha': [
      'radial-gradient(ellipse at 35% 45%, rgba(255, 110, 110, 0.95) 0%, rgba(245, 65, 65, 0.7) 25%, rgba(210, 40, 40, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(255, 70, 70, 0.9) 0%, rgba(235, 35, 35, 0.55) 28%, rgba(180, 15, 15, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(255, 120, 120, 0.85) 0%, rgba(220, 65, 65, 0.55) 25%, rgba(180, 40, 40, 0.25) 50%, transparent 75%)'
    ],
    'Rosa': [
      'radial-gradient(ellipse at 35% 45%, rgba(255, 110, 200, 0.95) 0%, rgba(245, 65, 160, 0.7) 25%, rgba(210, 40, 120, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(255, 70, 180, 0.9) 0%, rgba(235, 35, 130, 0.55) 28%, rgba(180, 15, 90, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(255, 150, 220, 0.85) 0%, rgba(220, 80, 170, 0.55) 25%, rgba(180, 40, 130, 0.25) 50%, transparent 75%)'
    ],
    'Verde': [
      'radial-gradient(ellipse at 35% 45%, rgba(110, 255, 180, 0.95) 0%, rgba(65, 245, 130, 0.7) 25%, rgba(40, 210, 90, 0.4) 48%, transparent 72%)',
      'radial-gradient(ellipse at 55% 50%, rgba(70, 255, 150, 0.9) 0%, rgba(35, 235, 100, 0.55) 28%, rgba(15, 180, 60, 0.3) 50%, transparent 72%)',
      'radial-gradient(ellipse at center, rgba(150, 255, 200, 0.85) 0%, rgba(80, 220, 140, 0.55) 25%, rgba(40, 180, 90, 0.25) 50%, transparent 75%)'
    ]
  }

  // Garantimos um array padrão caso a cor não exista no objeto
  const selectedPalette = gradients[color] ?? gradients['Roxa'] ?? []
  
  // Garantimos que o índice existe ou usamos o fallback do array padrão
  return selectedPalette[cloudLayer - 1] ?? gradients['Roxa']?.[0] ?? ''
}
function createObject() {
  errorMessage.value = ''

  if (!userStore.user) {
    router.push('/login')
    return
  }

  if (!objectInfo.value) {
    errorMessage.value = 'Tipo de objeto inválido.'
    return
  }

  if (!name.value.trim()) {
    errorMessage.value = 'Digite um nome para o objeto.'
    return
  }

  if (!hasEnoughPoints.value) {
    errorMessage.value =
      'Você não possui pontos suficientes para criar este objeto.'
    return
  }

  const newObject = {
    id: crypto.randomUUID(),
    type: objectType.value,

    name: name.value.trim(),
    description: description.value.trim(),

    creatorId: userStore.user.id,
    creatorName: userStore.user.name,

    pointsCost: objectInfo.value.cost,

    starType:
      objectType.value === 'star' ||
      objectType.value === 'black-hole'
        ? starType.value
        : undefined,

    starColor:
      objectType.value === 'star' ||
      objectType.value === 'black-hole'
        ? starColor.value
        : undefined,

    starSize:
      objectType.value === 'star' ||
      objectType.value === 'black-hole'
        ? starSize.value
        : undefined,

    starTemperature:
      objectType.value === 'star' ||
      objectType.value === 'black-hole'
        ? starTemperature.value
        : undefined,

    starLuminosity:
      objectType.value === 'star' ||
      objectType.value === 'black-hole'
        ? starLuminosity.value
        : undefined,

    nebulaType:
      objectType.value === 'nebula'
        ? nebulaType.value
        : undefined,

    nebulaColor:
      objectType.value === 'nebula'
        ? nebulaColor.value
        : undefined,

    nebulaSize:
      objectType.value === 'nebula'
        ? nebulaSize.value
        : undefined,

    nebulaIntensity:
      objectType.value === 'nebula'
        ? nebulaIntensity.value
        : undefined,
    createdAt: new Date().toISOString(),
  }

  spaceObjectStore.addObject(newObject)

  const newPoints =
    userStore.user.points - objectInfo.value.cost

  userStore.setUser({
    ...userStore.user,
    points: newPoints,
  })

  const savedUsers = localStorage.getItem('alterra-users')

  if (savedUsers) {
    try {
      const users = JSON.parse(savedUsers)

      const currentUser = users.find(
        (user: { id: string }) =>
          user.id === userStore.user?.id
      )

      if (currentUser) {
        currentUser.points = newPoints
      }

      localStorage.setItem(
        'alterra-users',
        JSON.stringify(users)
      )
    } catch {
      console.error('Erro ao atualizar os pontos.')
    }
  }

  router.push('/explorar')
}
</script>

<template>
  <main class="create-object-page">
    <header class="navbar">
      <div class="logo">ALTERRA</div>

      <nav>
        <a href="/explorar">Explorar</a>

        <span class="points">
          ⭐ {{ userStore.user?.points || 0 }} pontos
        </span>
      </nav>
    </header>

    <section v-if="objectInfo" class="content">
      <button
        class="back-link"
        type="button"
        @click="router.push('/criar-objeto')"
      >
        ← Escolher outro objeto
      </button>

      <div class="object-header">
        <div class="object-icon">
          {{ objectInfo.icon }}
        </div>

        <div>
          <p class="eyebrow">NOVO OBJETO</p>

          <h1>
            Criar {{ objectInfo.name.toLowerCase() }}
          </h1>

          <p>
            {{ objectInfo.description }}
          </p>
        </div>
      </div>

      <div v-if="objectType === 'star'" class="star-preview">
        <div
          class="star"
          :class="[
            `star-${starSize.toLowerCase().replaceAll(' ', '-')}`,
            `star-${starColor.toLowerCase()}`,
            `star-${starLuminosity.toLowerCase()}`,
          ]"
        >
          <div
            class="star-surface"
            :class="`star-temperature-${starTemperature.toLowerCase()}`"
          ></div>
        </div>
      </div>

      <div
        v-else-if="objectType === 'black-hole'"
        class="black-hole-preview"
      >
        <div
          class="black-hole"
          :class="[
            `black-hole-${starSize.toLowerCase().replaceAll(' ', '-')}`,
            `black-hole-${starTemperature.toLowerCase()}`,
            `black-hole-disk-${starLuminosity.toLowerCase().replaceAll(' ', '-')}`,
            `black-hole-disk-${starColor.toLowerCase()}`,
          ]"
        >
          <div class="black-hole-disk"></div>
          <div class="black-hole-core"></div>
        </div>
      </div>

      <div
        v-else-if="objectType === 'nebula'"
        class="nebula-preview"
      >
        <div
          class="nebula"
          :class="`nebula-type-${(nebulaType || 'Emissão').toLowerCase().replaceAll(' ', '-')}`"
          :style="{
            transform: `scale(${getNebulaScale()}) rotate(-10deg)`
          }"
        >
        
<div
  class="nebula-cloud nebula-cloud-one"
  :style="{
    background: getNebulaGradient(1),
    filter: getNebulaIntensityFilter()
  }"
></div>

<div
  class="nebula-cloud nebula-cloud-two"
  :style="{
    background: getNebulaGradient(2),
    filter: getNebulaIntensityFilter()
  }"
></div>

<div
  class="nebula-cloud nebula-cloud-three"
  :style="{
    background: getNebulaGradient(3),
    filter: getNebulaIntensityFilter()
  }"
></div>

          <div
            class="nebula-cloud nebula-cloud-two"
            :style="{ background: getNebulaGradient(2) }"
          ></div>
          <div
            class="nebula-cloud nebula-cloud-three"
            :style="{ background: getNebulaGradient(3) }"
          ></div>
          <div class="nebula-stars" :style="{ opacity: getNebulaIntensityOpacity() }"></div>
        </div>
      </div>

      <section class="form-card">
        <div class="cost-box">
          <span>Custo para criar</span>

          <strong>
            ⭐ {{ objectInfo.cost }} pontos
          </strong>
        </div>

        <div class="field">
          <label for="name">
            Nome
          </label>

          <input
            id="name"
            v-model="name"
            type="text"
            maxlength="50"
            placeholder="Dê um nome ao seu objeto"
          />
        </div>

        <div class="field">
          <label for="description">
            Descrição
          </label>

          <textarea
            id="description"
            v-model="description"
            maxlength="500"
            rows="5"
            placeholder="Conte um pouco sobre este objeto..."
          ></textarea>
        </div>

        <div v-if="objectType === 'nebula'" class="nebula-fields">
          <div class="field">
            <label for="nebula-type">Tipo da nebulosa</label>

            <select id="nebula-type" v-model="nebulaType">
              <option value="" disabled>Escolha o tipo</option>

              <option
                v-for="type in objectInfo.types"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="nebula-color">Cor</label>

            <select id="nebula-color" v-model="nebulaColor">
              <option value="" disabled>Escolha a cor</option>

              <option
                v-for="color in objectInfo.colors"
                :key="color"
                :value="color"
              >
                {{ color }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="nebula-size">Tamanho</label>

            <select id="nebula-size" v-model="nebulaSize">
              <option value="" disabled>Escolha o tamanho</option>

              <option
                v-for="size in objectInfo.sizes"
                :key="size"
                :value="size"
              >
                {{ size }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="nebula-intensity">Intensidade</label>

            <select id="nebula-intensity" v-model="nebulaIntensity">
              <option value="" disabled>Escolha a intensidade</option>

              <option
                v-for="intensity in objectInfo.intensities"
                :key="intensity"
                :value="intensity"
              >
                {{ intensity }}
              </option>
            </select>
          </div>
        </div>

        <div
          v-if="objectType === 'star' || objectType === 'black-hole'"
          class="star-fields"
        >
          <div class="field">
            <label for="object-type">
              {{ objectType === 'star' ? 'Tipo da estrela' : 'Tipo do buraco negro' }}
            </label>

            <select id="object-type" v-model="starType">
              <option value="" disabled>
                Escolha o tipo
              </option>

              <option
                v-for="type in objectInfo.types"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="object-color">
              {{ objectType === 'star' ? 'Cor da estrela' : 'Cor do disco de acreção' }}
            </label>

            <select id="object-color" v-model="starColor">
              <option value="" disabled>
                Escolha a cor
              </option>

              <option
                v-for="color in objectInfo.colors"
                :key="color"
                :value="color"
              >
                {{ color }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="object-size">
              Tamanho
            </label>

            <select id="object-size" v-model="starSize">
              <option value="" disabled>
                Escolha o tamanho
              </option>

              <option
                v-for="size in objectInfo.sizes"
                :key="size"
                :value="size"
              >
                {{ size }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="object-temperature">
              Temperatura
            </label>

            <select
              id="object-temperature"
              v-model="starTemperature"
            >
              <option value="" disabled>
                Escolha a temperatura
              </option>

              <option
                v-for="temperature in objectInfo.temperatures"
                :key="temperature"
                :value="temperature"
              >
                {{ temperature }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="object-luminosity">
              {{ objectType === 'star' ? 'Luminosidade' : 'Disco de acreção' }}
            </label>

            <select
              id="object-luminosity"
              v-model="starLuminosity"
            >
              <option value="" disabled>
                {{
                  objectType === 'star'
                    ? 'Escolha a luminosidade'
                    : 'Escolha a intensidade do disco'
                }}
              </option>

              <option
                v-for="luminosity in objectInfo.luminosities"
                :key="luminosity"
                :value="luminosity"
              >
                {{ luminosity }}
              </option>
            </select>
          </div>
        </div>

        <p
          v-if="errorMessage"
          class="error"
        >
          {{ errorMessage }}
        </p>

        <div
          v-if="!hasEnoughPoints"
          class="warning"
        >
          Você precisa de mais
          {{ objectInfo.cost - (userStore.user?.points || 0) }}
          pontos para criar este objeto.
        </div>

        <button
          class="create-button"
          type="button"
          :disabled="!hasEnoughPoints"
          @click="createObject"
        >
          Criar {{ objectInfo.name }}
        </button>
      </section>
    </section>

    <section v-else class="not-found">
      <h1>Objeto não encontrado</h1>

      <button
        class="create-button"
        type="button"
        @click="router.push('/criar-objeto')"
      >
        Voltar
      </button>
    </section>
  </main>
</template>

<style scoped>
.create-object-page {
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
  width: min(760px, calc(100% - 40px));
  margin: 0 auto;
  padding: 60px 0 100px;
}

.back-link {
  margin-bottom: 40px;
  padding: 0;

  border: none;
  background: none;

  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
}

.back-link:hover {
  color: white;
}

.object-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 35px;
}

.object-icon {
  width: 90px;
  height: 90px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 22px;

  font-size: 42px;
}

.eyebrow {
  margin: 0 0 8px;

  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
}

.object-header h1 {
  margin: 0 0 10px;

  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(38px, 6vw, 55px);
  line-height: 1;
}

.object-header p:last-child {
  margin: 0;

  color: var(--color-text-secondary);
  line-height: 1.6;
}

.form-card {
  padding: 30px;

  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 18px;
}

.cost-box {
  margin-bottom: 30px;
  padding: 16px 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  background: rgba(124, 92, 255, 0.07);
  border: 1px solid rgba(124, 92, 255, 0.2);
  border-radius: 12px;
}

.cost-box span {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.cost-box strong {
  color: var(--color-accent);
  font-size: 14px;
}

.field {
  margin-bottom: 22px;
}

.field label {
  display: block;
  margin-bottom: 8px;

  font-size: 14px;
  font-weight: 600;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 13px 14px;

  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(174, 181, 208, 0.16);
  border-radius: 10px;

  color: white;
  font-size: 15px;

  outline: none;
  resize: vertical;

  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.field select {
  cursor: pointer;
  appearance: none;
}

.field select option {
  background: #181e38;
  color: white;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(124, 92, 255, 0.65);
}

.field input::placeholder,
.field textarea::placeholder {
  color: #737991;
}

.nebula-fields {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 0;
}

.error {
  margin: 0 0 15px;

  color: #ff7d91;
  font-size: 14px;
}

.warning {
  margin-bottom: 15px;
  padding: 12px;

  background: rgba(255, 180, 70, 0.08);
  border: 1px solid rgba(255, 180, 70, 0.2);
  border-radius: 10px;

  color: #ffc978;
  font-size: 14px;
}

.create-button {
  width: 100%;
  padding: 14px;

  border: 1px solid rgba(124, 92, 255, 0.5);
  border-radius: 10px;

  background: var(--color-primary);
  color: white;

  font-weight: 700;
  cursor: pointer;

  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.create-button:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.create-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.not-found {
  padding: 100px 20px;
  text-align: center;
}

@media (max-width: 600px) {
  .navbar {
    padding: 0 20px;
  }

  .content {
    padding-top: 40px;
  }

  .object-header {
    align-items: flex-start;
  }

  .object-icon {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }

  .form-card {
    padding: 20px;
  }

  .cost-box {
    align-items: flex-start;
    flex-direction: column;
  }
}

.star-preview {
  margin-bottom: 30px;
  padding: 45px 30px 30px;

  display: flex;
  flex-direction: column;
  align-items: center;

  background:
    radial-gradient(
      circle at center,
      rgba(124, 92, 255, 0.12),
      rgba(8, 11, 26, 0.2) 55%,
      transparent 75%
    );

  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 18px;
}

.star {
  width: 170px;
  height: 170px;

  position: relative;

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
    0 0 80px rgba(255, 150, 50, 0.22);

  overflow: visible;

  transition:
    width 0.35s ease,
    height 0.35s ease,
    box-shadow 0.35s ease,
    background 0.35s ease;
}

.star-surface {
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

.star-temperature-baixa {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 170, 100, 0.15),
      transparent 45%
    );
}

.star-temperature-moderada {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 220, 150, 0.22),
      transparent 45%
    );
}

.star-temperature-alta {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 245, 210, 0.35),
      transparent 48%
    );
}

.star-temperature-extrema {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.55),
      transparent 50%
    );
}

.star-pequena {
  width: 120px;
  height: 120px;
}

.star-média {
  width: 170px;
  height: 170px;
}

.star-grande {
  width: 220px;
  height: 220px;
}

.star-gigante {
  width: 280px;
  height: 280px;
}

.star-vermelha {
  background:
    radial-gradient(
      circle at 35% 30%,
      #fff0d8,
      #ffb060 35%,
      #d94830 70%,
      #7d211b
    );
}

.star-laranja {
  background:
    radial-gradient(
      circle at 35% 30%,
      #fff5d0,
      #ffc15a 35%,
      #ff762c 70%,
      #a52d1c
    );
}

.star-amarela {
  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #fff2a3 30%,
      #ffd23f 65%,
      #d9821f
    );
}

.star-branca {
  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #e9f5ff 40%,
      #b7d7ff 70%,
      #6c8fc5
    );
}

.star-azul {
  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #b9eaff 30%,
      #4ab8ff 65%,
      #2354c7
    );
}

.star-vermelha.star-baixa { box-shadow: 0 0 20px rgba(220, 70, 50, 0.25); }
.star-vermelha.star-média { box-shadow: 0 0 35px rgba(220, 70, 50, 0.45), 0 0 70px rgba(220, 70, 50, 0.2); }
.star-vermelha.star-alta { box-shadow: 0 0 45px rgba(220, 70, 50, 0.6), 0 0 100px rgba(220, 70, 50, 0.3); }
.star-vermelha.star-extrema { box-shadow: 0 0 60px rgba(220, 70, 50, 0.8), 0 0 130px rgba(220, 70, 50, 0.45); }

.star-laranja.star-baixa { box-shadow: 0 0 20px rgba(255, 120, 40, 0.25); }
.star-laranja.star-média { box-shadow: 0 0 35px rgba(255, 120, 40, 0.45), 0 0 70px rgba(255, 120, 40, 0.2); }
.star-laranja.star-alta { box-shadow: 0 0 45px rgba(255, 120, 40, 0.6), 0 0 100px rgba(255, 120, 40, 0.3); }
.star-laranja.star-extrema { box-shadow: 0 0 60px rgba(255, 120, 40, 0.8), 0 0 130px rgba(255, 120, 40, 0.45); }

.star-amarela.star-baixa { box-shadow: 0 0 20px rgba(255, 210, 60, 0.25); }
.star-amarela.star-média { box-shadow: 0 0 35px rgba(255, 210, 60, 0.45), 0 0 70px rgba(255, 210, 60, 0.2); }
.star-amarela.star-alta { box-shadow: 0 0 45px rgba(255, 210, 60, 0.6), 0 0 100px rgba(255, 210, 60, 0.3); }
.star-amarela.star-extrema { box-shadow: 0 0 60px rgba(255, 210, 60, 0.8), 0 0 130px rgba(255, 210, 60, 0.45); }

.star-branca.star-baixa { box-shadow: 0 0 20px rgba(210, 235, 255, 0.25); }
.star-branca.star-média { box-shadow: 0 0 35px rgba(210, 235, 255, 0.45), 0 0 70px rgba(210, 235, 255, 0.2); }
.star-branca.star-alta { box-shadow: 0 0 45px rgba(210, 235, 255, 0.6), 0 0 100px rgba(210, 235, 255, 0.3); }
.star-branca.star-extrema { box-shadow: 0 0 60px rgba(210, 235, 255, 0.8), 0 0 130px rgba(210, 235, 255, 0.45); }

.star-azul.star-baixa { box-shadow: 0 0 20px rgba(70, 170, 255, 0.25); }
.star-azul.star-média { box-shadow: 0 0 35px rgba(70, 170, 255, 0.45), 0 0 70px rgba(70, 170, 255, 0.2); }
.star-azul.star-alta { box-shadow: 0 0 45px rgba(70, 170, 255, 0.6), 0 0 100px rgba(70, 170, 255, 0.3); }
.star-azul.star-extrema { box-shadow: 0 0 60px rgba(70, 170, 255, 0.8), 0 0 130px rgba(70, 170, 255, 0.45); }

.black-hole-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 360px;
  margin: 30px 0;
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

.black-hole-pequeno { transform: scale(0.7); }
.black-hole-médio { transform: scale(0.85); }
.black-hole-grande { transform: scale(1); }
.black-hole-gigante { transform: scale(1.2); }

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

.black-hole-disk-sem-disco .black-hole-disk {
  background: transparent !important;
  border: 5px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 0 8px rgba(255, 255, 255, 0.12),
    0 0 22px rgba(255, 255, 255, 0.08);
  filter: blur(1px);
  transform: none;
}

.black-hole-disk-sem-disco .black-hole-core {
  background: #000 !important;
}

.black-hole-disk-vermelho .black-hole-disk {
  background: radial-gradient(ellipse at center, transparent 0 24%, rgba(255, 170, 90, 1) 28%, rgba(220, 40, 25, 0.95) 48%, rgba(100, 0, 0, 0.8) 68%, transparent 78%) !important;
}
.black-hole-disk-laranja .black-hole-disk {
  background: radial-gradient(ellipse at center, transparent 0 24%, rgba(255, 235, 170, 1) 28%, rgba(255, 120, 20, 1) 48%, rgba(160, 45, 0, 0.8) 68%, transparent 78%) !important;
}
.black-hole-disk-amarelo .black-hole-disk {
  background: radial-gradient(ellipse at center, transparent 0 24%, rgba(255, 255, 230, 1) 28%, rgba(255, 215, 35, 1) 48%, rgba(180, 100, 0, 0.8) 68%, transparent 78%) !important;
}
.black-hole-disk-branco .black-hole-disk {
  background: radial-gradient(ellipse at center, transparent 0 24%, rgba(255, 255, 255, 1) 28%, rgba(215, 230, 255, 1) 48%, rgba(120, 150, 210, 0.8) 68%, transparent 78%) !important;
}
.black-hole-disk-azul .black-hole-disk {
  background: radial-gradient(ellipse at center, transparent 0 24%, rgba(220, 250, 255, 1) 28%, rgba(40, 150, 255, 1) 48%, rgba(15, 45, 150, 0.8) 68%, transparent 78%) !important;
}

.black-hole-alta .black-hole-disk { filter: blur(0.6px) brightness(1.25); }
.black-hole-extrema .black-hole-disk { filter: blur(0.3px) brightness(1.5); }
.black-hole-moderada .black-hole-disk { filter: blur(1px) brightness(1); }
.black-hole-baixa .black-hole-disk { filter: blur(2px) brightness(0.65); }

.nebula-preview {
  min-height: 480px;
  margin: 30px 0;
  padding: 40px 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background:
    radial-gradient(
      ellipse at center,
      rgba(124, 92, 255, 0.08),
      transparent 68%
    );

  border: 1px solid rgba(174, 181, 208, 0.12);
  border-radius: 18px;
}

.nebula {
  position: relative;
  width: 360px;
  height: 250px;
  overflow: visible;
  background: transparent;
  transition: transform 0.35s ease;
}

.nebula-cloud {
  position: absolute;
  border-radius: 45% 55% 60% 40% / 55% 45% 50% 50%;
  filter: blur(18px);
  mix-blend-mode: screen;
  transition:
  background 0.35s ease,
  opacity 0.35s ease,
  filter 0.35s ease;
}

.nebula-cloud-one {
  width: 95%;
  height: 80%;
  top: 8%;
  left: -5%;
  transform: rotate(12deg);
}

.nebula-cloud-two {
  width: 80%;
  height: 75%;
  right: -10%;
  bottom: -5%;
  transform: rotate(-18deg);
}

.nebula-cloud-three {
  width: 70%;
  height: 55%;
  left: 17%;
  top: 22%;
  transform: rotate(8deg);
}

.nebula::before,
.nebula::after {
  content: '';
  position: absolute;
  width: 130%;
  height: 55%;
  left: -15%;
  top: 22%;
  border-radius: 50%;
  transform: rotate(-12deg);
  pointer-events: none;
}

.nebula::before {
  background:
    repeating-radial-gradient(
      ellipse at center,
      transparent 0 13px,
      rgba(255, 255, 255, 0.05) 15px,
      transparent 22px
    );
  filter: blur(4px);
  opacity: 0.8;
}

.nebula::after {
  background:
    radial-gradient(
      ellipse at 25% 50%,
      transparent 0 18%,
      rgba(255, 255, 255, 0.08) 21%,
      transparent 27%
    ),
    radial-gradient(
      ellipse at 65% 35%,
      transparent 0 20%,
      rgba(255, 255, 255, 0.06) 23%,
      transparent 30%
    );
  filter: blur(8px);
  opacity: 0.7;
}

.nebula-stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 8% 20%, white 0 1px, transparent 2px),
    radial-gradient(circle at 17% 67%, white 0 1px, transparent 2px),
    radial-gradient(circle at 25% 34%, white 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 32% 82%, white 0 1px, transparent 2px),
    radial-gradient(circle at 40% 18%, white 0 1px, transparent 2px),
    radial-gradient(circle at 48% 62%, white 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 56% 30%, white 0 1px, transparent 2px),
    radial-gradient(circle at 64% 78%, white 0 1px, transparent 2px),
    radial-gradient(circle at 71% 18%, white 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 78% 52%, white 0 1px, transparent 2px),
    radial-gradient(circle at 86% 28%, white 0 1px, transparent 2px),
    radial-gradient(circle at 94% 70%, white 0 1.2px, transparent 2.5px);
  z-index: 5;
  transition: opacity 0.35s ease;
}
</style>