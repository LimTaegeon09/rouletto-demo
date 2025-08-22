pipeline {
    agent any

    stages {
        stage('Cocos Creator Build') {
            steps {
                echo '1. Cocos Creator 빌드를 시작합니다...'
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
                echo '2. 빌드 결과물을 배포용 저장소에 푸시합니다...'
                dir('build/web-mobile') {                    
                    script {
                        def gitExe = '"C:\\Program Files\\Git\\bin\\git.exe"'
                        // 1. 빌드 번호가 포함된 커밋 메시지를 변수로 생성합니다.
                        def commitMessage = "Deploy new build #${env.BUILD_NUMBER}"

                        bat "${gitExe} init"
                        bat "${gitExe} checkout -b master"
                        bat "${gitExe} config user.name \"Jenkins-Bot\""
                        bat "${gitExe} config user.email \"jenkins@example.com\""
                        bat "${gitExe} add ."
                        // 2. 위에서 만든 변수를 사용하여 커밋합니다.
                        bat "${gitExe} commit -m \"${commitMessage}\""
                        bat "${gitExe} remote add origin https://github.com/LimTaegeon09/rouletto-demo-deploy.git"
                        bat "${gitExe} push -f origin master"
                    }
                }
            }
        }
    }
    post {
        always {
            echo '3. 작업 완료 후 임시 파일을 정리합니다...'
            dir('build/web-mobile') {
                bat 'rd .git /s /q'
            }
        }
    }
}