pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git url:'https://github.com/pedrobrafel/testes-api-cy.git', branch: 'main' 
            }
        }
        stage('Instalar dependências') {
            steps {
                sh 'npm install'
            }
        }
        stage('Executar testes') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
}
