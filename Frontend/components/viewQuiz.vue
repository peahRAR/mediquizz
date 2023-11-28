<template>
    <div class="quiz container m-auto flex flex-col">

        <div v-if="gameState === 'on'" class="flex items-center justify-between">
            <div v-if="currentQuestionNumber > 0" class="question-info w-full">
                <p class=" text-white text-lg font-bold">
                    Q : {{ currentQuestionNumber }}/{{ totalQuestions }}
                </p>
            </div>
            <!-- Chronomètre -->
            <div v-if="timer" class=" w-full timer flex justify-end text-white items-center">
                <p class="step mr-4">{{ step }}</p>
                <div class="flex justify-center items-center">
                    <svg class="timer-circle stroke-blue-900 stroke-[4px]" width="50" height="50" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" class="circle-background stroke-blue-900 stroke-[4px]" />
                        <circle cx="50" cy="50" r="45" fill="none"
                            :class="['circle-progress stroke-[4px]', circleColorClass]" :style="circleStyle" />
                    </svg>
                    <div class="absolute">
                        {{ timer - 1 }}s
                    </div>
                </div>
            </div>
        </div>

        <div v-if="gameState === 'on'"
            class="question select-none m-auto text-center p-6 w-full mt-4 border border-gray-800 bg-gray-400 rounded-lg flex justify-center">
            <div>
                <p v-if="currentQuestion">{{ currentQuestion.content }}</p>
                <p v-else>Veuillez patienter...</p>
            </div>
        </div>
        <!-- Réponse QCM -->
        <div class="qcm grid grid-cols-2 gap-4 w-full mt-4 " v-if="isMultipleChoice">
            <button v-for="(choice, index) in currentQuestion.choices" :key="choice.id"
                @click="timeIsUp || currentLives < 1 ? null : submitAnswer(choice.content)"
                :disabled="timeIsUp || currentLives < 1" :class="[getButtonClass(choice)]"
                class="border select-none border-gray-800 bg-gray-400 rounded-lg">
                <p class="p-4">{{ choice.content }}</p>
            </button>
        </div>

        <!-- Réponse ouverte (pas de choix multiples) -->
        <div v-if="!isMultipleChoice && currentQuestion" class="mt-4">
            <input type="text" v-model="userResponse" class="border border-gray-800 rounded-lg p-2 w-full"
                placeholder="Votre réponse ici">
            <button @click="submitOpenResponse"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Soumettre</button>
        </div>

        <!-- Réponse Affichée -->
        <div v-if="answer && !isMultipleChoice && currentQuestion" class="answer m-auto text-center mt-4">
            La bonne réponse : {{ answer }}
        </div>

        <button v-if="gameState === 'off'" @click="startGame">Démarrer le Jeu</button>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            socket: null,
            currentQuestion: null,
            answer: null,
            userAnswer: null,
            timer: 0,
            fullTimer: 0,
            timerInterval: null,
            step: null,
            correctAnswer: null,
            gameState: 'off',
            currentQuestionNumber: 0,
            totalQuestions: 0,
            timeIsUp: false,
            currentLives: 0,
            idQuestion: null,
            isCorrect: null,
        };
    },
    mounted() {
        this.socket = this.$nuxtSocket({ name: 'main' });

        this.socket.on('gameStarting', (data) => {
            this.step = "La partie va commencer : ";
            this.gameState = 'on'
            this.setTimer(data.timer);
            this.totalQuestions = data.nbQuestion;
            this.currentQuestionNumber = 0;
            this.currentQuestion = null; // Réinitialiser la question actuelle
        });

        this.socket.on('newQuestion', (data) => {
            this.userAnswer = null;
            this.currentQuestion = data.questionData;
            this.currentLives = data.questionData.lives;
            this.idQuestion = data.questionData.idQuestion;
            if (this.currentQuestionNumber < this.totalQuestions) {
                this.currentQuestionNumber += 1;
            }
            this.answer = null; // Réinitialiser la réponse
            this.step = "Temps restant : ";
            this.setTimer(data.timer); // Démarrer le chronomètre pour 15 secondes
        });

        this.socket.on('answer', (data) => {
            this.timeIsUp = true;
            this.answer = data.answer;
            this.step = "Correction : ";
            this.correctAnswer = data.answer;
            this.setTimer(data.timer); // Afficher la réponse pendant 5 secondes
        });

        this.socket.on('waitingForNext', (data) => {
            this.step = "Question suivante : ";
            this.timeIsUp = false;
            this.currentQuestion = null;
            this.setTimer(data.timer); // Affiche la question suivante dans 3 secondes
        });

        this.socket.on('answerResult', (data) => {
            this.isCorrect = data.correct
            this.currentLives = data.lives; // Mettre à jour les tentatives restante restantes

        })

    },
    methods: {
        startGame() {
            this.socket.emit('startGame', { nbQuestion: 8 });
        },
        submitAnswer(choice) {
            this.userAnswer = choice
            if (this.currentLives > 0 && !this.timeIsUp) {
                this.socket.emit('submitAnswer', { answer: choice, questionId: this.idQuestion });
            } else {
                // ... gérer le cas où il n'y a plus de vies ...
                return
            }
        },
        submitOpenResponse() {
            console.log('Réponse ouverte soumise:', this.userResponse);
            // Envoyer la réponse ouverte au serveur
        },
        setTimer(seconds) {
            this.fullTimer = seconds;
            this.timer = seconds;
            clearInterval(this.timerInterval);

            this.timerInterval = setInterval(() => {
                if (this.timer > 0) {
                    this.timer -= 1;
                }

                if (this.timer <= 0) {
                    clearInterval(this.timerInterval);
                }
            }, 1000);
        },
        getButtonClass(choice) {
            // Si le temps n'est pas écoulé et que l'utilisateur a choisi cette option
            if (!this.timeIsUp && choice.content === this.userAnswer) {
                return this.isCorrect ? 'correct' : 'wrong';
            }
            // Sinon, appliquer la classe par défaut
            if (this.currentLives < 1 && this.userAnswer != null && choice.content !== this.userAnswer) {
                return 'disabled-button'
            }
            return 'regular';
        },
    },
    computed: {
        circleStyle() {
            const totalLength = 2 * Math.PI * 45; // Circonférence du cercle (rayon = 45)
            let filledLength;

            if (this.timer <= 0) {
                filledLength = totalLength; // Le cercle doit être complètement vide
            } else {
                filledLength = (totalLength / this.fullTimer) * this.timer;
            }

            return {
                strokeDasharray: `${totalLength} ${totalLength}`,
                strokeDashoffset: totalLength - filledLength,
            };
        },

        isMultipleChoice() {
            return this.currentQuestion && Array.isArray(this.currentQuestion.choices);
        },

        circleColorClass() {
            return this.timer < 4 ? 'stroke-red-500' :
                this.timer < 6 ? 'stroke-orange-500' :
                    this.timer < 8 ? 'stroke-orange-400' :
                        this.timer < 11 ? 'stroke-orange-300' :
                            'stroke-white';
        },
    },
    beforeDestroy() {
        clearInterval(this.timerInterval);
    }
}
</script>

<style>
.timer-circle .circle-progress {
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 0.5s linear;
}

.correct {
    @apply bg-green-500;
}

.regular:hover {
    @apply bg-blue-300;
}

.wrong {
    @apply bg-red-500;
}

.disabled-button {
    @apply opacity-50;
}
</style>
  