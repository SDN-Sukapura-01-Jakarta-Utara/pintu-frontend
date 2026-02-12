<template>
  <div class="backoffice-layout">
    <!-- Animated Background -->
    <div class="animated-background">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>

<style scoped>
.backoffice-layout {
  background: linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 50%, #f5f5f5 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
}

/* Blob animations */
.blob {
  position: absolute;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  opacity: 0.1;
  animation: blob-animation 8s infinite;
}

.blob-1 {
  width: 300px;
  height: 300px;
  background: #C82333;
  top: -10%;
  right: -5%;
  animation-delay: 0s;
  animation: blob-animation 8s infinite;
}

.blob-2 {
  width: 250px;
  height: 250px;
  background: #ff6b9d;
  top: 40%;
  left: -8%;
  animation-delay: 2s;
  animation: blob-animation 7s infinite;
}

.blob-3 {
  width: 280px;
  height: 280px;
  background: #C82333;
  bottom: -10%;
  right: 10%;
  animation-delay: 4s;
  animation: blob-animation 9s infinite;
}

.blob-4 {
  width: 200px;
  height: 200px;
  background: #ff6b9d;
  bottom: 20%;
  left: 5%;
  animation-delay: 1s;
  animation: blob-animation 6.5s infinite;
}

@keyframes blob-animation {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
</style>
