# DS_quaridor
Making online board game quaridor

현재 되는 것
player 1, 2 사이 텍스트를 주고 받는 것이 가능

해야 할 것
일단 쿼리도 js로 바꾸기 -> 이거 되면 텍스트 입력 받아서 쿼리도 플레이 할수는 있음

visualization: 
1. 마우스 input 받기: onclick event manager
onmouseover/onmouseout 이벤트 사용하여 클릭 미리보기 구현

'move dx dy', 'block x y orientation' 형식으로 변환하여 서버로 전송, 서버에서 맵을 업데이트 후 2차원 스트링 형태로 클라이언트에게 재전송 -> canvas에서 맵 새로 그리기
