pipeline {
    // Cocos Creator v3.8.0 버전이 설치된 Docker 이미지를 빌드 환경으로 사용합니다.
    agent {
        docker { image 'cocoscreator/cocos-engine-native:3.8.0-linux' }
    }

    // 파이프라인 전체에서 사용할 환경 변수를 정의합니다.
    environment {
        // 배포할 저장소 주소입니다.
        DEPLOY_REPO_URL = "https://github.com/LimTaegeon09/rouletto-demo-deploy.git"
        // Jenkins에 저장된 GitHub Personal Access Token의 Credential ID 입니다.
        GIT_CREDENTIAL_ID = 'github-token'
    }

    stages {
        // --- 1단계: 소스코드 가져오기 ---
        stage('Checkout Source') {
            steps {
                // Jenkins 파이프라인 설정에 연결된 rouletto-demo 저장소의 코드를 가져옵니다.
                echo '원본 프로젝트 소스코드를 가져옵니다...'
                checkout scm
            }
        }

        // --- 2단계: Cocos Creator 프로젝트 빌드 ---
        stage('Build Project') {
            steps {
                echo 'Cocos Creator 프로젝트 빌드를 시작합니다...'
                
                // ⭐ 중요: 아래 startSceneUuid 값을 본인 프로젝트에 맞게 수정해야 합니다.
                // Cocos Creator 에디터에서 시작 씬을 클릭하고, Inspector 창의 UUID 값을 복사해서 붙여넣으세요.
                script {
                    def startSceneUuid = "07a61c44-39e6-4f08-b4fa-98629d167670"
                    
                    // 제공해주신 빌드 옵션으로 빌드를 실행합니다.
                    sh "cocos-creator --path . --build \"platform=web-mobile;debug=false;mainBundleCompressionType=merge_dep;startScene=${startSceneUuid};useSplashScreen=false\""
                }
            }
        }

        // --- 3단계: 빌드 결과물 배포하기 ---
        stage('Deploy') {
            steps {
                echo '빌드 결과물을 배포 저장소로 업로드합니다...'
                
                // withCredentials 블록 안에서만 GitHub 인증(토큰)을 사용합니다.
                withCredentials([string(credentialsId: GIT_CREDENTIAL_ID, variable: 'GIT_TOKEN')]) {
                    script {
                        // 1. 배포용 저장소를 'deploy'라는 이름의 서브폴더에 복제(clone)합니다.
                        sh "git clone https://oauth2:${GIT_TOKEN}@github.com/LimTaegeon09/rouletto-demo-deploy.git deploy"

                        // 2. deploy 폴더로 이동합니다.
                        dir('deploy') {
                            // 3. 기존에 있던 파일들을 모두 삭제합니다. (.git 폴더 제외)
                            sh 'find . -path ./.git -prune -o -exec rm -rf {} +'

                            // 4. 원본 프로젝트의 빌드 결과물을 deploy 폴더로 복사합니다.
                            // 빌드 결과물은 Jenkins 작업 공간의 'build/web-mobile' 폴더에 있습니다.
                            sh 'cp -a ../build/web-mobile/. .'

                            // 5. Git에 커밋할 사용자 정보를 설정합니다.
                            sh 'git config user.name "Jenkins CI"'
                            sh 'git config user.email "jenkins-ci@users.noreply.github.com"'

                            // 6. 변경된 모든 파일을 추가하고 커밋합니다.
                            sh 'git add .'
                            sh "git commit -m 'Deploy new build from Jenkins - Build #${env.BUILD_NUMBER}'"

                            // 7. master 브랜치로 푸시하여 배포를 완료합니다.
                            sh 'git push origin master'
                        }
                    }
                }
            }
        }
    }
}