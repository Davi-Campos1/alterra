<template>
 <main class="home">
  <div class="stars"></div>
    <header class="navbar">
      <div class="logo">ALTERRA</div>

      <nav>
  <a href="/explorar">Explorar</a>
  <a href="/login">Entrar</a>
</nav>
    </header>

    <section class="hero">
  <div class="glow"></div>
      <h1>Seu universo começa aqui.</h1>

      <p>
        Crie seu próprio planeta, personalize seu mundo e explore
        planetas criados por outras pessoas.
      </p>

      <div class="buttons">
      <button class="primary" @click="$router.push('/criar-planeta')">Criar Planeta
</button>

<button class="secondary" @click="$router.push('/explorar')">Explorar o universo
</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.glow {
  position: absolute;
  width: 500px;
  height: 500px;
  background: var(--color-primary);
  opacity: 0.12;
  filter: blur(120px);
  border-radius: 50%;
  pointer-events: none;
}

.home {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text);
}

/* Fundo estrelado */
.stars {
  position: absolute;
  inset: -50px;
  pointer-events: none;
  opacity: 0.85;

  background-image:
    radial-gradient(circle at 3% 8%, white 1px, transparent 1.5px),
    radial-gradient(circle at 7% 27%, white 1.5px, transparent 2px),
    radial-gradient(circle at 11% 51%, white 1px, transparent 1.5px),
    radial-gradient(circle at 15% 78%, white 1px, transparent 1.5px),
    radial-gradient(circle at 19% 14%, white 1px, transparent 1.5px),
    radial-gradient(circle at 23% 44%, white 1.5px, transparent 2px),
    radial-gradient(circle at 27% 91%, white 1px, transparent 1.5px),
    radial-gradient(circle at 31% 23%, white 1px, transparent 1.5px),
    radial-gradient(circle at 35% 67%, white 1.5px, transparent 2px),
    radial-gradient(circle at 39% 37%, white 1px, transparent 1.5px),
    radial-gradient(circle at 43% 82%, white 1px, transparent 1.5px),
    radial-gradient(circle at 47% 11%, white 1.5px, transparent 2px),
    radial-gradient(circle at 51% 54%, white 1px, transparent 1.5px),
    radial-gradient(circle at 55% 31%, white 1px, transparent 1.5px),
    radial-gradient(circle at 59% 76%, white 1.5px, transparent 2px),
    radial-gradient(circle at 63% 17%, white 1px, transparent 1.5px),
    radial-gradient(circle at 67% 47%, white 1px, transparent 1.5px),
    radial-gradient(circle at 71% 88%, white 1.5px, transparent 2px),
    radial-gradient(circle at 75% 29%, white 1px, transparent 1.5px),
    radial-gradient(circle at 79% 61%, white 1.5px, transparent 2px),
    radial-gradient(circle at 83% 6%, white 1px, transparent 1.5px),
    radial-gradient(circle at 87% 39%, white 1px, transparent 1.5px),
    radial-gradient(circle at 91% 72%, white 1.5px, transparent 2px),
    radial-gradient(circle at 95% 21%, white 1px, transparent 1.5px),
    radial-gradient(circle at 98% 55%, white 1px, transparent 1.5px),

    radial-gradient(circle at 5% 93%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 13% 36%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 21% 69%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 29% 5%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 37% 49%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 45% 94%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 53% 68%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 61% 5%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 69% 59%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 77% 95%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 85% 25%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
    radial-gradient(circle at 93% 84%, rgba(255,255,255,0.7) 1px, transparent 1.5px);

  background-size: 100% 100%;
  animation:
    starsMove 8s ease-in-out infinite,
    starsPulse 3s ease-in-out infinite;
}


.navbar {
  position: relative;
  z-index: 10;
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
  position: relative;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: 0.2s ease;
}

nav a:hover {
  color: white;
}

.hero {
  position: relative;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px;
}

h1 {
  font-size: 56px;
  margin: 0 0 20px;

  background: linear-gradient(
    90deg,
    #ffffff,
    var(--color-primary),
    var(--color-accent)
  );

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

p {
  max-width: 620px;
  font-size: 19px;
  line-height: 1.7;
  color: #b8bdd6;
  letter-spacing: 0.2px;
}

.buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

button {
  padding: 14px 26px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary {
  background: linear-gradient(
    135deg,
    #7c5cff,
    #6950e8
  );

  color: white;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 25px rgba(124, 92, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 35px rgba(124, 92, 255, 0.45);
}

.secondary {
  background: rgba(255, 255, 255, 0.03);
  color: white;
  border: 1px solid rgba(174, 181, 208, 0.3);
}

.secondary:hover {
  background: var(--color-accent);
  color: #080b1a;
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(77, 217, 255, 0.3);
}


@media (max-width: 600px) {
  .navbar {
    padding: 0 20px;
  }

  .logo {
    font-size: 20px;
  }

  nav {
    gap: 15px;
  }

  h1 {
    font-size: 40px;
  }

  p {
    font-size: 17px;
  }

  .buttons {
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  button {
    width: min(100%, 300px);
  }
}

@keyframes starsMove {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(-18px, 12px);
  }

  100% {
    transform: translate(0, 0);
  }
}

@keyframes starsPulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}
</style>