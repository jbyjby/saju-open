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

const BRANCH_MAIN_STEM = { 子: '癸', 丑: '己', 寅: '甲', 卯: '乙', 辰: '戊', 巳: '丙', 午: '丁', 未: '己', 申: '庚', 酉: '辛', 戌: '戊', 亥: '壬' }

const TEN_GOD_GROUPS = {
  self: {
    names: ['비견', '겁재'], label: '주도성과 동료성',
    strength: '자기 기준으로 시작하고 사람들과 나란히 움직이는 힘',
    caution: '경쟁하거나 혼자 결정하기 전에 목표와 역할을 먼저 합의하는 편이 좋습니다.',
    roles: ['프로젝트 리더', '창업·프리랜스', '커뮤니티 운영'],
  },
  output: {
    names: ['식신', '상관'], label: '표현과 생산성',
    strength: '생각을 말·글·결과물로 바꾸고 기존 방식을 개선하는 힘',
    caution: '아이디어가 많을수록 우선순위와 완료 기준을 숫자로 정하는 편이 좋습니다.',
    roles: ['강의·교육', '콘텐츠 제작', '기획·디자인'],
  },
  wealth: {
    names: ['편재', '정재'], label: '성과와 자원 관리',
    strength: '시간·돈·사람 같은 현실 자원을 살펴 구체적인 성과로 연결하는 힘',
    caution: '기회를 넓게 잡더라도 예산과 약속의 범위를 문서로 확인하는 편이 좋습니다.',
    roles: ['사업개발·영업', '재무·구매', '운영 관리'],
  },
  authority: {
    names: ['편관', '정관'], label: '책임과 기준',
    strength: '규칙과 책임을 받아들이고 복잡한 상황에 질서를 세우는 힘',
    caution: '높은 기준이 자신과 타인에게 과도한 압박이 되지 않도록 중간 점검이 필요합니다.',
    roles: ['행정·공공', '품질·법무', '조직 관리'],
  },
  resource: {
    names: ['편인', '정인'], label: '학습과 통찰',
    strength: '정보를 깊이 받아들이고 의미를 찾아 새로운 관점으로 재구성하는 힘',
    caution: '준비가 충분해질 때까지 미루기보다 작은 실험으로 생각을 검증하는 편이 좋습니다.',
    roles: ['연구·분석', '상담·코칭', '전문 교육'],
  },
}

function tenGodGroup(name) {
  return Object.entries(TEN_GOD_GROUPS).find(([, group]) => group.names.includes(name))?.[0]
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

function buildInterpretation(pillars, balance, gender) {
  const dayStem = pillars.day.stem
  const dayElement = STEM_ELEMENT[dayStem]
  const sorted = Object.entries(balance).sort((a, b) => b[1] - a[1])
  const dominant = sorted[0][0]
  const missing = sorted.filter(([, count]) => count === 0).map(([key]) => key)
  const targets = Object.values(pillars).flatMap(pillar => [pillar.stem, BRANCH_MAIN_STEM[pillar.branch]])
  targets.splice(4, 1) // 일간 자신은 십신 분포에서 제외한다.
  const tenGodBalance = Object.fromEntries(['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'].map(name => [name, 0]))
  for (const target of targets) tenGodBalance[getTenGod(dayStem, target)] += 1
  const groupBalance = { self: 0, output: 0, wealth: 0, authority: 0, resource: 0 }
  for (const [name, count] of Object.entries(tenGodBalance)) groupBalance[tenGodGroup(name)] += count
  const groupOrder = Object.entries(groupBalance).sort((a, b) => b[1] - a[1])
  const primaryGroup = TEN_GOD_GROUPS[groupOrder[0][0]]
  const secondaryGroup = TEN_GOD_GROUPS[groupOrder[1][0]]
  const day = DAY_MASTER[dayStem]
  const dominantCopy = ELEMENT_COPY[dominant]
  const missingLabel = missing.length ? missing.map(key => `${ELEMENTS[key].ko}(${ELEMENTS[key].hanja})`).join('·') : '뚜렷하게 비어 있는 오행 없음'
  const careerRoles = [...new Set([...primaryGroup.roles, ...dominantCopy.work, ...secondaryGroup.roles])]
  const wealthCount = groupBalance.wealth
  const selfCount = groupBalance.self
  const authorityCount = groupBalance.authority
  const resourceCount = groupBalance.resource
  const outputCount = groupBalance.output
  const spouseGroupKey = gender === 'male' ? 'wealth' : 'authority'
  const spouseCount = groupBalance[spouseGroupKey]
  const spouseGroup = TEN_GOD_GROUPS[spouseGroupKey]

  const readings = {
    overall: {
      title: `${dayStem} 일간, ${day[0]}처럼 흐르는 사람`,
      body: `${day[1]}이 삶의 기본 태도로 드러납니다. 여기에 ${ELEMENTS[dominant].ko}(${ELEMENTS[dominant].hanja})의 ${dominantCopy.strength}이 강하게 보태지고, 십신에서는 ${primaryGroup.label}의 흐름이 가장 선명합니다. 따라서 이 명식은 한 가지 운명을 예고한다기보다, 자신의 감각을 실제 결과로 연결할 때 강점이 살아나는 구조로 읽을 수 있습니다.`,
      points: [`가장 두드러진 힘: ${primaryGroup.strength}`, `보완해서 쓸 힘: ${secondaryGroup.strength}`, `표면 오행의 빈자리: ${missingLabel}`],
    },
    personality: {
      title: '섬세한 관찰을 자기 방식으로 정리합니다',
      body: `${day[0]}의 기질은 ${day[1]}으로 나타납니다. ${ELEMENTS[dominant].ko} 기운이 많아질수록 ${dominantCopy.strength}이 빠르게 작동하지만, 같은 장점이 과해지면 익숙한 방식에 오래 머물거나 생각과 행동의 속도가 어긋날 수 있습니다. ${primaryGroup.caution} 성격을 고정된 유형으로 단정하기보다, 편안할 때와 압박받을 때의 차이를 관찰하는 것이 이 명식을 더 정확하게 활용하는 방법입니다.`,
      points: [`강점: ${day[1]}`, `주의: ${dominantCopy.caution}`, `균형 질문: 지금 필요한 것은 확장인가, 정리인가?`],
    },
    career: {
      title: `${primaryGroup.label}을 쓰는 역할에서 역량이 드러납니다`,
      body: `직업 이름 하나를 정답으로 고르기보다 어떤 기능을 맡을 때 힘이 나는지 보는 편이 적절합니다. 이 명식은 ${primaryGroup.strength}과 ${dominantCopy.strength}을 함께 사용할 때 몰입도가 높아질 가능성이 있습니다. 특히 ${careerRoles.slice(0, 4).join('·')}처럼 사람과 정보를 연결하면서 결과 기준이 분명한 역할을 우선 탐색해 볼 만합니다. 실제 진로 선택에서는 흥미, 경험, 자격, 노동 조건을 함께 확인해야 합니다.`,
      points: [`잘 맞는 역할: ${careerRoles.slice(0, 3).join(' · ')}`, `확장 후보: ${careerRoles.slice(3, 6).join(' · ')}`, `선택 기준: 자율성·완료 기준·협업 방식이 분명한가?`],
    },
    wealth: {
      title: wealthCount ? '돈의 흐름은 계획과 실행을 연결할 때 안정됩니다' : '재물은 별도 기준을 세울수록 선명해집니다',
      body: wealthCount ? `재성과 연결되는 글자가 ${wealthCount}개 보여 현실 자원과 성과를 의식하는 흐름이 있습니다. 다만 재성이 있다는 사실이 재산의 크기나 투자 성공을 보장하지는 않습니다. ${primaryGroup.caution} 수입을 늘리는 판단과 지출을 지키는 판단을 분리하고, 큰 결정은 감정이 가라앉은 뒤 예산·기간·최악의 경우를 적어 보는 방식이 이 명식의 실행력을 안정적으로 살립니다.` : `표면 십신에서 재성이 두드러지지 않는다고 재물운이 없다는 뜻은 아닙니다. 돈보다 의미·관계·전문성을 먼저 보는 경향이 있을 수 있으므로, 수입과 지출을 자동으로 기록하고 큰 결제에는 하루의 간격을 두는 식의 외부 기준이 도움이 됩니다. 재무 결정은 사주가 아니라 실제 소득, 부채, 위험 감수 범위를 기준으로 해야 합니다.`,
      points: [`재성 표면 개수: ${wealthCount}`, '실천: 고정비·변동비·성장비를 나누어 기록하기', '주의: 투자·대출 판단을 사주 해석에 맡기지 않기'],
    },
    spouse: {
      title: spouseCount ? '배우자 관계는 현실적인 약속을 나눌 때 깊어집니다' : '배우자 인연은 운보다 관계의 기준을 세우는 일이 먼저입니다',
      body: `전통 명리에서는 입력한 성별을 기준으로 ${gender === 'male' ? '재성' : '관성'}을 배우자 흐름의 한 단서로 보며, 이 명식의 표면 분포에는 관련 흐름이 ${spouseCount}개 있습니다. ${spouseCount ? `${spouseGroup.strength}이 관계 안에서도 중요하게 작동할 수 있습니다.` : '표면에 해당 십신이 적다고 결혼이나 인연이 없다는 뜻은 아닙니다.'} 배우자의 성격·직업·만남 시기를 확정하는 방식보다, 갈등 때 대화가 가능한지, 돈과 생활을 어떻게 나눌지, 서로의 독립성을 존중하는지를 실제 관계에서 확인하는 편이 훨씬 중요합니다.`,
      points: [`전통적 배우자 별: ${gender === 'male' ? '재성' : '관성'} · 표면 ${spouseCount}`, '관계 점검: 애정 표현·경제 분담·가족 경계에 관한 기준 말하기', '주의: 특정 연도에 결혼이나 이별이 확정된다고 해석하지 않기'],
    },
    family: {
      title: '가족 안에서는 책임과 자기 경계를 함께 세워야 합니다',
      body: `가족 관계는 연주와 월주만으로 단정할 수 없지만, 인성 ${resourceCount}과 비겁 ${selfCount}의 배치는 돌봄을 받는 방식과 가족 안에서 자기 몫을 정하는 태도를 돌아보게 합니다. ${resourceCount >= selfCount ? '가족의 조언과 기대를 중요하게 받아들이는 편이라, 자신의 선택을 설명하는 과정이 길어질 수 있습니다.' : '스스로 해결하려는 힘이 강해 가족에게 도움을 요청하는 시점이 늦어질 수 있습니다.'} 가까운 사이라도 책임의 범위, 돈, 돌봄, 연락 빈도를 구체적으로 합의하는 것이 관계를 안정시키는 데 도움이 됩니다.`,
      points: ['부모·원가족: 기대와 실제로 가능한 역할을 구분하기', '형제·친족: 비교보다 각자의 조건과 경계를 확인하기', '가족 결정: 죄책감이 아니라 지속 가능한 책임을 기준으로 삼기'],
    },
    children: {
      title: '자녀와 후배에게는 답보다 성장할 공간을 건네는 편입니다',
      body: `식상 흐름 ${outputCount}은 표현, 생산, 가르침과 연결해 읽을 수 있습니다. 이것만으로 자녀의 유무나 수를 판단할 수는 없지만, 자녀·학생·후배를 대할 때 자신의 경험을 어떻게 전달하는지 살펴보는 단서가 됩니다. ${outputCount ? '설명하고 결과물을 함께 만드는 방식이 강점이 될 수 있으나, 상대가 스스로 시행착오를 겪을 여지도 남겨 두는 것이 좋습니다.' : '말로 가르치기보다 안정적인 환경과 일관된 태도로 보여 주는 방식이 편할 수 있습니다.'} 실제 양육과 교육에서는 발달 단계와 개인차를 우선해야 합니다.`,
      points: [`식상 표면 개수: ${outputCount}`, '양육·지도: 지시보다 선택지와 이유를 함께 제시하기', '주의: 자녀의 운명·성취·건강을 부모 사주로 단정하지 않기'],
    },
    study: {
      title: resourceCount ? '깊이 이해한 내용을 자기 언어로 바꿀 때 학습이 오래갑니다' : '학습은 짧은 실행과 반복으로 구조를 만들어야 합니다',
      body: `인성 흐름 ${resourceCount}은 정보를 받아들이고 체계화하는 방식과 연결됩니다. ${resourceCount ? '자료를 충분히 읽고 맥락을 이해한 뒤 정리하는 능력이 강점이지만, 완벽히 이해할 때까지 시작을 미루지 않도록 출력 기한을 정하는 편이 좋습니다.' : '정보를 오래 붙들기보다 문제를 풀거나 누군가에게 설명하면서 이해를 만드는 방식이 효과적일 수 있습니다.'} 시험·자격·연구 과제에서는 목표 점수, 반복 주기, 피드백 방법을 구체화하면 사주의 추상적 조언을 실제 학습 전략으로 바꿀 수 있습니다.`,
      points: [`인성 표면 개수: ${resourceCount}`, '추천 방식: 입력→요약→적용 문제→설명의 네 단계로 공부하기', '실천: 주간 단위로 결과물을 남기고 다음 계획을 조정하기'],
    },
    relationship: {
      title: '가까운 사이일수록 기대와 경계를 말로 확인하세요',
      body: `비겁 흐름 ${selfCount}, 관성 흐름 ${authorityCount}의 조합은 관계에서 자율성과 책임을 어떻게 나누는지가 중요하다는 뜻으로 읽을 수 있습니다. ${selfCount >= authorityCount ? '자기 방식과 속도를 존중받을 때 편안하지만, 상대에게도 같은 선택권을 남겨 두어야 합니다.' : '약속과 역할을 중요하게 여기지만, 기준을 맞추는 과정에서 자신의 욕구를 뒤로 미루지 않는 것이 필요합니다.'} 마음을 알아주길 기다리기보다 원하는 도움, 어려운 점, 가능한 범위를 구체적으로 말할수록 관계의 오해가 줄어듭니다.`,
      points: ['잘 맞는 대화: 감정 평가보다 관찰한 사실부터 말하기', '갈등 점검: 승패보다 다시 합의할 조건 찾기', '관계 기준: 친밀함과 경계를 함께 존중하는가?'],
    },
    wellbeing: {
      title: '생각과 활동의 리듬을 번갈아 배치하세요',
      body: `인성 흐름 ${resourceCount}, 식상 흐름 ${outputCount}의 배치는 받아들이는 시간과 밖으로 표현하는 시간의 균형을 살피게 합니다. ${resourceCount > outputCount ? '정보를 충분히 모은 뒤 움직이려는 편이라 준비가 길어질 때 몸을 먼저 움직이는 짧은 활동이 도움이 될 수 있습니다.' : '표현과 실행이 빠른 편이라 일정 사이에 아무 결과도 만들지 않는 회복 시간을 넣는 것이 좋습니다.'} 이는 질병이나 체질을 진단하는 내용이 아니며, 불편한 증상은 의료 전문가에게 확인해야 합니다.`,
      points: ['생활 리듬: 집중 시간 뒤에 의도적인 전환 시간 두기', `보완 오행: ${missingLabel}을 색·음식이 아닌 다양한 활동 경험으로 채우기`, '건강 원칙: 증상과 치료 판단은 의료 정보와 전문가 상담을 따르기'],
    },
  }

  return {
    dayMaster: { stem: dayStem, image: day[0], summary: day[1], element: dayElement },
    dominant: { key: dominant, ...dominantCopy },
    missing: missing.map(key => ({ key, ...ELEMENT_COPY[key] })),
    tenGodBalance, groupBalance, careerRoles, readings,
    note: '이 해석은 일간·표면 오행·십신·십이운성과 명시된 천간·지지 관계 규칙을 조합한 참고입니다. 지장간 전체, 강약, 격국·용신을 종합한 전문 감정은 아니며 미래 사건을 예언하지 않습니다.',
  }
}

const TWELVE_STAGES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양']
const TWELVE_STAGE_MEANINGS = {
  장생: '새로운 흐름이 시작되고 성장의 기반을 만드는 단계',
  목욕: '경험과 변화가 늘어 경계를 다시 익히는 단계',
  관대: '사회적 역할과 형식을 갖추며 밖으로 드러나는 단계',
  건록: '자기 기준으로 서고 실행력을 안정시키는 단계',
  제왕: '활동성과 추진력이 정점에 이르러 조절이 필요한 단계',
  쇠: '확장보다 조정과 역할 분담으로 힘을 배분하는 단계',
  병: '속도를 낮추고 취약한 부분을 점검·정비하는 단계',
  사: '하나의 흐름을 마무리하고 다음 방향을 준비하는 단계',
  묘: '경험과 자원을 안으로 모아 보관·축적하는 단계',
  절: '기존 연결을 정리하고 새로운 전환을 설계하는 단계',
  태: '새 가능성을 구상하고 아직 보이지 않는 기반을 준비하는 단계',
  양: '가능성을 보호하고 시간을 들여 길러 내는 단계',
}
const TWELVE_STAGE_OFFSETS = { 甲: 1, 丙: 10, 戊: 10, 庚: 7, 壬: 4, 乙: 6, 丁: 9, 己: 9, 辛: 0, 癸: 3 }

export function getTwelveStage(dayStem, branch) {
  const offset = TWELVE_STAGE_OFFSETS[dayStem]
  const branchIndex = BRANCHES.indexOf(branch)
  const stemIndex = STEMS.indexOf(dayStem)
  if (offset === undefined || branchIndex < 0) throw new Error('십이운성을 계산할 일간과 지지를 확인해 주세요.')
  return TWELVE_STAGES[mod(offset + (stemIndex % 2 === 0 ? branchIndex : -branchIndex), 12)]
}

const STEM_COMBINES = [
  { members: ['甲', '己'], result: '토' }, { members: ['乙', '庚'], result: '금' },
  { members: ['丙', '辛'], result: '수' }, { members: ['丁', '壬'], result: '목' },
  { members: ['戊', '癸'], result: '화' },
]
const BRANCH_PAIR_RULES = [
  { type: '육합', pairs: [['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未']] },
  { type: '육충', pairs: [['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']] },
  { type: '육해', pairs: [['子', '未'], ['丑', '午'], ['寅', '巳'], ['卯', '辰'], ['申', '亥'], ['酉', '戌']] },
  { type: '육파', pairs: [['子', '酉'], ['丑', '辰'], ['寅', '亥'], ['卯', '午'], ['巳', '申'], ['未', '戌']] },
  { type: '형', pairs: [['寅', '巳'], ['巳', '申'], ['申', '寅'], ['丑', '戌'], ['戌', '未'], ['未', '丑'], ['子', '卯']] },
]
const BRANCH_GROUP_RULES = [
  { type: '삼합', members: ['申', '子', '辰'], result: '수' },
  { type: '삼합', members: ['亥', '卯', '未'], result: '목' },
  { type: '삼합', members: ['寅', '午', '戌'], result: '화' },
  { type: '삼합', members: ['巳', '酉', '丑'], result: '금' },
  { type: '방합', members: ['寅', '卯', '辰'], result: '목' },
  { type: '방합', members: ['巳', '午', '未'], result: '화' },
  { type: '방합', members: ['申', '酉', '戌'], result: '금' },
  { type: '방합', members: ['亥', '子', '丑'], result: '수' },
  { type: '삼형', members: ['寅', '巳', '申'] },
  { type: '삼형', members: ['丑', '戌', '未'] },
]
const SELF_PUNISHMENT = new Set(['辰', '午', '酉', '亥'])

function isPair(a, b, pair) {
  return a !== b && ((a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0]))
}

export function analyzeStemSet(entries) {
  const relations = []
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const rule = STEM_COMBINES.find(item => isPair(entries[i].value, entries[j].value, item.members))
      if (rule) relations.push({
        type: '천간합', members: rule.members, labels: [entries[i].label, entries[j].label],
        result: rule.result, transformed: false,
      })
    }
  }
  return relations
}

export function analyzeBranchSet(entries) {
  const relations = []
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const a = entries[i]
      const b = entries[j]
      for (const rule of BRANCH_PAIR_RULES) {
        const pair = rule.pairs.find(candidate => isPair(a.value, b.value, candidate))
        if (pair) relations.push({ type: rule.type, members: pair, labels: [a.label, b.label] })
      }
      if (a.value === b.value && SELF_PUNISHMENT.has(a.value)) {
        relations.push({ type: '자형', members: [a.value, b.value], labels: [a.label, b.label] })
      }
    }
  }
  for (const rule of BRANCH_GROUP_RULES) {
    if (rule.members.every(member => entries.some(entry => entry.value === member))) {
      relations.push({
        type: rule.type, members: rule.members,
        labels: rule.members.map(member => entries.find(entry => entry.value === member).label),
        ...(rule.result ? { result: rule.result, transformed: false } : {}),
      })
    }
  }
  return relations
}

function relationSentence(relations, branch) {
  if (!relations.length) return `${branch}와 비교 대상 사이에 직접 판정된 합·충·형·해·파가 없음`
  return relations.map(item => `${item.members.join('')} ${item.type}${item.result ? `(${item.result} 기운 가능성)` : ''}`).join(', ')
}

function fortuneSignals(pillars, ganZhi, gender, contextLabel = '운', extraGanZhi = []) {
  const [stem, branch] = [...ganZhi]
  const dayStem = pillars.day.stem
  const stemGod = getTenGod(dayStem, stem)
  const branchGod = getTenGod(dayStem, BRANCH_MAIN_STEM[branch])
  const mainGroupKey = tenGodGroup(stemGod)
  const branchGroupKey = tenGodGroup(branchGod)
  const spouseGroupKey = gender === 'male' ? 'wealth' : 'authority'
  const pillarLabels = { year: '원국 년주', month: '원국 월주', day: '원국 일주', time: '원국 시주' }
  const natalStems = Object.entries(pillars).map(([key, pillar]) => ({ label: `${pillarLabels[key]} 천간`, value: pillar.stem }))
  const natalBranches = Object.entries(pillars).map(([key, pillar]) => ({ label: `${pillarLabels[key]} 지지`, value: pillar.branch }))
  const extraStems = extraGanZhi.map(item => ({ label: `${item.label} 천간`, value: [...item.ganZhi][0] }))
  const extraBranches = extraGanZhi.map(item => ({ label: `${item.label} 지지`, value: [...item.ganZhi][1] }))
  const stemLabel = `${contextLabel} 천간`
  const branchLabel = `${contextLabel} 지지`
  const stemRelations = analyzeStemSet([...natalStems, ...extraStems, { label: stemLabel, value: stem }])
    .filter(item => item.labels.includes(stemLabel))
  const branchRelations = analyzeBranchSet([...natalBranches, ...extraBranches, { label: branchLabel, value: branch }])
    .filter(item => item.labels.includes(branchLabel))
  const twelveStage = getTwelveStage(dayStem, branch)
  return {
    stem, branch, stemGod, branchGod, mainGroupKey, branchGroupKey, spouseGroupKey,
    mainGroup: TEN_GOD_GROUPS[mainGroupKey], branchGroup: TEN_GOD_GROUPS[branchGroupKey],
    twelveStage, twelveStageMeaning: TWELVE_STAGE_MEANINGS[twelveStage],
    stemRelations, branchRelations,
    relation: relationSentence([...stemRelations, ...branchRelations], branch),
    spouseActive: mainGroupKey === spouseGroupKey || branchGroupKey === spouseGroupKey,
  }
}

function relationGuidance(signal) {
  const types = new Set([...signal.stemRelations, ...signal.branchRelations].map(item => item.type))
  const guidance = []
  if (types.has('천간합')) guidance.push('천간합은 역할이나 의제가 서로 얽혀 조율 지점이 생기는 신호입니다.')
  if (['육합', '삼합', '방합'].some(type => types.has(type))) guidance.push('합 계열은 연결과 결집 가능성을 보이지만 합화나 좋은 결과를 자동으로 뜻하지 않습니다.')
  if (types.has('육충')) guidance.push('충은 기존 배치가 움직이거나 맞서는 지점이므로 변경 범위와 대응 순서를 확인해야 합니다.')
  if (['형', '삼형', '자형'].some(type => types.has(type))) guidance.push('형 계열은 같은 문제를 반복하거나 기준이 압박으로 작동하는 양상을 점검하게 합니다.')
  if (types.has('육해')) guidance.push('해는 겉으로 드러난 충돌보다 기대와 실제가 어긋남으로써 생기는 불편을 살피게 합니다.')
  if (types.has('육파')) guidance.push('파는 이미 합의한 방식이나 구조에 작은 균열이 생겨 다시 조정할 필요를 보여 줍니다.')
  return guidance.length ? guidance.join(' ') : '직접 판정된 관계가 없을 때는 십신과 십이운성의 흐름을 중심으로 실제 상황을 점검합니다.'
}

function luckAreas(signal, periodLabel) {
  const spouseText = signal.spouseActive
    ? `${periodLabel}에는 전통적 배우자 별이 운에서 드러납니다. 만남이나 혼인 자체를 확정하기보다, 관계의 현실 조건과 약속을 구체적으로 점검하기 좋은 시기로 읽습니다.`
    : `${periodLabel}의 중심 십신은 배우자 별과 직접 겹치지 않습니다. 관계운이 없다는 뜻이 아니라 일·학습·자기 과제가 앞에 놓일 수 있으므로, 가까운 관계를 일정에서 의도적으로 돌보는 편이 좋습니다.`
  return {
    career: `${signal.stemGod}과 ${signal.branchGod}의 조합은 ${signal.mainGroup.strength}을 일에서 요구합니다. 새 역할은 직함보다 책임 범위, 평가 기준, 협업 구조를 확인하고 선택해야 이 운의 장점을 실제 경력으로 연결할 수 있습니다.`,
    wealth: `${periodLabel}의 재물 흐름은 ${signal.mainGroupKey === 'wealth' || signal.branchGroupKey === 'wealth' ? '성과와 자원 관리가 전면에 놓이는 편' : '주된 활동을 재무 결과로 바꾸는 별도 장치가 필요한 편'}입니다. 수입·지출·부채·비상금을 분리하고, 큰 계약과 투자는 사주보다 실제 숫자와 전문가 검토를 우선해야 합니다.`,
    spouse: spouseText,
    relationship: `${signal.relation}. ${relationGuidance(signal)} 이 시기에는 기대, 역할, 연락, 돈의 경계를 말로 확인해야 오해를 줄일 수 있습니다.`,
    wellbeing: `${signal.mainGroup.caution} 일정이 몰릴 때 수면·식사·활동 기록으로 자신의 리듬을 확인하세요. 이 풀이는 질병을 예측하거나 진단하지 않으며, 지속되는 증상은 의료 전문가의 평가를 따라야 합니다.`,
  }
}

function buildCycleReading(pillars, ganZhi, startYear, endYear, gender) {
  const signal = fortuneSignals(pillars, ganZhi, gender, '대운')
  const periodLabel = `${startYear}~${endYear}년 ${ganZhi} 대운`
  return {
    title: `${signal.mainGroup.label}이 10년의 앞줄에 놓이는 시기`,
    body: `${periodLabel}의 천간 ${signal.stem}은 ${signal.stemGod}, 지지 ${signal.branch}의 주기운은 ${signal.branchGod}으로 읽습니다. 십이운성은 ${signal.twelveStage}으로, ${signal.twelveStageMeaning}입니다. 따라서 ${signal.mainGroup.strength}과 ${signal.branchGroup.strength}이 함께 주요 과제가 됩니다. ${signal.relation}. 이 관계는 특정 사건의 발생을 보장하지 않으며, 10년 동안 어떤 역할과 선택이 반복해서 중요해질 수 있는지를 보여 주는 참고 틀입니다. 기회가 보일 때는 실제 조건을 확인하고, 변동이 클 때는 생활 기반과 관계의 합의를 먼저 정비하는 방식으로 활용하세요.`,
    signals: [`천간 ${signal.stem} · ${signal.stemGod}`, `지지 ${signal.branch} · ${signal.branchGod}`, `십이운성 · ${signal.twelveStage}`, signal.relation],
    evidence: { twelveStage: signal.twelveStage, twelveStageMeaning: signal.twelveStageMeaning, stemRelations: signal.stemRelations, branchRelations: signal.branchRelations },
    areas: luckAreas(signal, periodLabel),
  }
}

function buildAnnualReading(pillars, cycleGanZhi, year, age, ganZhi, gender) {
  const signal = fortuneSignals(pillars, ganZhi, gender, '세운', [{ label: '대운', ganZhi: cycleGanZhi }])
  const cycleSignal = fortuneSignals(pillars, cycleGanZhi, gender, '대운')
  const cycleLink = signal.mainGroupKey === cycleSignal.mainGroupKey
    ? `대운과 세운이 모두 ${signal.mainGroup.label}을 강조해 같은 주제가 반복될 수 있습니다.`
    : `대운의 ${cycleSignal.mainGroup.label} 위에 세운의 ${signal.mainGroup.label}이 더해져 두 과제를 함께 조율해야 합니다.`
  const periodLabel = `${year}년 ${ganZhi} 세운`
  return {
    title: `${year}년 · ${signal.mainGroup.label}을 구체적인 선택으로 옮기는 해`,
    summary: `${periodLabel}은 천간 ${signal.stemGod}, 지지의 주기운 ${signal.branchGod}, 십이운성 ${signal.twelveStage}로 읽습니다. ${signal.twelveStageMeaning}에 해당하며, ${cycleLink} ${signal.relation}. 사건을 단정하기보다 그해의 결정에서 무엇을 점검할지 보여 주는 참고로 활용하세요.`,
    signals: [`나이 ${age}세`, `세운 ${ganZhi}`, `대운 ${cycleGanZhi}`, `십이운성 ${signal.twelveStage}`, `${signal.stemGod}·${signal.branchGod}`],
    evidence: { twelveStage: signal.twelveStage, twelveStageMeaning: signal.twelveStageMeaning, stemRelations: signal.stemRelations, branchRelations: signal.branchRelations },
    areas: luckAreas(signal, periodLabel),
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
  for (const pillar of Object.values(pillars)) pillar.twelveStage = getTwelveStage(pillars.day.stem, pillar.branch)
  const pillarLabels = { year: '년주', month: '월주', day: '일주', time: '시주' }
  const evidence = {
    stemRelations: analyzeStemSet(Object.entries(pillars).map(([key, pillar]) => ({ label: `${pillarLabels[key]} 천간`, value: pillar.stem }))),
    branchRelations: analyzeBranchSet(Object.entries(pillars).map(([key, pillar]) => ({ label: `${pillarLabels[key]} 지지`, value: pillar.branch }))),
  }
  const balance = getElementBalance(Object.values(pillars).map(p => p.ganZhi))
  const yun = eightChar.getYun(gender === 'male' ? 1 : 0)
  const luckCycles = yun.getDaYun(9).slice(1).map(item => {
    const ganZhi = item.getGanZhi()
    const startYear = item.getStartYear()
    const endYear = item.getEndYear()
    const annualYears = item.getLiuNian(10).map(annual => {
      const annualGanZhi = annual.getGanZhi()
      const annualYear = annual.getYear()
      const age = annual.getAge()
      return {
        year: annualYear, age, ganZhi: annualGanZhi,
        reading: buildAnnualReading(pillars, ganZhi, annualYear, age, annualGanZhi, gender),
      }
    })
    return {
      ganZhi, startYear, endYear, startAge: item.getStartAge(), endAge: item.getEndAge(),
      reading: buildCycleReading(pillars, ganZhi, startYear, endYear, gender), annualYears,
    }
  })
  return {
    entered, solarDate, corrected, timeZone: getKoreanOffsetLabel(year, month, day, hour, minute),
    lunarText: lunar.toString(), pillars, evidence, balance, luckCycles,
    interpretation: buildInterpretation(pillars, balance, gender),
  }
}
