# 유료 AI 종합 해석 구현 명세

## 제품 경계

- 무료: 원국, 십신, 십이운성, 천간·지지 관계, 대운·세운과 판정 근거
- 유료: 무료 판정 JSON만 근거로 작성하는 AI 종합 보고서
- AI는 간지·십신·관계·십이운성을 새로 계산하거나 수정하지 않는다.

## 권장 흐름

1. 브라우저 규칙 엔진이 판정 JSON과 무결성 해시를 만든다.
2. 서버가 같은 입력을 다시 계산해 클라이언트 판정과 대조한다.
3. 사용자가 건별 상품을 주문한다.
4. 결제 사업자 승인 웹훅을 서버에서 검증한다.
5. 결제 완료 주문만 AI 생성 큐에 넣는다.
6. AI는 구조화된 JSON으로 영역별 해석과 evidenceIds를 반환한다.
7. 서버 검증기가 근거 없는 관계, 간지 변경, 단정적 위험 표현을 차단한다.
8. 검증 성공 결과를 주문에 연결해 재열람과 PDF 다운로드를 제공한다.
9. 생성 실패 시 결제 사용 횟수를 소모하지 않고 재시도 또는 환불 대상으로 남긴다.

## 서버 API

- `POST /api/readings/quote`: 상품·가격·예상 생성 범위 반환
- `POST /api/orders`: 주문 ID 생성
- `POST /api/payments/confirm`: 결제 사업자 승인 결과 서버 검증
- `POST /api/readings`: 결제 완료 주문의 보고서 생성 요청
- `GET /api/readings/:id`: 주문 권한을 확인한 뒤 결과 조회
- `POST /api/readings/:id/retry`: 실패한 생성 재시도
- `POST /api/payments/webhook`: 서명 검증 후 주문 상태 갱신

모든 쓰기 API에는 idempotency key를 사용한다.

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

### readings

- id
- order_id
- engine_version
- ruleset_version
- input_hash
- evidence_json
- model_provider
- model_name
- prompt_version
- output_json
- validation_json
- expires_at

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
- 필수 보고서 영역이 모두 있는가

실패하면 사용자에게 결과를 노출하지 않고 재생성한다.

## 배포 구조

- 정적 프런트엔드: 현재 GitHub Pages 유지 가능
- 결제·AI·DB: 별도 서버리스 백엔드 필요
- 비밀키: 백엔드 환경변수에만 저장
- CORS, origin 검증, 요청 속도 제한, 웹훅 서명 검증 필수

## 실제 구현 전 필요한 결정

1. 결제 사업자
2. 건별 판매 가격과 환불 조건
3. AI API 제공자
4. 보고서 저장 기간
5. 회원가입 없이 주문번호·이메일로 재열람할지, 계정을 도입할지
6. 사업자 정보와 개인정보처리방침·이용약관에 표시할 주체

결제 사업자 계정과 API 키가 준비되기 전에는 결제 버튼을 공개하지 않는다.
