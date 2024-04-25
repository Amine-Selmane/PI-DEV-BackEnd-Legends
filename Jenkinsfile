pipeline {
    agent any

    stages {
        stage('Supprimer les dépendances existantes') {
            steps {
                script {
                    sh 'rm -rf node_modules'
                }
            }
        }

        stage('Install dependencies') {
            steps {
                script {
                    sh('npm install')
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'scanner'
                    withSonarQubeEnv {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Build application') {
            steps {
                script {
                    sh('npm run build')
                }
            }
        }

        stage('Building images (node and mongo)') {
            steps {
                script {
                    sh('docker-compose build --verbose')
                    sh('docker-compose up -d') // Pour démarrer les services en arrière-plan
                    sh('docker-compose logs db')
                }
            }
        }

    }
}
