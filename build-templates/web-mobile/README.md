![GitHub release (latest by date)](https://img.shields.io/github/v/release/LimTaegeon09/rouletto-demo)

# rouletto-demo

=========================================
게임 설정 파일 (settings.json) 설명서
=========================================

이 파일은 Rouletto 게임의 주요 설정을 관리하는 settings.json 파일입니다.
이 파일의 값을 수정하고 게임을 새로고침하면, 프로그램을 다시 빌드하지 않아도 설정을 실시간으로 변경할 수 있습니다.


## 주의사항
- 파일 수정 시 반드시 JSON 형식을 지켜주세요.
- 숫자 값에 따옴표("")를 넣거나, 마지막 항목 뒤에 콤마(,)를 추가하면 에러가 발생합니다.
- 파일은 UTF-8 형식으로 저장해야 합니다.


## 설정 항목 설명 (Parameter Descriptions)

---
### [공통 설정]

- WEBSOCKET_URL
  - 설명: 웹소켓 서버 접속 주소
  - 타입: 문자열 (String)
  - 예시: "ws://roulettex.iptime.org:8080/ws"

- COUNTDOWN_TIME
  - 설명: 'PLACE YOUR BETS' 메시지가 표시되는 카운트다운 시간 (초 단위)
  - 타입: 숫자 (Number)
  - 예시: 29

- WS_RECONNECTION_TIME
  - 설명: 웹소켓 연결이 끊겼을 때 재연결을 시도하는 딜레이 시간 (초 단위)
  - 타입: 숫자 (Number)
  - 예시: 2

- INITIAL_USER_CREDIT
  - 설명: 게임 시작 시 유저에게 기본으로 지급되는 크레딧 금액
  - 타입: 숫자 (Number)
  - 예시: 60000

- PANEL_CYCLE_INTERVAL
  - 설명: 게임 패널 순환 시간 (초 단위)
  - 타입: 숫자 (Number)
  - 예시: 3

- HISTORY_BLINK_DURATION
  - 설명: 히스토리 영역의 반짝이는 연출 주기 (초 단위)
  - 타입: 숫자 (Number)
  - 예시: 2

---
### [게임별 베팅 설정]

- CHIP_VALUES
  - 설명: 플레이어가 선택할 수 있는 칩의 금액 단위를 정의하는 배열
  - 타입: 숫자 배열 (Array of Numbers)
  - 예시: [1, 2, 5, 10, 25, 50, 100]

- MIN_BET_BASIC
  - 설명: 'Basic' 게임의 최소 베팅 금액
  - 타입: 숫자 (Number)
  - 예시: 1

- MAX_BET_BASIC
  - 설명: 'Basic' 게임의 최대 베팅 금액
  - 타입: 숫자 (Number)
  - 예시: 100

- MIN_BET_FOURSUM
  - 설명: 'FourSum' 게임의 최소 베팅 금액
  - 타입: 숫자 (Number)
  - 예시: 1

- MAX_BET_FOURSUM
  - 설명: 'FourSum' 게임의 최대 베팅 금액
  - 타입: 숫자 (Number)
  - 예시: 100

- MIN_BET_JACKPOT
  - 설명: 'Jackpot' 게임의 최소 베팅 금액
  - 타입: 숫자 (Number)
  - 예시: 5

---
### [잭팟 게임 전용 설정]

- MIN_PRIZE_JACKPOT
  - 설명: 잭팟의 최소 시작 상금
  - 타입: 숫자 (Number)
  - 예시: 3500

- INCREMENT_PRIZE_JACKPOT
  - 설명: 베팅 시마다 잭팟 상금에 누적되는 금액
  - 타입: 숫자 (Number)
  - 예시: 0.2

=========================================