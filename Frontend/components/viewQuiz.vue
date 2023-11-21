<template>
    <div class="quiz container m-auto flex flex-col">

        <!-- Chronomètre -->
        <div v-if="timer" class="timer flex justify-end text-white items-center">
            <p class="phase mr-4">{{ phase }}</p>
            <div class="flex justify-center items-center">
                <svg class="timer-circle stroke-blue-900 stroke-[4px]" width="50" height="50" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" class="circle-background stroke-blue-900 stroke-[4px]" />
                    <circle cx="50" cy="50" r="45" fill="none" :class="['circle-progress stroke-[4px]', circleColorClass]"
                        :style="circleStyle" />
                </svg>
                <div class="absolute">
                    {{ timer }}s
                </div>
            </div>
        </div>

        <div
            class="question m-auto text-center p-6 w-full mt-4 border border-gray-800 bg-gray-400 rounded-lg flex justify-center">
            <div v-if="currentQuestion">
                <p>{{ currentQuestion.content }}</p>
            </div>
        </div>
        <!-- Réponse QCM -->
        <div class="qcm grid grid-cols-2 gap-4 w-full mt-4 " v-if="isMultipleChoice">
            <button class="w-full bg-gray-400 hover:bg-blue-200 border-gray-800 border rounded-lg"
                v-for="(choice, index) in currentQuestion.choices" :key="index" @click="submitAnswer(choice)">
                <p class="p-4">{{ choice }}</p>
            </button>
        </div>

        <!-- Réponse ouverte (pas de choix multiples) -->
        <div v-else class="mt-4">
            <input type="text" v-model="userResponse" class="border border-gray-800 rounded-lg p-2 w-full"
                placeholder="Votre réponse ici">
            <button @click="submitOpenResponse"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Soumettre</button>
        </div>

        <!-- Réponse Affichée -->
        <div v-if="answer" class="answer m-auto text-center mt-4">
            La bonne réponse : {{ answer }}
        </div>

        <button @click="startGame">Démarrer le Jeu</button>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            socket: null,
            currentQuestion: null,
            answer: null,
            timer: 0,
            fullTimer: 0,
            timerInterval: null,
            phase: null
        };
    },
    mounted() {
        this.socket = this.$nuxtSocket({ name: 'main' });

        this.socket.on('gameStarting', (message) => {
            this.currentQuestion = null; // Réinitialiser la question actuelle
        });

        this.socket.on('newQuestion', (data) => {
            this.currentQuestion = data.question;
            this.answer = null; // Réinitialiser la réponse
            this.phase = "Temps restant : ";
            this.setTimer(data.timer); // Démarrer le chronomètre pour 15 secondes
        });

        this.socket.on('answer', (data) => {
            this.answer = data.answer;
            this.phase = "Correction : ";
            this.setTimer(data.timer); // Afficher la réponse pendant 5 secondes
        });

        this.socket.on('waitingForNext', (data) => {
            this.phase = "Question suivante : ";
            this.setTimer(data.timer); // Affiche la question suivante dans 3 secondes
        });

    },
    methods: {
        startGame() {
            this.socket.emit('startGame', { nbQuestion: 8 });
        },
        submitAnswer(choice) {
            console.log('Réponse soumise:', choice);
            // Envoyer la réponse au serveur ou passer à la question suivante
        },
        submitOpenResponse() {
            console.log('Réponse ouverte soumise:', this.userResponse);
            // Envoyer la réponse ouverte au serveur
        },
        setTimer(seconds) {
            this.fullTimer = seconds
            this.timer = seconds;
            clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                if (this.timer > 0) {
                    this.timer -= 1;
                } else {
                    clearInterval(this.timerInterval);
                }
            }, 1000);
        }
    },
    computed: {
        circleStyle() {
            const totalLength = 2 * Math.PI * 45; // Circonférence du cercle (rayon = 45)
            const filledLength = (totalLength / this.fullTimer) * this.timer; // Remplissage basé sur le timer
            return {
                strokeDasharray: `${totalLength} ${totalLength}`,
                strokeDashoffset: totalLength - filledLength,
            };
        },

        isMultipleChoice() {
            return this.currentQuestion && Array.isArray(this.currentQuestion.choices);
        },

        circleColorClass() {
            if (this.timer < 4) {
                return 'stroke-red-500';
            }
            if (this.timer < 11) {
                return 'stroke-orange-300';
            }
            if (this.timer < 8) {
                return 'stroke-orange-400';
            }
            if (this.timer < 6) {
                return 'stroke-orange-500';
            }
            if (this.timer >= 11) {
                return 'stroke-white';
            }
        },
    },
    beforeDestroy() {
        clearInterval(this.timerInterval);
    }
}
</script>

<style>
.timer-circle .circle-progress {
    /* Couleur de progression */

    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 0.5s linear;
}
</style>
  