pipeline {
    agent any

    stages {
        stage('Checkout Source') {
            steps {
                echo '1. 소스 코드를 가져옵니다...'                
                git branch: 'master', url: 'https://github.com/LimTaegeon09/rouletto-demo.git'
            }
        }
        stage('Cocos Creator Build') {
            steps {
                echo '2. Cocos Creator 빌드를 시작합니다...'
                script {                    
                    def startSceneUuid = '07a61c44-39e6-4f08-b4fa-98629d167670'                                        
                    def command = "\"C:\\ProgramData\\cocos\\editors\\Creator\\3.8.0\\CocosCreator.exe\" --project . --build \"platform=web-mobile;debug=false;mainBundleCompressionType=merge_dep;startScene=${startSceneUuid};useSplashScreen=false\""
                    def result = bat(script: command, returnStatus: true)
                    if (result != 0) {
                        echo "빌드 프로세스가 종료 코드 ${result}를 반환했지만, 배포를 계속 진행합니다."
                    }
                }
            }
        }
        stage('Deploy to Git') {
            steps {
                echo '3. 빌드 결과물을 배포용 저장소에 푸시합니다...'
                dir('build/web-mobile') {                    
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" init'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" checkout -b master'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" config user.name "Jenkins-Bot"'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" config user.email "jenkins@example.com"'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" add .'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" commit -m "Deploy new build #${env.BUILD_NUMBER}"'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" remote add origin https://github.com/LimTaegeon09/rouletto-demo-deploy.git'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" push -f origin master'
                }
            }
        }
    }
    post {
        always {
            echo '4. 작업 완료 후 임시 파일을 정리합니다...'
            dir('build/web-mobile') {
                bat 'rd .git /s /q'
            }
        }
    }
}