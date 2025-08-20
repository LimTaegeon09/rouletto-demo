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
                // bat 스크립트가 실패해도(0이 아닌 종료 코드를 반환해도) 파이프라인을 중단하지 않도록 설정합니다.
                script {
                    def result = bat(script: '"C:\\ProgramData\\cocos\\editors\\Creator\\3.8.0\\CocosCreator.exe" --project . --build "platform=web-mobile;debug=false;mainBundleCompressionType=merge_dep"', returnStatus: true)
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
                    // ★★ git 명령어 앞에 전체 경로를 추가합니다. ★★
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" init'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" config user.name "Jenkins-Bot"'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" config user.email "jenkins@example.com"'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" add .'
                    bat '"C:\\Program Files\\Git\\bin\\git.exe" commit -m "Deploy new build #${env.BUILD_NUMBER}"'

                    withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        bat '"C:\\Program Files\\Git\\bin\\git.exe" remote add origin https://${GIT_USER}:${GIT_TOKEN}@github.com/LimTaegeon09/rouletto-demo-deploy.git'
                        bat '"C:\\Program Files\\Git\\bin\\git.exe" push -f origin master'
                    }
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