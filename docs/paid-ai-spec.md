# 유료 사주 상세 문답 구현 명세

## 확정 상품

- 결제: 토스페이먼츠 건별 결제
- 판매가: 1,900원
- AI: Gemini API의 배포 시점 지원 Flash 계열 모델(환경변수로 지정하고 공식 모델 목록을 배포 전에 재검증)
- 이용권: 결제한 명식에 대해 상세 문답 3회
- 비회원: 이메일 일회용 링크로 30일 재열람
- 회원: 계정에 결과와 문답을 계속 보관
- 답변 목표: 회당 700~900 출력 토큰
- 답변 상한: 회당 1,200 출력 토큰
- 답변 구성: 핵심 결론, 판정 근거 2~4개, 조건부 해석, 현실 점검을 포함한 5~8개 문단

정확한 모델 ID와 토큰 단가는 배포 직전에 Gemini 공식 가격표에서 다시 확인한다. 모델은 서버 환경변수로 교체할 수 있게 하고, 원가 계산에는 실제 API usage metadata와 결제·메일·DB 비용을 함께 사용한다.

## 제품 경계

- 무료: 원국, 십신, 십이운성, 천간·지지 관계, 대운·세운과 판정 근거
- 유료: 무료 판정 JSON만 근거로 답하는 AI 상세 문답 3회
- AI는 간지·십신·관계·십이운성을 새로 계산하거나 수정하지 않는다.

## 권장 흐름

1. 브라우저 규칙 엔진이 판정 JSON과 무결성 해시를 만든다.
2. 서버가 같은 입력을 다시 계산해 클라이언트 판정과 대조한다.
3. 사용자가 건별 상품을 주문한다.
4. 결제 사업자 승인 웹훅을 서버에서 검증한다.
5. 결제 완료 주문에 질문 가능 횟수 3회를 부여한다.
6. 사용자가 질문할 때 AI는 구조화된 JSON으로 답변과 evidenceIds를 반환한다.
7. 서버 검증기가 근거 없는 관계, 간지 변경, 단정적 위험 표현을 차단한다.
8. 검증 성공 답변만 문답 내역에 저장하고 남은 횟수를 1회 차감한다.
9. AI 호출·검증·저장 중 하나라도 실패하면 예약 상태를 해제하고 횟수를 차감하지 않는다.

## 서버 API

- `POST /api/products/quote`: 1,900원·3회 상품과 답변 범위 반환
- `POST /api/orders`: 주문 ID 생성
- `POST /api/payments/confirm`: 결제 사업자 승인 결과 서버 검증
- `POST /api/conversations/:id/messages`: 질문 가능 횟수를 확인한 뒤 답변 생성
- `GET /api/conversations/:id`: 주문 권한을 확인한 뒤 문답 조회
- `POST /api/messages/:id/retry`: 실패한 답변 재시도
- `POST /api/payments/webhook`: 서명 검증 후 주문 상태 갱신

모든 쓰기 API에는 idempotency key를 사용한다.

## 문답 제한과 횟수 차감

- 질문은 회당 600자 이하로 제한한다.
- 모델 입력은 구조화된 판정 JSON, 현재 질문, 앞선 문답만 포함하고 총 10,000 입력 토큰을 넘지 않게 요약한다.
- `maxOutputTokens`는 1,200으로 고정하고 일반 응답은 700~900 토큰을 목표로 한다.
- 질문 접수 시 `remaining_questions`를 즉시 줄이지 않고 해당 회차를 `generating`으로 예약한다.
- 동일 대화의 답변 생성은 한 번에 하나만 허용한다.
- 구조 검증과 근거 검증을 통과해 `completed`가 된 트랜잭션에서만 1회를 차감한다.
- 실패한 메시지의 재시도는 같은 sequence와 idempotency key를 사용하므로 중복 차감하지 않는다.
- 사용자 질문 자체가 의료·투자·법률 판단이나 확정적 미래 예언을 요구하면 안전한 범위로 답하고, 정상 답변을 제공한 경우에만 1회를 사용한다.

## 최소 데이터 구조

### orders

- id
- product_id
- amount
- currency
- status: pending | paid | generating | completed | failed | refunded
- payment_provider
- payment_key_hash
- created_at / paid_at / completed_at

### conversations

- id
- order_id
- engine_version
- ruleset_version
- input_hash
- evidence_json
- model_provider
- model_name
- prompt_version
- remaining_questions
- owner_user_id 또는 guest_access_id
- expires_at

### messages

- id
- conversation_id
- sequence: 1 | 2 | 3
- user_question
- answer_json
- evidence_ids
- input_tokens / output_tokens / thinking_tokens
- validation_json
- status: generating | completed | failed

생년월일시 원문은 기본적으로 영구 저장하지 않는다. 재생성이 필요하면 암호화 저장 기간과 삭제 정책을 별도 동의로 고지한다.

## AI 입력 원칙

- 생년월일 원문 대신 서버가 검증한 명식·판정 JSON을 전송한다.
- 각 판정에는 고유 evidence ID를 부여한다.
- 모든 해석 문단은 사용한 evidenceIds를 반환한다.
- 근거가 상충하면 한쪽을 삭제하지 않고 조건부로 설명한다.

## AI 출력 검증

- 원국·대운·세운 간지가 입력과 같은가
- 존재하지 않는 합·충·형·해·파를 언급하지 않았는가
- evidenceIds가 실제 판정 목록에 존재하는가
- 결혼·이혼·질병·사고·사망·임신을 확정하지 않는가
- 의료·투자·법률 결정을 사주로 지시하지 않는가
- 핵심 결론·판정 근거·조건부 해석·현실 점검이 모두 있는가

실패하면 사용자에게 결과를 노출하지 않고 같은 회차로 재생성한다.

## 배포 구조

- 정적 프런트엔드: 현재 GitHub Pages 유지 가능
- 결제·AI·DB: 별도 서버리스 백엔드 필요
- 비밀키: 백엔드 환경변수에만 저장
- CORS, origin 검증, 요청 속도 제한, 웹훅 서명 검증 필수

## 실제 구현 전 필요한 결정

1. 결제 사업자
2. 건별 판매 가격과 환불 조건
3. AI API 제공자
4. 사업자 정보와 개인정보처리방침·이용약관에 표시할 주체
5. 백엔드·인증·DB 서비스 계정
6. 거래 이메일 발송 서비스

결제 사업자 계정과 API 키가 준비되기 전에는 결제 버튼을 공개하지 않는다.
