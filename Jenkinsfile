pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }
        stage('Test Coverage') {
            steps {
                bat 'npm run coverage --workspace=mdx'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool name: 'SonarScanner',
                                           type: 'hudson.plugins.sonar.SonarRunnerInstallation'

                    withSonarQubeEnv('SonarScanner') { 
                        bat """
                          "${scannerHome}\\bin\\sonar-scanner.bat" ^
                          -Dsonar.projectKey=Mkit-UI ^
                          -Dsonar.sources=.
                        """
                    }
                }
            }
        }
    }
}
