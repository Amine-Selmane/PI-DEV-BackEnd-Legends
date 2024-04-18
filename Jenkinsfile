pipeline{
  agent any
// environment {
// registryCredentials = "nexus"
// registry = "172.23.220.131:8083"
// }

  stages {

 stage('Supprimer les dépendances existantes') {
      steps {
        script {
          sh 'rm -rf node_modules'
        }
      }
    }
 
  stage('Install dependencies') {
      steps{

       script {
      sh('npm install --legacy-peer-deps')
       }
     }
   }

   
//   stage('Unit Test') {
//         steps{
//             script {
//             sh('npm test')
//                   }
//             }
//       }

//   stage('SonarQube Analysis') {
//       steps{
//       script {
//       def scannerHome = tool 'scanner'
//       withSonarQubeEnv {
//       sh "${scannerHome}/bin/sonar-scanner"
//       }
//        }
//      }
//    }

//   stage('Build application') {
//       steps{

//         script {
//          sh('npm run build')
//         }
//       }
//       }
//   stage('Building images (node and mongo)') {
//       steps{
//         script {
//          sh('docker-compose build')
//        }
//        }
//       }
//  stage('Deploy to Nexus') {
//       steps{
//         script {
//             docker.withRegistry("http://"+registry,
//             registryCredentials ) {
//             sh('docker push $registry/nodemongoapp:6.0 ')
//             }
//            }
//       }
//       }
//  stage('Run application ') {
//       steps{
//         script {
//             docker.withRegistry("http://"+registry, registryCredentials) {
//                sh('docker pull $registry/nodemongoapp:6.0 ')
//                sh('docker-compose up -d ')
//             }
//            }
//       }
//      }

//       stage('Run Prometheus'){
//             steps{
//                   script{
//                         sh('docker start prometheus')
//                   }
//             }
//       }
//       stage('Run Grafana'){
//             steps{
//                   script{
//                         sh('docker start grafana')
//                   }
//             }
//       }
    }
  }