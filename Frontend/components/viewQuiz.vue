<template>
    <div class="quiz container flex flex-col">
        <div class="question">
            <button @click="startGame">Démarrer le Jeu</button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      socket: null,
    };
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main', // Le nom du socket défini dans nuxt.config.js
    });

    // Écouter les événements du serveur
    this.socket.on('newQuestion', (question) => {
      console.log('Nouvelle question:', question);
      // Traiter la question ici
    });

    this.socket.on('gameStarting', (message) => {
      console.log('Message from server:', message);
      // Traiter le message ici
    });
  },
  methods: {
    startGame() {
        console.log('click')
        console.log('Socket instance:', this.socket);
      this.socket.emit('startGame', { nbQuestion: 5 }, (response) => {
        // Gérer la réponse, si nécessaire
        console.log('Response from startGame event:', response);
      });
    }
  }
}
</script>