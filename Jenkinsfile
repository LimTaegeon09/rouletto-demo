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
                bat '"C:\\ProgramData\\cocos\\editors\\Creator\\3.8.0\\CocosCreator.exe" --project . --build "platform=web-mobile;debug=false"'
            }
        }
        stage('Deploy to Git') {
            steps {
                echo '3. 빌드 결과물을 배포용 저장소에 푸시합니다...'
                dir('build/web-mobile') {
                    bat 'git init'
                    bat 'git config user.name "Jenkins-Bot"'
                    bat 'git config user.email "menuhi09@gmail.com"'
                    bat 'git add .'
                    bat 'git commit -m "Deploy new build #${env.BUILD_NUMBER}"'
                    
                    withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        bat 'git remote add origin https://${GIT_USER}:${GIT_TOKEN}@github.com/LimTaegeon09/rouletto-demo-deploy.git'
                        bat 'git push -f origin main'
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