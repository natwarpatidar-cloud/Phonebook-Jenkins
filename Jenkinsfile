pipeline {
  agent any

  tools {
    nodejs 'NodeJS-18'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { sh 'npm ci' }
    }

    stage('Lint') {
      steps { sh 'npm run lint' }
    }

    stage('Test') {
      steps { sh 'npm run test' }
    }

    stage('Build') {
      steps { sh 'npm run build' }
    }

    stage('Trigger Vercel Deploy') {
      steps {
        sh 'curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_4iHy8Z6Epz7oXqXquXZbLi23qAzs/U0TrXQr6cd'
      }
    }
  }

  post {
    success { echo "✅ All tests passed and Vercel triggered!" }
    failure { echo "❌ Build failed. Check Jenkins logs." }
  }
}
