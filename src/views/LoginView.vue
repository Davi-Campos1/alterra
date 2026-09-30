<template>
  <main class="login-page">
    <div class="stars"></div>

    <header class="navbar">
      <div class="logo">ALTERRA</div>

      <a href="/">Voltar para o início</a>
    </header>

    <section class="login-container">
      <div class="login-card">
        <span class="subtitle">BEM-VINDO DE VOLTA</span>

        <h1>Entre no seu universo.</h1>

        <p>
          Entre na sua conta para acessar seus planetas e continuar
          explorando o universo.
        </p>

        <form @submit.prevent="login">
          <div class="field">
            <label for="email">E-mail</label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="field">
            <label for="password">Senha</label>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Sua senha"
              required
            />
          </div>

          <p v-if="errorMessage" class="error">
            {{ errorMessage }}
          </p>

          <button type="submit">
            Entrar
          </button>
        </form>

        <div class="register">
          <span>Ainda não tem uma conta?</span>
          <a href="/cadastro">Criar conta</a>
        </div>
      </div>
    </section>
  </main>
</template>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

function login() {
  errorMessage.value = ''

  let users: {
    id: string
    name: string
    email: string
    password: string
    points?: number
  }[] = []

  // Procura a lista nova de usuários
  const savedUsers = localStorage.getItem('alterra-users')

  if (savedUsers) {
    try {
      users = JSON.parse(savedUsers)
    } catch {
      errorMessage.value = 'Erro ao carregar as contas.'
      return
    }
  }

  // Se não existir nenhuma conta na lista nova,
  // tenta recuperar a conta do sistema antigo
  if (users.length === 0) {
    const oldUser = localStorage.getItem('alterra-user')

    if (oldUser) {
      try {
        const user = JSON.parse(oldUser)

        if (user.points === undefined) {
          user.points = 0
        }

        users = [user]

        // Migra automaticamente para o novo sistema
        localStorage.setItem(
          'alterra-users',
          JSON.stringify(users)
        )
      } catch {
        errorMessage.value = 'Erro ao carregar a conta antiga.'
        return
      }
    }
  }

  // Se realmente não encontrou nenhuma conta
  if (users.length === 0) {
    errorMessage.value = 'Nenhuma conta encontrada.'
    return
  }

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.value.toLowerCase() &&
      item.password === password.value
  )

  if (!user) {
    errorMessage.value = 'E-mail ou senha incorretos.'
    return
  }

  // Contas antigas recebem 0 pontos
  if (user.points === undefined) {
    user.points = 0
  }

  // Salva a lista atualizada
  localStorage.setItem(
    'alterra-users',
    JSON.stringify(users)
  )

  // Define o usuário como logado
  userStore.setUser({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    points: user.points,
  })

  router.push('/explorar')
}
</script>
```


<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text);
}

.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.8;

  background-image:
    radial-gradient(circle at 10% 20%, white 1px, transparent 1.5px),
    radial-gradient(circle at 25% 70%, white 1px, transparent 1.5px),
    radial-gradient(circle at 40% 35%, white 1.5px, transparent 2px),
    radial-gradient(circle at 55% 80%, white 1px, transparent 1.5px),
    radial-gradient(circle at 70% 25%, white 1px, transparent 1.5px),
    radial-gradient(circle at 85% 65%, white 1.5px, transparent 2px),
    radial-gradient(circle at 95% 15%, white 1px, transparent 1.5px);
}

.navbar {
  position: relative;
  z-index: 2;

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
  color: var(--color-text-secondary);
  text-decoration: none;
}

.navbar a:hover {
  color: white;
}

.login-container {
  position: relative;
  z-index: 1;

  min-height: calc(100vh - 70px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;
}

.login-card {
  width: min(100%, 460px);

  padding: 40px;

  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(174, 181, 208, 0.15);

  border-radius: 24px;

  backdrop-filter: blur(15px);

  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.subtitle {
  color: var(--color-accent);

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 3px;
}

h1 {
  margin: 12px 0;

  font-family: 'Space Grotesk', sans-serif;
  font-size: 38px;
}

.login-card > p {
  color: var(--color-text-secondary);

  line-height: 1.6;
  margin-bottom: 30px;
}

.field {
  margin-bottom: 20px;
}

label {
  display: block;

  margin-bottom: 8px;

  color: #dfe3f5;

  font-size: 14px;
  font-weight: 600;
}

input {
  width: 100%;

  padding: 14px 15px;

  border-radius: 10px;
  border: 1px solid rgba(174, 181, 208, 0.2);

  background: rgba(0, 0, 0, 0.2);
  color: white;

  outline: none;

  transition: 0.2s ease;
}

input::placeholder {
  color: #737a99;
}

input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.12);
}

button {
  width: 100%;

  padding: 14px;

  border: none;
  border-radius: 10px;

  background: linear-gradient(
    135deg,
    #7c5cff,
    #6950e8
  );

  color: white;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s ease;
}

button:hover {
  transform: translateY(-2px);

  box-shadow: 0 10px 30px rgba(124, 92, 255, 0.3);
}

.error {
  margin: -5px 0 15px;

  color: #ff7180;

  font-size: 14px;
}

.register {
  display: flex;
  justify-content: center;
  gap: 5px;

  margin-top: 25px;

  font-size: 14px;
  color: var(--color-text-secondary);
}

.register a {
  color: var(--color-accent);
}

@media (max-width: 600px) {
  .navbar {
    padding: 0 20px;
  }

  .login-card {
    padding: 30px 22px;
  }

  h1 {
    font-size: 32px;
  }
}
</style>