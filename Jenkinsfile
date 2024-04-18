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
    }
}
