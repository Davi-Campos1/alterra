<template>
  <main class="register-page">
    <div class="stars"></div>

    <header class="navbar">
      <div class="logo">ALTERRA</div>

      <a href="/">Voltar para o início</a>
    </header>

    <section class="register-container">
      <div class="register-card">
        <span class="subtitle">COMECE SUA JORNADA</span>

        <h1>Crie seu universo.</h1>

        <p>
          Crie sua conta para começar a criar planetas e explorar
          o universo do ALTERRA.
        </p>

        <form @submit.prevent="createAccount">
          <div class="field">
            <label for="name">Nome</label>

            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Seu nome"
              required
            />
          </div>

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
              placeholder="Crie uma senha"
              minlength="6"
              required
            />
          </div>

          <p v-if="errorMessage" class="error">
            {{ errorMessage }}
          </p>

          <button type="submit">
            Criar conta
          </button>
        </form>

        <div class="login-link">
          <span>Já possui uma conta?</span>
          <a href="/login">Entrar</a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

function createAccount() {
  errorMessage.value = ''

  const savedUsers = localStorage.getItem('alterra-users')

  let users = []

  if (savedUsers) {
    try {
      users = JSON.parse(savedUsers)
    } catch {
      users = []
    }
  }

  const emailAlreadyExists = users.some(
    (user: { email: string }) =>
      user.email.toLowerCase() === email.value.toLowerCase()
  )

  if (emailAlreadyExists) {
    errorMessage.value = 'Este e-mail já está cadastrado.'
    return
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.value,
    email: email.value,
    password: password.value,
    points: 0,
  }

  users.push(user)

  localStorage.setItem(
    'alterra-users',
    JSON.stringify(users)
  )

  router.push('/login')
}
</script>

<style scoped>
.register-page {
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

.register-container {
  position: relative;
  z-index: 1;

  min-height: calc(100vh - 70px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;
}

.register-card {
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

.register-card > p {
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

  box-shadow:
    0 0 0 3px rgba(124, 92, 255, 0.12);
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

  box-shadow:
    0 10px 30px rgba(124, 92, 255, 0.3);
}

.error {
  margin: -5px 0 15px;

  color: #ff7180;

  font-size: 14px;
}

.login-link {
  display: flex;
  justify-content: center;
  gap: 5px;

  margin-top: 25px;

  font-size: 14px;

  color: var(--color-text-secondary);
}

.login-link a {
  color: var(--color-accent);
}

@media (max-width: 600px) {
  .navbar {
    padding: 0 20px;
  }

  .register-card {
    padding: 30px 22px;
  }

  h1 {
    font-size: 32px;
  }
}
</style>