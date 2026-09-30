<template>
  <main class="create">
    <header class="navbar">
      <div class="logo">ALTERRA</div>
      <a href="/explorar">Voltar para explorar</a>
    </header>

    <section class="content">
      <div class="heading">
        <span>SEU MUNDO</span>
        <h1>Crie seu planeta.</h1>
        <p>
          Defina o clima, a natureza e as condições físicas. A aparência do seu mundo se adaptará automaticamente, mas você pode personalizá-la como quiser.
        </p>
      </div>

      <div class="creator">
        <div class="preview">
          <div
            class="planet"
            :class="[
              `water-${waterLevel}`,
              `land-${continentStyle}`,
              `land-qty-${landAmount}`,
              `land-tex-${landTexture}`,
              `atmo-tex-${atmosphereTexture}`,
              { 'has-atmosphere': hasAtmosphere }
            ]"
            :style="{ 
              background: planetColor,
              '--atmosphere-color': atmosphereColor,
              '--atmosphere-opacity': atmosphereOpacity / 100,
              '--planet-scale': planetScaleMap[planetSize] || 1
            }"
          >
            <!-- Oceano Translúcido -->
            <div class="ocean"></div>

            <!-- Continentes -->
            <div
              v-for="n in 12"
              :key="n"
              :class="['continent', `continent-${n}`]"
              :style="{ backgroundColor: landColor }"
            ></div>

            <!-- Atmosfera Texturizada -->
            <div v-if="hasAtmosphere" class="atmosphere"></div>

            <!-- Sombreamento 3D -->
            <div class="planet-shadow"></div>
          </div>

          <h2>{{ planetName || 'Planeta Desconhecido' }}</h2>
          <span v-if="demonym" class="demonym-preview">Habitantes: {{ demonym }}</span>
        </div>

        <div class="form">
          <!-- ========================================== -->
          <!-- IDENTIDADE                                 -->
          <!-- ========================================== -->
          <div class="form-section">
            <h3>Identidade</h3>
            <label>
              Nome do planeta
              <input v-model="planetName" type="text" placeholder="Ex: Asteria" maxlength="30" />
            </label>

            <label>
              Gentílico dos habitantes
              <input v-model="demonym" type="text" placeholder="Ex: Asterianos" maxlength="30" />
            </label>

            <label>
              Descrição do planeta (Opcional)
              <textarea v-model="planetDescription" placeholder="Conte a história, os mistérios ou o que torna este mundo único..." rows="3"></textarea>
            </label>
          </div>

          <!-- ========================================== -->
          <!-- CONDIÇÕES DO PLANETA (O Motor de Biomas)   -->
          <!-- ========================================== -->
          <div class="form-section">
            <h3>Condições Físicas</h3>
            
            <label>
              Tamanho
              <select v-model="planetSize">
                <option value="small">Pequeno (Tamanho de uma Lua)</option>
                <option value="medium">Médio (Semelhante à Terra)</option>
                <option value="large">Grande (Superterra)</option>
                <option value="giant">Gigante (Massivo)</option>
              </select>
            </label>

            <label>
              Temperatura média
              <select v-model="temperature">
                <option value="frozen">Gélida (Sempre congelado)</option>
                <option value="cold">Fria</option>
                <option value="temperate">Temperada (Equilibrada)</option>
                <option value="hot">Quente</option>
                <option value="volcanic">Infernal / Vulcânica</option>
              </select>
            </label>

            <label>
              Quantidade de água / oceanos
              <select v-model="waterLevel">
                <option value="none">Nenhuma / Mundo Seco</option>
                <option value="low">Pouca (Mares isolados)</option>
                <option value="medium">Média (Oceanos e Continentes)</option>
                <option value="high">Mundo Oceânico</option>
              </select>
            </label>

            <label>
              Gravidade
              <select v-model="gravity">
                <option value="low">Baixa (Saltos longos)</option>
                <option value="normal">Normal (Padrão humano)</option>
                <option value="high">Alta (Movimentos pesados)</option>
                <option value="extreme">Extrema (Esmagadora)</option>
              </select>
            </label>
          </div>

          <!-- ========================================== -->
          <!-- NATUREZA E CLIMA                           -->
          <!-- ========================================== -->
          <div class="form-section">
            <h3>Natureza e Clima</h3>

            <label>
              Clima predominante
              <select v-model="climate">
                <option value="arid">Árido / Desértico</option>
                <option value="temperate">Estações bem definidas</option>
                <option value="rainy">Chuvoso / Úmido</option>
                <option value="freezing">Nevascas Constantes</option>
                <option value="extreme">Extremo / Tempestades violentas</option>
              </select>
            </label>
            
            <label>
              Densidade da vegetação
              <select v-model="vegetation">
                <option value="none">Nenhuma (Estéril)</option>
                <option value="little">Pouca (Oásis, musgos)</option>
                <option value="moderate">Moderada (Florestas e planícies)</option>
                <option value="abundant">Abundante (Mundo coberto de selva)</option>
              </select>
            </label>

            <label>
              Relevo predominante
              <select v-model="relief">
                <option value="plains">Planícies lisas e extensas</option>
                <option value="mountains">Montanhas e picos elevados</option>
                <option value="craters">Superfície acidentada por impactos</option>
                <option value="varied">Variado (Mistura de todos)</option>
              </select>
            </label>
          </div>

          <!-- ========================================== -->
          <!-- VIDA                                       -->
          <!-- ========================================== -->
          <div class="form-section">
            <h3>Vida</h3>
            
            <label>
              Existência de vida
              <select v-model="lifeLevel">
                <option value="none">Sem vida</option>
                <option value="simple">Vida simples (Micro-organismos / Insetos)</option>
                <option value="abundant">Vida abundante (Fauna selvagem e monstros)</option>
                <option value="intelligent">Vida inteligente e consciente</option>
              </select>
            </label>

            <template v-if="lifeLevel === 'intelligent'">
              <label>
                Tipo de habitantes
                <input v-model="inhabitantType" type="text" placeholder="Ex: Humanóides, Répteis falantes, Ciborgues..." />
              </label>

              <label>
                Nível de civilização / Tecnologia
                <select v-model="techLevel">
                  <option value="tribal">Tribal / Primitivo</option>
                  <option value="medieval">Medieval / Feudal</option>
                  <option value="industrial">Era Industrial</option>
                  <option value="modern">Moderna (Como nós)</option>
                  <option value="futuristic">Futurista / Intergaláctica</option>
                </select>
              </label>

              <label>
                Características culturais ou biológicas
                <textarea v-model="inhabitantCharacteristics" placeholder="Descreva como vivem, em que acreditam, como se organizam..." rows="2"></textarea>
              </label>
            </template>
          </div>

          <!-- ========================================== -->
          <!-- APARÊNCIA MANUAL (Opcional)                -->
          <!-- ========================================== -->
          <div class="form-section" style="border-bottom: none;">
            <h3 style="cursor: pointer; display: flex; justify-content: space-between" @click="showVisualTweaks = !showVisualTweaks">
              Ajustes Visuais Manuais 
              <span style="color: #b8bdd6;">{{ showVisualTweaks ? '▲ Ocultar' : '▼ Expandir' }}</span>
            </h3>
            
            <div v-show="showVisualTweaks" style="display: flex; flex-direction: column; gap: 16px; margin-top: 15px;">
              <p style="font-size: 12px; color: #b8bdd6; margin: 0 0 10px 0;">
                O sistema adapta as cores automaticamente com base na temperatura e natureza, mas você pode forçar as cores aqui.
              </p>

              <label>
                Cor da base do planeta
                <div class="colors">
                  <button
                    v-for="(color, index) in planetColors"
                    :key="'p'+index"
                    :style="{ background: color }"
                    :class="{ selected: planetColor === color }"
                    @click="planetColor = color"
                  ></button>
                </div>
              </label>

              <label>
                Cor predominante da terra
                <div class="colors">
                  <button
                    v-for="(color, index) in landColors"
                    :key="'l'+index"
                    :style="{ background: color }"
                    :class="{ selected: landColor === color }"
                    @click="landColor = color"
                  ></button>
                </div>
              </label>

              <label>
                Formato das terras
                <select v-model="continentStyle">
                  <option value="continental">Continentes grandes</option>
                  <option value="ilhas">Arquipélagos e Ilhas</option>
                  <option value="fragmentada">Fragmentos de terra</option>
                </select>
              </label>

              <label>
                Quantidade de massa terrestre
                <select v-model="landAmount">
                  <option value="none">Nenhuma</option>
                  <option value="low">Pouca terra</option>
                  <option value="medium">Média</option>
                  <option value="high">Muitas terras</option>
                </select>
              </label>

              <label>
                Textura visual da terra
                <select v-model="landTexture">
                  <option value="flat">Plana (Sólida)</option>
                  <option value="mountains">Montanhas / Rugosa</option>
                  <option value="craters">Crateras</option>
                  <option value="forest">Manchas (Florestas)</option>
                </select>
              </label>

              <label>
                Atmosfera
                <select v-model="hasAtmosphere">
                  <option :value="true">Ativada</option>
                  <option :value="false">Desativada</option>
                </select>
              </label>

              <template v-if="hasAtmosphere">
                <label>
                  Tipo de atmosfera
                  <select v-model="atmosphereTexture">
                    <option value="smooth">Lisa / Suave</option>
                    <option value="clouds">Nuvens Volumétricas</option>
                    <option value="dense">Densa / Tempestuosa</option>
                    <option value="boreal">Bruma / Fluxos de Vento</option>
                  </select>
                </label>

                <label>
                  Cor da atmosfera
                  <div class="colors">
                    <button
                      v-for="(color, index) in atmosphereColors"
                      :key="'a'+index"
                      :style="{ background: color }"
                      :class="{ selected: atmosphereColor === color }"
                      @click="atmosphereColor = color"
                    ></button>
                  </div>
                </label>

                <label>
                  Transparência da atmosfera
                  <div class="range-control">
                    <input v-model.number="atmosphereOpacity" type="range" min="10" max="90" step="5" />
                    <span>{{ atmosphereOpacity }}%</span>
                  </div>
                </label>
              </template>
            </div>
          </div>

          <button class="create-button" @click="createPlanet">
  Finalizar Criação
</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanetStore } from '../stores/planet'
import type { Planet } from '../types/planet'

const planetStore = usePlanetStore()
const router = useRouter()

// Toggles de UI
const showVisualTweaks = ref(false)

// IDENTIDADE
const planetName = ref('')
const demonym = ref('')
const planetDescription = ref('')

// CONDIÇÕES FÍSICAS (Base para o sistema reativo)
const planetSize = ref('medium')
const temperature = ref('temperate')
const waterLevel = ref('medium')
const gravity = ref('normal')
const climate = ref('temperate')

// NATUREZA
const relief = ref('varied')
const vegetation = ref('moderate')

// VIDA
const lifeLevel = ref('none')
const inhabitantType = ref('')
const techLevel = ref('tribal')
const inhabitantCharacteristics = ref('')

// APARÊNCIA VISUAL (Muitas destas serão guiadas pelas condições acima)
const landAmount = ref('medium')
const continentStyle = ref('continental')
const landTexture = ref('forest')
const hasAtmosphere = ref(true)
const atmosphereTexture = ref('clouds')
const atmosphereOpacity = ref(50)

// Dicionário de escala visual
const planetScaleMap: Record<string, number> = {
  small: 0.85,
  medium: 1,
  large: 1.15,
  giant: 1.3
}

// ARRAYS DE CORES
const atmosphereColors = [
  'rgb(124, 92, 255)',  // 0: Violeta
  'rgb(52, 152, 219)',  // 1: Azul
  'rgb(0, 230, 153)',   // 2: Verde Esmeralda
  'rgb(241, 196, 15)',  // 3: Dourado
  'rgb(255, 71, 87)',   // 4: Vermelho/Rosa
  'rgb(230, 126, 34)',  // 5: Laranja
  'rgb(236, 240, 241)', // 6: Névoa Branca
  'rgb(44, 62, 80)',    // 7: Cinza Escuro/Sombrio
] as const
const atmosphereColor = ref<string>(atmosphereColors[6])

const landColors = [
  '#27ae60', // 0: Verde Floresta
  '#16a085', // 1: Verde Água
  '#2980b9', // 2: Azul Gelo
  '#8e44ad', // 3: Roxo Alienígena
  '#c0392b', // 4: Vermelho Marciano
  '#f39c12', // 5: Laranja Deserto
  '#f1c40f', // 6: Amarelo Dourado
  '#2c3e50'  // 7: Cinza Rocha Escura
] as const
const landColor = ref<string>(landColors[0])

const planetColors = [
  'radial-gradient(circle at 30% 28%, #b8ecff 0%, #3d9fc5 42%, #164765 75%, #091b2b 100%)',
  'radial-gradient(circle at 30% 28%, #c9efbd 0%, #5d9f62 42%, #275233 75%, #122719 100%)',
  'radial-gradient(circle at 30% 28%, #ffd0a1 0%, #b96843 42%, #663328 75%, #2b1715 100%)',
  'radial-gradient(circle at 30% 28%, #fff0ad 0%, #c9a34b 42%, #72551f 75%, #32240d 100%)',
  'radial-gradient(circle at 30% 28%, #ffffff 0%, #b9d4df 42%, #607985 75%, #26343d 100%)',
  'radial-gradient(circle at 30% 28%, #d9c9ff 0%, #8066d9 42%, #30215f 75%, #171027 100%)',
  'radial-gradient(circle at 30% 28%, #ffc4f2 0%, #a85c9d 42%, #603263 75%, #28152c 100%)',
  'radial-gradient(circle at 30% 28%, #ffb49d 0%, #a84d42 42%, #57251f 75%, #24100e 100%)',
] as const
const planetColor = ref<string>(planetColors[0])

// ========================================================
// ENGINE DE REATIVIDADE: FÍSICA INFLUENCIANDO O VISUAL
// ========================================================

watch(temperature, (newTemp) => {
  if (newTemp === 'frozen') {
    planetColor.value = planetColors[4]
    landColor.value = landColors[2]
    atmosphereColor.value = atmosphereColors[6]
    atmosphereTexture.value = 'dense'
    vegetation.value = 'none'
    climate.value = 'freezing'
  } else if (newTemp === 'cold') {
    planetColor.value = planetColors[5]
    landColor.value = landColors[7]
    atmosphereColor.value = atmosphereColors[1]
    climate.value = 'temperate'
  } else if (newTemp === 'temperate') {
    planetColor.value = planetColors[0]
    landColor.value = landColors[0]
    atmosphereColor.value = atmosphereColors[6]
    atmosphereTexture.value = 'clouds'
    climate.value = 'temperate'
  } else if (newTemp === 'hot') {
    planetColor.value = planetColors[2]
    landColor.value = landColors[5]
    atmosphereColor.value = atmosphereColors[5]
    vegetation.value = 'little'
    climate.value = 'arid'
  } else if (newTemp === 'volcanic') {
    planetColor.value = planetColors[7]
    landColor.value = landColors[4]
    atmosphereColor.value = atmosphereColors[7]
    atmosphereTexture.value = 'dense'
    vegetation.value = 'none'
    waterLevel.value = 'none'
    climate.value = 'extreme'
  }
})

watch(waterLevel, (newWater) => {
  if (newWater === 'none') {
    landAmount.value = 'high'
    hasAtmosphere.value = true
  } else if (newWater === 'low') {
    landAmount.value = 'high'
  } else if (newWater === 'medium') {
    landAmount.value = 'medium'
  } else if (newWater === 'high') {
    landAmount.value = 'low'
    continentStyle.value = 'ilhas'
  }
})

watch(vegetation, (newVeg) => {
  if (newVeg === 'none') {
    landTexture.value = temperature.value === 'frozen' ? 'mountains' : 'craters'
    if (temperature.value === 'temperate') landColor.value = landColors[7]
  } else if (newVeg === 'little') {
    landTexture.value = 'mountains'
    if (['temperate', 'hot'].includes(temperature.value)) landColor.value = landColors[1]
  } else if (newVeg === 'moderate') {
    landTexture.value = 'forest'
    landColor.value = landColors[0]
  } else if (newVeg === 'abundant') {
    landTexture.value = 'forest'
    landColor.value = landColors[0]
    atmosphereOpacity.value = 60
  }
})

watch(climate, (newClimate) => {
  if (newClimate === 'extreme') atmosphereTexture.value = 'dense'
  if (newClimate === 'arid') atmosphereTexture.value = 'boreal'
})

watch(relief, (newRelief) => {
  if (vegetation.value !== 'moderate' && vegetation.value !== 'abundant') {
    if (newRelief === 'plains') landTexture.value = 'flat'
    else if (newRelief === 'mountains' || newRelief === 'valleys') landTexture.value = 'mountains'
    else if (newRelief === 'craters') landTexture.value = 'craters'
  }
})


// ========================================================
// CRIAÇÃO DO PLANETA E ENVIO PARA O STORE
// ========================================================
function createPlanet() {
  const loggedUserData = localStorage.getItem('alterra-logged-user')

if (!loggedUserData) {
  router.push('/login')
  return
}

const loggedUser = JSON.parse(loggedUserData)
  const newPlanet: Planet = {
    id: crypto.randomUUID(),

    name: planetName.value,
    demonym: demonym.value,
    description: planetDescription.value,

    size: planetSize.value,
    temperature: temperature.value,
    waterLevel: waterLevel.value,
    gravity: gravity.value,

    climate: climate.value,
    vegetation: vegetation.value,
    relief: relief.value,

    lifeLevel: lifeLevel.value,
    inhabitantType: inhabitantType.value,
    techLevel: techLevel.value,
    inhabitantCharacteristics: inhabitantCharacteristics.value,

    planetColor: planetColor.value,
    landColor: landColor.value,
    landAmount: landAmount.value,
    continentStyle: continentStyle.value,
    landTexture: landTexture.value,

    hasAtmosphere: hasAtmosphere.value,
    atmosphereTexture: atmosphereTexture.value,
    atmosphereColor: atmosphereColor.value,
    atmosphereOpacity: atmosphereOpacity.value,

    creatorId: loggedUser.id,
creatorName: loggedUser.name,
    population: 0,
residents: [],
points: 0,
pointsAwardedTo: [],
createdAt: new Date().toISOString(),
  }

 planetStore.addPlanet(newPlanet)
console.log('Planeta criado:', newPlanet)

router.push('/explorar')
}
</script>

<style scoped>
.create {
  min-height: 100vh;
  background: var(--color-background, #0b0e1b);
  color: var(--color-text, #ffffff);
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

.navbar a {
  color: #b8bdd6;
  text-decoration: none;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 70px 30px;
}

.heading span {
  color: #7c5cff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
}

.heading h1 {
  margin: 10px 0;
  font-size: 48px;
  font-family: 'Space Grotesk', sans-serif;
}

.heading p {
  max-width: 600px;
  color: #b8bdd6;
  font-size: 18px;
  line-height: 1.5;
}

.creator {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-top: 60px;
}

.preview,
.form {
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(174, 181, 208, 0.12);
}

.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  position: sticky;
  top: 100px;
  align-self: start;
}

.demonym-preview {
  color: #7c5cff;
  font-size: 14px;
  margin-top: 5px;
}

/* ================================= */
/* PLANETA E TEXTURAS CSS            */
/* ================================= */

.planet {
  position: relative;
  overflow: hidden;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  transform: scale(var(--planet-scale));
  transition: background 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.atmosphere {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  z-index: 8;
  pointer-events: none;
  background-color: var(--atmosphere-color);
  box-shadow: inset 0 0 30px var(--atmosphere-color);
  opacity: var(--atmosphere-opacity);
  mix-blend-mode: overlay;
  transition: background 0.4s ease, box-shadow 0.4s ease, opacity 0.4s ease;
}

.planet.atmo-tex-clouds .atmosphere {
  background-image:
    radial-gradient(ellipse 45% 18% at 18% 28%, rgba(255, 255, 255, 0.50), transparent 70%),
    radial-gradient(ellipse 38% 16% at 48% 18%, rgba(255, 255, 255, 0.42), transparent 70%),
    radial-gradient(ellipse 55% 20% at 75% 38%, rgba(255, 255, 255, 0.46), transparent 72%),
    radial-gradient(ellipse 48% 18% at 35% 68%, rgba(255, 255, 255, 0.38), transparent 70%),
    radial-gradient(ellipse 40% 15% at 78% 78%, rgba(255, 255, 255, 0.35), transparent 70%);
}

.planet.atmo-tex-dense .atmosphere {
  background-image:
    repeating-radial-gradient(ellipse at 62% 42%, transparent 0px, transparent 10px, rgba(255, 255, 255, 0.16) 13px, transparent 18px, transparent 28px),
    radial-gradient(ellipse at 62% 42%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.08) 18%, transparent 42%),
    radial-gradient(ellipse at 25% 70%, rgba(255, 255, 255, 0.22), transparent 30%),
    radial-gradient(ellipse at 78% 25%, rgba(0, 0, 0, 0.25), transparent 35%);
}

.planet.atmo-tex-boreal .atmosphere {
  background-image: linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, transparent 40%, rgba(255, 255, 255, 0.3) 70%, transparent 100%);
}

.planet-shadow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  z-index: 10;
  pointer-events: none;
  box-shadow: inset -32px -25px 45px rgba(0, 0, 0, 0.65), inset 15px 10px 22px rgba(255, 255, 255, 0.2);
}

.ocean {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.16), transparent 32%),
    radial-gradient(ellipse at 70% 75%, rgba(0, 30, 70, 0.18), transparent 55%),
    rgba(30, 130, 210, 0.20);
  mix-blend-mode: multiply;
  transition: background 0.4s ease, opacity 0.4s ease;
}

.planet.water-none .ocean { background: transparent !important; opacity: 0; }
.planet.water-low .ocean { background: radial-gradient(ellipse at 30% 25%, rgba(190, 240, 255, 0.20), transparent 35%), radial-gradient(ellipse at 70% 75%, rgba(0, 70, 150, 0.16), transparent 55%), rgba(30, 130, 210, 0.18); opacity: 0.75; }
.planet.water-medium .ocean { background: radial-gradient(ellipse at 28% 25%, rgba(220, 250, 255, 0.24), transparent 34%), radial-gradient(ellipse at 72% 72%, rgba(0, 50, 130, 0.25), transparent 55%), rgba(25, 125, 215, 0.28); opacity: 0.9; }
.planet.water-high .ocean { background: radial-gradient(ellipse at 28% 23%, rgba(235, 252, 255, 0.28), transparent 35%), radial-gradient(ellipse at 72% 75%, rgba(0, 35, 100, 0.30), transparent 58%), rgba(20, 115, 210, 0.38); opacity: 1; }

.continent {
  position: absolute;
  z-index: 4;
  display: none;
  transition: transform 0.4s ease, background-color 0.4s ease;
}
.planet.land-qty-none .continent { display: none !important; }

.planet.land-tex-flat .continent {
  background-image: radial-gradient(ellipse at 25% 20%, rgba(255, 255, 255, 0.18), transparent 30%), radial-gradient(ellipse at 70% 35%, rgba(255, 255, 255, 0.08), transparent 25%), radial-gradient(ellipse at 40% 75%, rgba(0, 0, 0, 0.15), transparent 40%), linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.12));
  box-shadow: inset 5px 5px 10px rgba(255, 255, 255, 0.12), inset -6px -7px 12px rgba(0, 0, 0, 0.20);
}
.planet.land-tex-mountains .continent {
  background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.10) 18%, transparent 35%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.28) 72%, rgba(0, 0, 0, 0.40) 100%), repeating-linear-gradient(125deg, rgba(255, 255, 255, 0.07) 0px, rgba(255, 255, 255, 0.07) 5px, transparent 5px, transparent 13px), radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.20), transparent 32%);
  box-shadow: inset 5px 5px 10px rgba(255, 255, 255, 0.24), inset -7px -8px 14px rgba(0, 0, 0, 0.34);
}
.planet.land-tex-craters .continent {
  background-image: radial-gradient(ellipse at 25% 25%, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.22) 8%, rgba(255, 255, 255, 0.12) 13%, transparent 20%), radial-gradient(ellipse at 65% 35%, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.18) 7%, rgba(255, 255, 255, 0.10) 12%, transparent 18%), radial-gradient(ellipse at 40% 72%, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.16) 8%, rgba(255, 255, 255, 0.10) 13%, transparent 20%), radial-gradient(ellipse at 80% 78%, rgba(0, 0, 0, 0.20), transparent 18%);
  box-shadow: inset 4px 4px 8px rgba(255, 255, 255, 0.10), inset -6px -7px 12px rgba(0, 0, 0, 0.25);
}
.planet.land-tex-forest .continent {
  background-image: radial-gradient(ellipse at 25% 25%, rgba(120, 255, 150, 0.35), transparent 28%), radial-gradient(ellipse at 65% 35%, rgba(20, 100, 45, 0.35), transparent 30%), radial-gradient(ellipse at 40% 70%, rgba(80, 180, 80, 0.28), transparent 35%), radial-gradient(ellipse at 80% 75%, rgba(10, 70, 35, 0.30), transparent 30%), linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(0, 0, 0, 0.15));
  box-shadow: inset 5px 5px 9px rgba(255, 255, 255, 0.14), inset -6px -7px 12px rgba(0, 0, 0, 0.26);
}

.planet.land-continental .continent { border-radius: 42% 58% 48% 52% / 55% 42% 58% 45%; }
.planet.land-ilhas .continent { border-radius: 55% 45% 60% 40% / 45% 55% 42% 58%; }
.planet.land-fragmentada .continent { border-radius: 25% 65% 35% 70% / 55% 30% 65% 40%; }

/* Formatos de Terras */
.land-continental .continent-1 { width: 90px; height: 70px; top: 25px; left: 20px; clip-path: polygon(5% 35%, 20% 10%, 45% 18%, 65% 5%, 90% 25%, 82% 50%, 95% 70%, 65% 92%, 40% 75%, 18% 88%, 2% 60%); }
.land-continental .continent-2 { width: 75px; height: 95px; top: 70px; right: 20px; clip-path: polygon(20% 5%, 55% 12%, 85% 30%, 72% 50%, 92% 70%, 60% 95%, 35% 78%, 10% 85%, 5% 55%, 20% 35%); }
.land-continental .continent-3 { width: 100px; height: 60px; bottom: 20px; left: 30px; clip-path: polygon(5% 40%, 20% 18%, 45% 25%, 60% 5%, 82% 20%, 98% 45%, 80% 65%, 65% 90%, 40% 75%, 20% 95%, 5% 70%); }
.land-continental .continent-4 { width: 55px; height: 60px; top: 20px; right: 40px; clip-path: polygon(20% 5%, 60% 10%, 90% 30%, 75% 55%, 90% 80%, 50% 95%, 25% 75%, 5% 50%, 15% 25%); }
.land-continental .continent-5 { width: 80px; height: 50px; bottom: 35px; right: 25px; clip-path: polygon(10% 20%, 40% 5%, 80% 15%, 95% 45%, 85% 80%, 50% 90%, 15% 75%, 5% 50%); }
.land-continental .continent-6 { width: 60px; height: 45px; top: 110px; left: 85px; clip-path: polygon(20% 10%, 60% 15%, 90% 40%, 75% 85%, 35% 95%, 5% 60%); }

.land-ilhas .continent-1 { width: 30px; height: 25px; top: 30px; left: 30px; clip-path: polygon(10% 40%, 30% 10%, 65% 20%, 90% 50%, 65% 85%, 30% 90%, 5% 60%); }
.land-ilhas .continent-2 { width: 24px; height: 20px; top: 65px; left: 75px; clip-path: polygon(15% 25%, 50% 5%, 90% 35%, 75% 80%, 35% 95%, 5% 60%); }
.land-ilhas .continent-3 { width: 35px; height: 28px; bottom: 40px; left: 45px; clip-path: polygon(15% 30%, 50% 10%, 85% 25%, 95% 60%, 60% 90%, 10% 75%); }
.land-ilhas .continent-4 { width: 25px; height: 22px; top: 50px; right: 40px; clip-path: polygon(20% 20%, 60% 0%, 100% 40%, 80% 80%, 30% 100%, 0% 60%); }
.land-ilhas .continent-5 { width: 28px; height: 32px; bottom: 60px; right: 45px; clip-path: polygon(10% 40%, 40% 5%, 80% 20%, 90% 60%, 50% 95%, 5% 75%); }
.land-ilhas .continent-6 { width: 20px; height: 18px; bottom: 30px; left: 110px; clip-path: polygon(30% 10%, 80% 20%, 95% 60%, 60% 90%, 10% 70%); }

.land-fragmentada .continent-1 { width: 50px; height: 38px; top: 25px; left: 25px; clip-path: polygon(5% 20%, 35% 5%, 55% 25%, 90% 15%, 75% 55%, 45% 50%, 25% 90%, 5% 60%); }
.land-fragmentada .continent-2 { width: 45px; height: 35px; top: 35px; right: 30px; clip-path: polygon(10% 30%, 40% 0%, 90% 25%, 85% 70%, 45% 100%, 0% 65%); }
.land-fragmentada .continent-3 { width: 55px; height: 40px; bottom: 30px; left: 25px; clip-path: polygon(15% 15%, 60% 5%, 95% 45%, 70% 90%, 20% 80%, 0% 40%); }
.land-fragmentada .continent-4 { width: 40px; height: 45px; bottom: 40px; right: 25px; clip-path: polygon(25% 10%, 75% 0%, 100% 50%, 65% 95%, 15% 85%, 0% 45%); }
.land-fragmentada .continent-5 { width: 35px; height: 30px; top: 100px; left: 80px; clip-path: polygon(10% 20%, 50% 5%, 90% 30%, 80% 80%, 40% 95%, 0% 60%); }
.land-fragmentada .continent-6 { width: 30px; height: 25px; top: 20px; left: 90px; clip-path: polygon(20% 10%, 80% 15%, 95% 60%, 60% 95%, 5% 70%); }

.planet.land-qty-low .continent-1, .planet.land-qty-low .continent-2 { display: block; }
.planet.land-qty-medium .continent-1, .planet.land-qty-medium .continent-2, .planet.land-qty-medium .continent-3, .planet.land-qty-medium .continent-4 { display: block; }
.planet.land-qty-high .continent-1, .planet.land-qty-high .continent-2, .planet.land-qty-high .continent-3, .planet.land-qty-high .continent-4, .planet.land-qty-high .continent-5, .planet.land-qty-high .continent-6 { display: block; }


/* ================================= */
/* FORMULÁRIOS                       */
/* ================================= */

.form { display: flex; flex-direction: column; }
.form-section { display: flex; flex-direction: column; gap: 16px; padding-bottom: 30px; margin-bottom: 25px; border-bottom: 1px solid rgba(174, 181, 208, 0.1); }
.form-section h3 { color: #7c5cff; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; user-select: none; }

label { display: flex; flex-direction: column; gap: 6px; color: #b8bdd6; font-size: 14px; }

.range-control { display: flex; align-items: center; gap: 12px; }
.range-control input[type="range"] { flex: 1; cursor: pointer; height: 6px; padding: 0; appearance: auto; border: none; }
.range-control span { font-weight: bold; color: #7c5cff; width: 35px; text-align: right; }

input:not([type="range"]), select, textarea { padding: 12px; border-radius: 10px; border: 1px solid rgba(174, 181, 208, 0.2); background: #11162b; color: white; outline: none; font-size: 14px; font-family: inherit; }
textarea { resize: vertical; }
input:focus, select:focus, textarea:focus { border-color: #7c5cff; }

.colors { display: flex; flex-wrap: wrap; gap: 10px; }
.colors button { width: 30px; height: 30px; border: 2px solid transparent; border-radius: 50%; cursor: pointer; transition: transform 0.2s; }
.colors button:hover { transform: scale(1.1); }
.colors button.selected { border-color: #ffffff; box-shadow: 0 0 10px rgba(255, 255, 255, 0.4); }

.create-button { padding: 18px; border: none; border-radius: 10px; background: #7c5cff; color: white; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 10px; transition: background 0.2s, transform 0.2s; }
.create-button:hover { background: #6944ff; transform: translateY(-2px); }

@media (max-width: 700px) {
  .navbar { padding: 0 20px; }
  .content { padding: 40px 20px; }
  .heading h1 { font-size: 38px; }
  .creator { grid-template-columns: 1fr; }
  .preview { position: static; }
}
</style>