import lunarPackage from 'lunar-javascript'

const { Solar, Lunar } = lunarPackage

const STEMS = [...'甲乙丙丁戊己庚辛壬癸']
const BRANCHES = [...'子丑寅卯辰巳午未申酉戌亥']

export const ELEMENTS = {
  wood: { ko: '목', hanja: '木', color: '#3f7d62' },
  fire: { ko: '화', hanja: '火', color: '#c65d45' },
  earth: { ko: '토', hanja: '土', color: '#a87c3f' },
  metal: { ko: '금', hanja: '金', color: '#7a7d82' },
  water: { ko: '수', hanja: '水', color: '#355f78' },
}

const STEM_ELEMENT = {
  甲: 'wood', 乙: 'wood', 丙: 'fire', 丁: 'fire', 戊: 'earth', 己: 'earth',
  庚: 'metal', 辛: 'metal', 壬: 'water', 癸: 'water',
}
const BRANCH_ELEMENT = {
  寅: 'wood', 卯: 'wood', 巳: 'fire', 午: 'fire', 辰: 'earth', 戌: 'earth',
  丑: 'earth', 未: 'earth', 申: 'metal', 酉: 'metal', 亥: 'water', 子: 'water',
}
const STEM_YANG = { 甲: true, 乙: false, 丙: true, 丁: false, 戊: true, 己: false, 庚: true, 辛: false, 壬: true, 癸: false }
const GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' }
const CONTROLS = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' }

const DAY_MASTER = {
  甲: ['큰 나무', '곧게 성장하며 방향을 세우는 힘'], 乙: ['덩굴과 풀', '환경에 맞추어 유연하게 연결하는 힘'],
  丙: ['태양', '밝게 드러내고 주변에 활력을 주는 힘'], 丁: ['촛불', '세밀하게 살피고 집중해서 밝히는 힘'],
  戊: ['큰 산', '흔들리지 않고 중심을 잡는 힘'], 己: ['논밭', '현실적으로 돌보고 길러 내는 힘'],
  庚: ['원석', '결단하고 구조를 새롭게 다듬는 힘'], 辛: ['보석', '정교하게 구분하고 완성도를 높이는 힘'],
  壬: ['큰 바다', '넓게 받아들이며 흐름을 읽는 힘'], 癸: ['비와 이슬', '섬세하게 관찰하고 조용히 스며드는 힘'],
}

const ELEMENT_COPY = {
  wood: { strength: '시작하고 성장시키는 힘', work: ['교육·기획', '콘텐츠 개발', '환경·생명 분야'], caution: '확장만 하기보다 마감 기준을 함께 세워 보세요.' },
  fire: { strength: '표현하고 확산하는 힘', work: ['강의·홍보', '디자인·공연', '고객 경험'], caution: '속도를 낼 때 사실 확인과 휴식도 챙겨 보세요.' },
  earth: { strength: '조율하고 안정시키는 힘', work: ['운영·행정', '상담·돌봄', '부동산·공간'], caution: '책임을 혼자 떠안지 말고 역할을 나누어 보세요.' },
  metal: { strength: '판단하고 정리하는 힘', work: ['법무·품질', '데이터 분석', '기술·재무'], caution: '정확함과 함께 상대가 받아들일 여지도 남겨 보세요.' },
  water: { strength: '탐구하고 연결하는 힘', work: ['연구·개발', '언어·미디어', '유통·여행'], caution: '생각이 길어질 때 작은 실행 단위를 정해 보세요.' },
}

function assertDateParts(year, month, day, hour, minute) {
  if (![year, month, day, hour, minute].every(Number.isInteger)) throw new Error('날짜와 시간은 정수로 입력해 주세요.')
  if (year < 1900 || year > 2100) throw new Error('지원 연도는 1900년부터 2100년까지입니다.')
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error('날짜 또는 시간 범위를 확인해 주세요.')
  }
}

export function trueSolarTime(year, month, day, hour, minute) {
  assertDateParts(year, month, day, hour, minute)
  const corrected = new Date(Date.UTC(year, month - 1, day, hour, minute - 32))
  return {
    year: corrected.getUTCFullYear(), month: corrected.getUTCMonth() + 1, day: corrected.getUTCDate(),
    hour: corrected.getUTCHours(), minute: corrected.getUTCMinutes(),
  }
}

function gregorianJulianDay(year, month, day) {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
    - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor
}

export function directDayGanZhi(year, month, day) {
  const daysFromEpoch = gregorianJulianDay(year, month, day) - 2451545
  return STEMS[mod(4 + daysFromEpoch, 10)] + BRANCHES[mod(6 + daysFromEpoch, 12)]
}

export function directTimeGanZhi(dayStem, hour) {
  const dayStemIndex = STEMS.indexOf(dayStem)
  if (dayStemIndex < 0 || !Number.isInteger(hour) || hour < 0 || hour > 23) throw new Error('일간 또는 시간을 확인해 주세요.')
  const branchIndex = Math.floor((hour + 1) / 2) % 12
  const stemIndex = ((dayStemIndex % 5) * 2 + branchIndex) % 10
  return STEMS[stemIndex] + BRANCHES[branchIndex]
}

export function convertLunarToSolar(year, month, day, isLeapMonth = false) {
  const lunar = Lunar.fromYmd(year, isLeapMonth ? -month : month, day)
  const solar = lunar.getSolar()
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() }
}

export function getElementBalance(pillars) {
  const balance = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  for (const pillar of pillars) {
    const [stem, branch] = [...pillar]
    balance[STEM_ELEMENT[stem]] += 1
    balance[BRANCH_ELEMENT[branch]] += 1
  }
  return balance
}

export function getTenGod(dayStem, targetStem) {
  if (!STEM_ELEMENT[dayStem] || !STEM_ELEMENT[targetStem]) throw new Error('올바른 천간을 입력해 주세요.')
  const day = STEM_ELEMENT[dayStem]
  const target = STEM_ELEMENT[targetStem]
  const samePolarity = STEM_YANG[dayStem] === STEM_YANG[targetStem]
  if (day === target) return samePolarity ? '비견' : '겁재'
  if (GENERATES[day] === target) return samePolarity ? '식신' : '상관'
  if (CONTROLS[day] === target) return samePolarity ? '편재' : '정재'
  if (CONTROLS[target] === day) return samePolarity ? '편관' : '정관'
  return samePolarity ? '편인' : '정인'
}

function pillarData(eightChar, prefix, label) {
  const ganZhi = eightChar[`get${prefix}`]()
  const stem = [...ganZhi][0]
  return {
    label, ganZhi, stem, branch: [...ganZhi][1],
    wuXing: eightChar[`get${prefix}WuXing`](),
    naYin: eightChar[`get${prefix}NaYin`](),
    tenGod: prefix === 'Day' ? '일간' : eightChar[`get${prefix}ShiShenGan`](),
  }
}

function directPillarData(ganZhi, label, dayStem, libraryPillar) {
  const [stem, branch] = [...ganZhi]
  return {
    label, ganZhi, stem, branch,
    wuXing: ELEMENTS[STEM_ELEMENT[stem]].hanja + ELEMENTS[BRANCH_ELEMENT[branch]].hanja,
    naYin: libraryPillar.naYin,
    tenGod: label === '일주' ? '일간' : getTenGod(dayStem, stem),
  }
}

function buildInterpretation(pillars, balance) {
  const dayStem = pillars.day.stem
  const sorted = Object.entries(balance).sort((a, b) => b[1] - a[1])
  const dominant = sorted[0][0]
  const missing = sorted.filter(([, count]) => count === 0).map(([key]) => key)
  return {
    dayMaster: { stem: dayStem, image: DAY_MASTER[dayStem][0], summary: DAY_MASTER[dayStem][1] },
    dominant: { key: dominant, ...ELEMENT_COPY[dominant] },
    missing: missing.map(key => ({ key, ...ELEMENT_COPY[key] })),
    note: '오행의 개수만으로 좋고 나쁨을 단정하지 않습니다. 계절·지장간·합충과 전체 구조를 함께 살펴야 합니다.',
  }
}

function getKoreanOffsetLabel(year, month, day, hour, minute) {
  // IANA Asia/Seoul의 역사적 시차를 브라우저/Node Intl 데이터로 확인한다.
  const targetWall = Date.UTC(year, month - 1, day, hour, minute)
  let utcGuess = targetWall - 9 * 60 * 60 * 1000
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'longOffset',
  })
  for (let i = 0; i < 3; i += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(utcGuess)).map(p => [p.type, p.value]))
    const renderedWall = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute)
    utcGuess += targetWall - renderedWall
  }
  const zone = formatter.formatToParts(new Date(utcGuess)).find(p => p.type === 'timeZoneName')?.value || 'GMT+09:00'
  return { zone, utcIso: new Date(utcGuess).toISOString() }
}

export function calculateSaju(input) {
  const { calendar = 'solar', gender = 'female', isLeapMonth = false } = input
  let { year, month, day, hour = 12, minute = 0 } = input
  assertDateParts(year, month, day, hour, minute)
  const entered = { year, month, day, hour, minute, calendar, isLeapMonth }
  if (calendar === 'lunar') ({ year, month, day } = convertLunarToSolar(year, month, day, isLeapMonth))
  const solarDate = { year, month, day }
  const corrected = trueSolarTime(year, month, day, hour, minute)
  const solar = Solar.fromYmdHms(corrected.year, corrected.month, corrected.day, corrected.hour, corrected.minute, 0)
  const lunar = solar.getLunar()
  const eightChar = lunar.getEightChar()
  const libraryDay = pillarData(eightChar, 'Day', '일주')
  const libraryTime = pillarData(eightChar, 'Time', '시주')
  const directDay = directDayGanZhi(corrected.year, corrected.month, corrected.day)
  const directTime = directTimeGanZhi([...directDay][0], corrected.hour)
  const pillars = {
    year: pillarData(eightChar, 'Year', '년주'), month: pillarData(eightChar, 'Month', '월주'),
    day: directPillarData(directDay, '일주', [...directDay][0], libraryDay),
    time: directPillarData(directTime, '시주', [...directDay][0], libraryTime),
  }
  const balance = getElementBalance(Object.values(pillars).map(p => p.ganZhi))
  const yun = eightChar.getYun(gender === 'male' ? 1 : 0)
  const luckCycles = yun.getDaYun(9).slice(1).map(item => ({
    ganZhi: item.getGanZhi(), startAge: item.getStartAge(), endAge: item.getEndAge(),
  }))
  return {
    entered, solarDate, corrected, timeZone: getKoreanOffsetLabel(year, month, day, hour, minute),
    lunarText: lunar.toString(), pillars, balance, luckCycles,
    interpretation: buildInterpretation(pillars, balance),
  }
}
