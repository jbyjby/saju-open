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

const HIDDEN_STEMS = {
  子: ['癸'], 丑: ['己', '癸', '辛'], 寅: ['甲', '丙', '戊'], 卯: ['乙'],
  辰: ['戊', '乙', '癸'], 巳: ['丙', '戊', '庚'], 午: ['丁', '己'], 未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'], 酉: ['辛'], 戌: ['戊', '辛', '丁'], 亥: ['壬', '甲'],
}

// 함혜수(2025), <표 1> 월령별 십간의 상생 배합. 각 배열은 선용→후용→보좌 순서다.
const SEASONAL_HARMONY_STEMS = {
  甲: { 寅: ['丙', '癸'], 卯: ['庚', '丁', '戊'], 辰: ['庚', '丁', '壬'], 巳: ['癸', '丁', '庚'], 午: ['癸', '丁', '庚'], 未: ['癸', '庚', '丁'], 申: ['庚', '丁', '壬'], 酉: ['庚', '丁', '丙'], 戌: ['庚', '丁', '癸'], 亥: ['庚', '丁', '戊'], 子: ['丁', '庚', '丙'], 丑: ['丁', '庚', '丙'] },
  乙: { 寅: ['丙', '癸'], 卯: ['丙', '癸'], 辰: ['癸', '丙', '戊'], 巳: ['癸', '辛'], 午: ['癸', '丙'], 未: ['癸', '丙'], 申: ['丙', '癸', '己'], 酉: ['癸', '丙', '丁'], 戌: ['癸', '辛'], 亥: ['丙', '戊'], 子: ['丙', '戊'], 丑: ['丙', '甲'] },
  丙: { 寅: ['壬', '庚'], 卯: ['壬', '己', '庚'], 辰: ['壬', '甲'], 巳: ['壬', '庚', '癸'], 午: ['壬', '庚'], 未: ['壬', '庚'], 申: ['壬', '戊'], 酉: ['壬', '癸'], 戌: ['甲', '壬'], 亥: ['甲', '戊', '庚'], 子: ['壬', '戊', '己'], 丑: ['壬', '甲'] },
  丁: { 寅: ['甲', '庚', '壬'], 卯: ['庚', '甲'], 辰: ['甲', '庚'], 巳: ['甲', '庚'], 午: ['壬', '庚', '癸'], 未: ['甲', '壬', '庚'], 申: ['甲', '丙'], 酉: ['甲', '庚', '丙'], 戌: ['甲', '庚'], 亥: ['甲', '庚'], 子: ['甲', '庚'], 丑: ['甲', '庚'] },
  戊: { 寅: ['丙', '甲', '癸'], 卯: ['丙', '甲', '癸'], 辰: ['甲', '丙', '癸'], 巳: ['甲', '丙', '癸'], 午: ['壬', '甲', '丙'], 未: ['癸', '丙', '甲'], 申: ['丙', '癸', '甲'], 酉: ['丙', '癸'], 戌: ['甲', '丙', '癸'], 亥: ['甲', '丙'], 子: ['丙', '甲'], 丑: ['丙', '甲'] },
  己: { 寅: ['丙', '庚', '甲'], 卯: ['甲', '癸', '丙'], 辰: ['丙', '癸', '甲'], 巳: ['癸', '丙', '辛'], 午: ['癸', '丙', '辛'], 未: ['癸', '丙', '辛'], 申: ['丙', '癸'], 酉: ['丙', '癸'], 戌: ['甲', '丙', '癸'], 亥: ['丙', '甲', '戊'], 子: ['丙', '甲', '戊'], 丑: ['丙', '甲', '戊'] },
  庚: { 寅: ['丙', '甲', '丁'], 卯: ['丁', '甲', '庚'], 辰: ['甲', '丁', '壬'], 巳: ['壬', '戊', '丙'], 午: ['壬', '癸'], 未: ['丁', '甲'], 申: ['丁', '甲'], 酉: ['丁', '甲', '丙'], 戌: ['甲', '壬'], 亥: ['丁', '丙', '甲'], 子: ['丁', '甲', '丙'], 丑: ['丙', '丁', '甲'] },
  辛: { 寅: ['己', '壬', '庚'], 卯: ['壬', '甲'], 辰: ['壬', '甲'], 巳: ['壬', '甲', '癸'], 午: ['壬', '己', '癸'], 未: ['壬', '庚', '甲'], 申: ['壬', '甲', '戊'], 酉: ['壬', '甲'], 戌: ['壬', '甲'], 亥: ['壬', '丙'], 子: ['丙', '戊', '壬'], 丑: ['丙', '壬', '戊'] },
  壬: { 寅: ['庚', '丙', '戊'], 卯: ['戊', '辛', '庚'], 辰: ['甲', '庚'], 巳: ['壬', '辛', '庚'], 午: ['癸', '庚', '辛'], 未: ['辛', '甲'], 申: ['戊', '丁'], 酉: ['甲', '庚'], 戌: ['甲', '丙'], 亥: ['戊', '丙', '庚'], 子: ['戊', '丙'], 丑: ['丙', '丁', '甲'] },
  癸: { 寅: ['辛', '丙'], 卯: ['庚', '辛'], 辰: ['丙', '辛', '甲'], 巳: ['辛', '庚'], 午: ['庚', '辛', '壬'], 未: ['庚', '辛', '壬'], 申: ['丁', '甲'], 酉: ['辛', '丙'], 戌: ['辛', '甲', '癸'], 亥: ['庚', '辛', '丁'], 子: ['丙', '辛'], 丑: ['丙', '丁'] },
}

const MONTH_CLIMATE = {
  寅: '초봄의 남은 찬 기운', 卯: '봄의 생장 기운', 辰: '봄에서 여름으로 넘어가는 습한 전환',
  巳: '초여름의 열기', 午: '한여름의 강한 열기', 未: '여름 끝의 열기와 습기',
  申: '가을로 접어드는 건조한 기운', 酉: '가을의 건조하고 서늘한 기운', 戌: '가을 끝의 건조한 전환',
  亥: '초겨울의 차고 습한 기운', 子: '한겨울의 강한 찬 기운', 丑: '겨울 끝의 차고 습한 기운',
}


const STEM_ELEMENT = {
  甲: 'wood', 乙: 'wood', 丙: 'fire', 丁: 'fire', 戊: 'earth', 己: 'earth',
  庚: 'metal', 辛: 'metal', 壬: 'water', 癸: 'water',
}
const BRANCH_ELEMENT = {
  寅: 'wood', 卯: 'wood', 巳: 'fire', 午: 'fire', 辰: 'earth', 戌: 'earth',
  丑: 'earth', 未: 'earth', 申: 'metal', 酉: 'metal', 亥: 'water', 子: 'water',
}

export function getSeasonalHarmony(dayStem, monthBranch, pillars = null) {
  const stems = SEASONAL_HARMONY_STEMS[dayStem]?.[monthBranch]
  if (!stems) throw new Error('계절 균형을 계산할 일간과 월령을 확인해 주세요.')
  const pillarList = pillars ? Object.values(pillars) : []
  const visibleStems = new Set(pillarList.map(pillar => pillar.stem))
  const hiddenStems = new Set(pillarList.flatMap(pillar => HIDDEN_STEMS[pillar.branch] || []))
  return {
    label: '계절 균형 참고',
    rulesetVersion: 'seasonal-harmony-2025-table1-v1',
    evidenceId: `seasonal-harmony:${dayStem}:${monthBranch}`,
    dayStem, monthBranch, climate: MONTH_CLIMATE[monthBranch],
    candidates: stems.map((stem, index) => {
      const element = STEM_ELEMENT[stem]
      return {
        order: index + 1, role: ['선용', '후용', '보좌'][index], stem,
        evidenceId: `seasonal-harmony:${dayStem}:${monthBranch}:${index + 1}:${stem}`,
        element, elementKo: ELEMENTS[element].ko, elementHanja: ELEMENTS[element].hanja,
        visible: visibleStems.has(stem), hidden: hiddenStems.has(stem),
      }
    }),
    source: '함혜수(2025), 「『난강망』의 새로운 해석, 조화용신론의 이론적 고찰」 <표 1>',
    note: '일간과 월령을 중심으로 본 계절 균형 참고이며, 억부·격국·합화까지 종합한 용신 확정이 아닙니다.',
  }
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

const DAY_MASTER_GUIDANCE = {
  甲: { strength: '방향을 정하면 꾸준히 밀고 나가는 힘이 있습니다.', blindSpot: '계획이 분명한 만큼, 상황이 달라져도 처음 정한 길을 고집하기 쉽습니다.' },
  乙: { strength: '주변을 세심하게 살피고 사람과 일을 자연스럽게 이어 줍니다.', blindSpot: '여러 사정을 맞추다 보면 정작 자신의 뜻을 뒤로 미루기 쉽습니다.' },
  丙: { strength: '분위기를 밝히고 생각을 밖으로 드러내는 힘이 좋습니다.', blindSpot: '속도가 붙으면 세부 조건을 놓치거나 기운을 한꺼번에 써 버리기 쉽습니다.' },
  丁: { strength: '작은 차이를 알아보고 필요한 곳에 집중하는 힘이 있습니다.', blindSpot: '한 가지를 오래 살피다 보면 생각이 예민해지고 시야가 좁아지기 쉽습니다.' },
  戊: { strength: '쉽게 흔들리지 않고 사람과 일을 든든하게 받쳐 줍니다.', blindSpot: '버티는 힘이 좋은 만큼, 혼자 감당하다가 바꿀 때를 늦게 알아차리기 쉽습니다.' },
  己: { strength: '현실을 꼼꼼히 돌보고 작은 성과를 차곡차곡 길러 냅니다.', blindSpot: '챙길 일이 많아지면 자신의 몫까지 떠안고 걱정을 쌓아 두기 쉽습니다.' },
  庚: { strength: '문제의 핵심을 가려 내고 결정을 내리는 힘이 분명합니다.', blindSpot: '판단이 빠른 만큼, 아직 다듬어지는 중인 가능성까지 일찍 잘라 내기 쉽습니다.' },
  辛: { strength: '기준이 섬세하고 결과의 완성도를 높이는 데 능합니다.', blindSpot: '잘하고 싶은 마음이 커지면 작은 흠도 오래 마음에 남기기 쉽습니다.' },
  壬: { strength: '큰 흐름을 읽고 낯선 정보도 폭넓게 받아들이는 힘이 있습니다.', blindSpot: '가능성을 넓게 보는 만큼, 한곳에 힘을 모으기까지 시간이 걸리기 쉽습니다.' },
  癸: { strength: '사람과 상황의 작은 변화를 세심하게 알아차리는 힘이 있습니다.', blindSpot: '생각이 많아지면 결정을 미루거나 주변 분위기를 자기 마음처럼 받아들이기 쉽습니다.' },
}

const ELEMENT_LUCK_GUIDANCE = {
  wood: { meaning: '새로 시작하고 방향을 세우는 힘', why: '미뤄 둔 일을 작게라도 시작하도록 돕는 기운', practice: ['오늘 시작할 일 한 가지를 정하기', '해야 할 일을 첫 단계까지 쪼개기', '산책하며 다음 방향을 한 문장으로 정리하기'] },
  fire: { meaning: '따뜻하게 표현하고 움직이는 힘', why: '마음속 생각을 말과 행동으로 꺼내도록 돕는 기운', practice: ['고마움이나 바라는 점을 말로 전하기', '햇빛을 보며 몸을 가볍게 움직이기', '미룬 연락 한 건을 먼저 하기'] },
  earth: { meaning: '흩어진 것을 모으고 생활을 안정시키는 힘', why: '복잡한 생각을 현실의 순서와 습관으로 바꾸도록 돕는 기운', practice: ['책상이나 가방 한 곳을 정리하기', '이번 주 고정 일정을 먼저 적기', '할 수 있는 일과 맡기 어려운 일을 나누기'] },
  metal: { meaning: '기준을 세우고 불필요한 것을 덜어 내는 힘', why: '생각과 감정을 정리해 분명한 선택으로 옮기도록 돕는 기운', practice: ['오늘 하지 않을 일 한 가지를 정하기', '결정 기준을 세 문장 안으로 적기', '필요 없는 알림이나 약속 하나를 정리하기'] },
  water: { meaning: '속도를 낮추고 흐름을 살피는 힘', why: '서두르기 전에 마음과 상황을 충분히 읽도록 돕는 기운', practice: ['답을 정하기 전에 잠깐 멈추기', '잠들기 전 머릿속 생각을 적기', '일정 사이에 아무것도 하지 않는 시간을 두기'] },
}

const ELEMENT_KEYS = ['wood', 'fire', 'earth', 'metal', 'water']
const BRANCH_WEIGHTS = { year: 1.2, month: 2.4, day: 1.5, time: 1.2 }
const HIDDEN_WEIGHTS = [0.45, 0.2, 0.1]

function generatedBy(element) {
  return ELEMENT_KEYS.find(key => GENERATES[key] === element)
}

function controlledBy(element) {
  return ELEMENT_KEYS.find(key => CONTROLS[key] === element)
}

function weightedElementForces(pillars) {
  const forces = Object.fromEntries(ELEMENT_KEYS.map(key => [key, 0]))
  for (const [position, pillar] of Object.entries(pillars)) {
    forces[STEM_ELEMENT[pillar.stem]] += position === 'day' ? 1.3 : 1
    forces[BRANCH_ELEMENT[pillar.branch]] += BRANCH_WEIGHTS[position]
    const hiddenFactor = position === 'month' ? 1.4 : 1
    for (const [index, stem] of (HIDDEN_STEMS[pillar.branch] || []).entries()) {
      forces[STEM_ELEMENT[stem]] += (HIDDEN_WEIGHTS[index] || 0.05) * hiddenFactor
    }
  }
  return forces
}

function strategyReason(element, context) {
  const { dayElement, resourceElement, outputElement, wealthElement, authorityElement, weak, dominantElement } = context
  if (weak && element === resourceElement) return `${ELEMENTS[element].ko}은 강한 기운을 받아 ${ELEMENTS[dayElement].ko} 일간으로 이어 주는 생조 통로가 됩니다.`
  if (weak && element === dayElement) return `${ELEMENTS[element].ko}은 뿌리가 약한 일간의 힘을 직접 보태고 계절의 치우침을 완화합니다.`
  if (weak && element === outputElement) return `${ELEMENTS[element].ko}은 ${ELEMENTS[authorityElement].ko}의 압박을 조절할 수 있지만, 약한 일간의 힘을 먼저 소모하므로 선행 보완이 필요합니다.`
  if (element === dominantElement) return `${ELEMENTS[element].ko}은 원국에서 이미 두드러져 더 보태기보다 쓰는 방식과 강도를 조절해야 합니다.`
  if (element === wealthElement) return `${ELEMENTS[element].ko}은 현실의 성과로 연결하지만 일간의 힘을 쓰게 하므로 양을 조절해야 합니다.`
  if (element === authorityElement) return `${ELEMENTS[element].ko}은 책임과 기준을 세우지만 지나치면 일간을 압박할 수 있습니다.`
  return `${ELEMENTS[element].ko}은 계절 후보와 원국의 세력을 함께 볼 때 보조적으로 활용할 수 있습니다.`
}

export function getBalanceStrategy(pillars, harmony) {
  const dayElement = STEM_ELEMENT[harmony.dayStem]
  const resourceElement = generatedBy(dayElement)
  const outputElement = GENERATES[dayElement]
  const wealthElement = CONTROLS[dayElement]
  const authorityElement = controlledBy(dayElement)
  const rawForces = weightedElementForces(pillars)
  const branchEntries = Object.entries(pillars).map(([position, pillar]) => ({ label: position, value: pillar.branch }))
  const stemEntries = Object.entries(pillars).map(([position, pillar]) => ({ label: position, value: pillar.stem }))
  const branchRelationships = analyzeBranchSet(branchEntries)
  const stemRelationships = analyzeStemSet(stemEntries)
  const relationPenalties = { 육충: 0.35, 형: 0.2, 삼형: 0.2, 자형: 0.2, 육해: 0.18, 육파: 0.15 }
  const forceAdjustments = Object.fromEntries(ELEMENT_KEYS.map(key => [key, 0]))
  for (const relation of branchRelationships) {
    const penalty = relationPenalties[relation.type] || 0
    for (const branch of relation.members) {
      if (penalty && BRANCH_ELEMENT[branch]) forceAdjustments[BRANCH_ELEMENT[branch]] -= penalty
    }
  }
  const forces = Object.fromEntries(ELEMENT_KEYS.map(key => [key, Math.max(0, rawForces[key] + forceAdjustments[key])]))
  const total = Object.values(forces).reduce((sum, value) => sum + value, 0)
  const supportShare = (forces[dayElement] + forces[resourceElement]) / total
  const level = supportShare < 0.36 ? 'weak' : supportShare > 0.57 ? 'strong' : 'balanced'
  const weak = level === 'weak'
  const strong = level === 'strong'
  const dominantElement = ELEMENT_KEYS.reduce((best, key) => forces[key] > forces[best] ? key : best, ELEMENT_KEYS[0])
  const seasonalOrder = new Map(harmony.candidates.map((candidate, index) => [candidate.element, Math.max(1, 3 - index)]))
  const drySeason = ['申', '酉', '戌'].includes(harmony.monthBranch)
  const hotSeason = ['巳', '午', '未'].includes(harmony.monthBranch)
  const coldSeason = ['亥', '子', '丑'].includes(harmony.monthBranch)

  const scores = Object.fromEntries(ELEMENT_KEYS.map(element => {
    let score = seasonalOrder.get(element) || 0
    if (weak) {
      if (element === resourceElement) score += 6
      if (element === dayElement) score += 5
      if (element === outputElement) score -= 2.5
      if (element === wealthElement) score -= 4
      if (element === authorityElement) score -= 4
      if (dominantElement === authorityElement && element === resourceElement) score += 2
      if (dominantElement === authorityElement && element === outputElement) score += 1
    } else if (strong) {
      if (element === outputElement) score += 5
      if (element === wealthElement) score += 4
      if (element === authorityElement) score += 4
      if (element === dayElement || element === resourceElement) score -= 3
    } else {
      if (element === outputElement || element === resourceElement) score += 2
      if (element === wealthElement || element === authorityElement) score += 1
    }
    if ((drySeason || hotSeason) && element === 'water') score += 2
    if (coldSeason && element === 'fire') score += 2
    if (forces[element] / total > 0.28) score -= 3
    return [element, score]
  }))

  const context = { dayElement, resourceElement, outputElement, wealthElement, authorityElement, weak, dominantElement }
  const ranked = ELEMENT_KEYS.map(element => ({
    element,
    label: `${ELEMENTS[element].ko}(${ELEMENTS[element].hanja})`,
    score: Number(scores[element].toFixed(2)),
    force: Number(forces[element].toFixed(2)),
    reason: strategyReason(element, context),
  })).sort((a, b) => b.score - a.score || a.element.localeCompare(b.element))
  const priority = ranked[0]
  const support = ranked[1]
  const caution = ranked.filter(item => item.element !== priority.element && item.element !== support.element && (item.score < 0 || item.element === dominantElement))
  const cautionSet = new Set(caution.map(item => item.element))
  const conditional = ranked.filter(item => item.element !== priority.element && item.element !== support.element && !cautionSet.has(item.element))
  const strengthText = weak
    ? '일간을 돕는 기운보다 소모하거나 압박하는 기운이 더 크게 나타납니다.'
    : strong
      ? '일간을 돕는 기운이 충분해 바깥으로 쓰고 조절하는 방향을 함께 살핍니다.'
      : '일간을 돕는 힘과 밖으로 쓰는 힘이 한쪽으로 크게 치우치지 않습니다.'
  return {
    rulesetVersion: 'balance-strategy-v1',
    evidenceId: `balance-strategy:${harmony.dayStem}:${harmony.monthBranch}`,
    isFinalYongShen: false,
    strength: { level, supportShare: Number(supportShare.toFixed(3)), summary: strengthText },
    rawForces: Object.fromEntries(ELEMENT_KEYS.map(key => [key, Number(rawForces[key].toFixed(2))])),
    forces: Object.fromEntries(ELEMENT_KEYS.map(key => [key, Number(forces[key].toFixed(2))])),
    forceAdjustments: Object.fromEntries(ELEMENT_KEYS.map(key => [key, Number(forceAdjustments[key].toFixed(2))])),
    relationships: { stem: stemRelationships, branch: branchRelationships },
    priority, support, conditional, caution,
    summary: `${strengthText} 그래서 ${priority.label}을 먼저 살리고 ${support.label}을 함께 보완합니다.`,
    note: '월령 후보, 표면 천간·지지, 지장간, 뿌리와 생극 흐름을 함께 비교한 설명용 휴리스틱입니다. 충·형·해·파는 뿌리의 안정성에만 소폭 반영하고, 합은 합화로 확정하지 않습니다. 격국까지 확정한 전통 명리의 최종 용신 판정은 아닙니다.',
  }
}

export function getSajuVisualProfile(data) {
  const signature = ['year', 'month', 'day', 'time'].map(position => data.pillars?.[position]?.ganZhi).join('/')
  if (signature !== '丙寅/辛丑/甲戌/癸酉') return null

  return {
    kind: 'curated-personal',
    asset: 'personalized/1987-01-25-1830.jpg',
    natalAsset: 'personalized/1987-01-25-1830-natal.jpg',
    luckAsset: 'personalized/1987-01-25-1830-luck.jpg',
    layers: {
      basePath: 'personalized/1987-01-25-1830-layers',
      natal: [
        'layer-01-environment-base.jpg',
        'layer-02-rooted-sun.png',
        'layer-03-clear-water.png',
        'layer-04-blue-dog-base.png',
      ],
      luck: [
        'layer-01-environment-base.jpg',
        'layer-02-rooted-sun.png',
        'layer-03-clear-water.png',
        'layer-06-nearby-warmth.png',
        'layer-05-blue-dog-luck.png',
      ],
    },
    natalLabel: '내 사주 원국 물상 이미지',
    luckLabel: '나만의 개운 이미지',
    luckTitle: '따뜻한 온기와 맑은 물을 받아 힘을 얻는 푸른 개',
    title: '차가운 늦겨울, 따뜻한 빛과 맑은 물을 받는 푸른 개',
    tags: ['#큰나무의기상', '#갑술푸른개', '#신축늦겨울', '#병화태양', '#계수맑은물'],
    readingLabel: '그림부터 읽는 총운',
    overall: '당신을 가장 가까이 보여 주는 물상은 갑술일주(푸른 개)입니다. 갑목(곧게 자라는 큰 나무)의 푸른빛과 곧게 자라는 기상은 강아지의 색과 꼿꼿한 자세에 담겼고, 술토(불씨를 품은 늦가을의 마른 땅)는 개의 모습과 발밑 땅으로 나타냈습니다. 이 푸른 개가 서 있는 눈밭은 신축월(차갑고 습한 늦겨울), 큰 붉은 태양은 이미 가진 병화(태양), 얼지 않은 맑은 물은 계수(이슬과 맑은 물)를 뜻합니다. 태양의 빛이 정화(가까이 머무는 온기)처럼 땅과 물 가까이에 머물 때, 푸른 개가 맑은 물을 마시며 힘을 얻는 흐름을 보여 줍니다.',
    scene: '눈 내리는 차가운 겨울에서 뿌리 있는 태양의 온기가 땅과 물 가까이에 머물고, 푸른 개가 맑은 물을 마시며 힘을 얻는 장면입니다.',
    protagonist: {
      label: '그림 속의 나',
      term: '갑술일주(푸른 개)',
      visual: '갑목(곧게 자라는 큰 나무)의 푸른빛과 곧은 기상은 색과 꼿꼿한 자세에, 술토의 개는 주인공의 모습에 담았습니다.',
    },
    environment: {
      label: '내가 놓인 계절',
      term: '신축월(차갑고 습한 늦겨울)',
      visual: '눈밭과 굳은 겨울 땅은 실제 출생일의 날씨가 아니라 축월의 계절성을 나타냅니다.',
    },
    existingStrength: {
      label: '이미 가진 힘',
      term: '병화(태양)',
      visual: '병인년주의 태양은 인목에 뿌리를 두어 겨울에도 힘 있게 빛나는 원국의 자원입니다.',
    },
    neededFunction: {
      label: '더 필요한 작용',
      term: '정화(가까이 머무는 온기)',
      visual: '불꽃을 하나 더 그리지 않고, 따뜻한 빛이 강아지와 땅과 물 가까이에 지속되는 모습으로 표현했습니다.',
    },
    support: {
      label: '나를 살리는 물',
      term: '계수(이슬과 맑은 물)',
      visual: '차갑게 얼어붙는 물이 아니라 태양의 온기 아래 갑목을 길러 주는 물로 표현했습니다.',
    },
    flow: '유금 → 계수 → 갑목으로 이어지는 가능성을 강아지가 맑은 물을 마시는 행동으로 보여 줍니다.',
    disclaimer: '원국에 이미 있는 힘과 더 필요한 작용을 구분해 만든 검수 시안입니다.',
  }
}

export function getLuckImageGuidance(harmony, strategy = null) {
  const day = DAY_MASTER_GUIDANCE[harmony.dayStem]
  const primaryCandidate = harmony.candidates[0]
  const primaryElement = strategy?.priority.element || primaryCandidate.element
  const supportElement = strategy?.support.element || null
  const element = ELEMENT_LUCK_GUIDANCE[primaryElement]
  if (!day || !primaryCandidate || !element) throw new Error('개운 이미지 안내를 만들 판정 근거가 부족합니다.')
  const primaryInChart = harmony.candidates.find(candidate => candidate.element === primaryElement)
  const location = primaryInChart?.visible
    ? '이 기운은 원국에 드러나 있으므로 무작정 더하기보다 제 기능을 안정적으로 쓰는 것이 중요합니다.'
    : primaryInChart?.hidden
      ? '이 기운은 원국 안에 숨어 있으므로 필요할 때 의식적으로 꺼내 쓰는 편이 좋습니다.'
      : '이 기운은 원국에서 뚜렷하지 않아 생활의 태도와 환경으로 보완해 볼 만합니다.'
  const supportCopy = supportElement
    ? ` ${ELEMENTS[supportElement].ko} 기운은 ${ELEMENT_LUCK_GUIDANCE[supportElement].meaning}으로 이 흐름을 함께 받칩니다.`
    : ''
  return {
    strength: day.strength,
    blindSpot: day.blindSpot,
    neededElement: primaryElement,
    supportElement,
    neededLabel: strategy?.priority.label || `${primaryCandidate.stem} ${primaryCandidate.elementKo}(${primaryCandidate.elementHanja})`,
    whyNeeded: `${ELEMENTS[primaryElement].ko} 기운이 상징하는 ${element.meaning}은 ${element.why}입니다.${supportCopy} ${location}`,
    practice: element.practice,
    definition: '여기서 개운은 운명을 바꾸는 주문이 아닙니다. 내 사주가 놓치기 쉬운 방향을 알아차리고, 선택과 습관을 조금씩 바꾸는 일입니다.',
    saveReason: '이 이미지를 휴대폰 배경화면에 두는 이유도 같습니다. 하루에 여러 번 화면을 볼 때마다 지금 필요한 태도를 짧게 떠올리는 표지로 쓰세요.',
    claimsGuaranteedEffect: false,
  }
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
      title: `${dayStem} 일간, ${day[0]}의 기질을 지녔습니다`,
      body: `나를 나타내는 일간은 ${dayStem}, 자연에 비유하면 ${day[0]}입니다. 바탕에는 ${day[1]}이 있습니다. 사주 여덟 글자에서는 ${ELEMENTS[dominant].ko}(${ELEMENTS[dominant].hanja}) 기운이 가장 많이 보이고, 십신으로는 ${primaryGroup.label}이 두드러집니다. 쉽게 말해 ${primaryGroup.strength}을 잘 쓰는 편입니다. 이 설명은 운명을 정해 놓는 말이 아니라, 어떤 방식으로 힘을 쓸 때 자연스러운지를 보여 줍니다.`,
      points: [`타고난 바탕: ${day[1]}`, `잘 쓰는 힘: ${primaryGroup.strength}`, `겉으로 드러나지 않은 오행: ${missingLabel}`],
    },
    personality: {
      title: '편안할 때와 힘들 때의 모습이 다릅니다',
      body: `평소에는 ${day[1]}이 장점으로 나타납니다. 여기에 ${ELEMENTS[dominant].ko} 기운이 힘을 보태므로 ${dominantCopy.strength}도 자연스럽습니다. 다만 일이 몰리거나 마음이 급해지면 같은 장점이 고집이나 부담으로 바뀔 수 있습니다. ${dominantCopy.caution} 사주로 성격을 단정하기보다, 여유가 있을 때와 압박을 받을 때 내가 어떻게 달라지는지 살펴보는 편이 정확합니다.`,
      points: [`평소의 강점: ${day[1]}`, `힘들 때 살필 점: ${dominantCopy.caution}`, '스스로 물어볼 것: 지금은 더 넓혀야 할까, 먼저 정리해야 할까?'],
    },
    career: {
      title: '직업 이름보다 어떤 일을 맡느냐가 중요합니다',
      body: `이 사주는 ${primaryGroup.strength}과 ${dominantCopy.strength}을 함께 쓸 때 능력이 잘 드러납니다. 직업 하나를 정답처럼 고르기보다, 실제로 맡을 역할을 보세요. ${careerRoles.slice(0, 4).join('·')}처럼 해야 할 일과 완성 기준이 분명한 분야부터 살펴볼 만합니다. 같은 직업이라도 조직 분위기와 업무 방식에 따라 맞고 안 맞는 정도가 달라집니다. 흥미와 경험, 자격, 근무 조건까지 확인한 뒤 판단하세요.`,
      points: [`먼저 살펴볼 역할: ${careerRoles.slice(0, 3).join(' · ')}`, `함께 볼 분야: ${careerRoles.slice(3, 6).join(' · ')}`, '직장을 고를 때: 내가 맡을 일과 평가 기준이 분명한가?'],
    },
    wealth: {
      title: wealthCount ? '돈을 버는 힘과 지키는 기준을 따로 세우세요' : '돈 관리는 눈에 보이는 기준을 만드는 것부터 시작합니다',
      body: wealthCount ? `재물과 현실 성과를 뜻하는 재성이 겉에 ${wealthCount}개 보입니다. 돈과 시간, 사람을 실제 결과로 연결하는 일에 관심이 가기 쉽다는 뜻입니다. 그렇다고 재산이 많아지거나 투자가 성공한다는 보장은 아닙니다. 수입을 늘리는 판단과 지출을 줄이는 판단을 나누세요. 큰돈이 움직일 때는 예산과 기간, 감당할 수 있는 손실부터 적어 보는 편이 좋습니다.` : `겉으로 드러난 재성이 적다고 재물운이 없다는 뜻은 아닙니다. 돈보다 일의 의미나 관계, 전문성을 먼저 생각하는 편일 수 있습니다. 그래서 수입과 지출을 자동으로 기록하고, 큰 결제는 하루 뒤에 다시 보는 것처럼 눈에 보이는 기준을 만드는 일이 중요합니다. 투자와 대출은 사주가 아니라 실제 소득과 부채를 기준으로 판단해야 합니다.`,
      points: [`겉으로 드러난 재성: ${wealthCount}개`, '해볼 일: 고정비와 생활비, 배움에 쓰는 돈을 나누어 기록하기', '큰돈의 결정: 실제 숫자와 감당할 수 있는 위험부터 확인하기'],
    },
    spouse: {
      title: '좋은 인연은 운보다 생활의 합이 더 중요합니다',
      body: `전통 명리에서는 ${gender === 'male' ? '재성' : '관성'}을 배우자와의 관계를 살피는 단서로 봅니다. 이 사주에는 그 기운이 겉에 ${spouseCount}개 보입니다. ${spouseCount ? `${spouseGroup.strength}이 연애와 결혼에서도 중요한 기준이 되기 쉽습니다.` : '이 글자가 적다고 인연이 없거나 결혼이 어렵다는 뜻은 아닙니다.'} 상대의 직업이나 만날 시기를 맞히는 것보다, 갈등이 생겼을 때 대화가 되는지, 돈과 집안일을 어떻게 나눌지, 서로의 생활을 존중하는지를 보는 편이 훨씬 중요합니다.`,
      points: [`배우자 관계를 보는 전통적 단서: ${gender === 'male' ? '재성' : '관성'} ${spouseCount}개`, '꼭 맞춰 볼 것: 애정 표현, 돈, 집안일, 양가 가족의 경계', '사주만으로 결혼이나 이별 시기를 확정하지 않기'],
    },
    family: {
      title: '가족을 챙기는 일에도 내 몫의 선이 필요합니다',
      body: `가족 관계를 사주 몇 글자로 단정할 수는 없습니다. 다만 인성 ${resourceCount}개와 비겁 ${selfCount}개를 함께 보면, 가족 안에서 도움을 주고받는 방식을 돌아볼 수 있습니다. ${resourceCount >= selfCount ? '가족의 조언과 기대를 무겁게 받아들여 내 선택을 설명하는 데 힘을 많이 쓸 수 있습니다.' : '스스로 해결하려는 마음이 강해 힘들어도 도움을 늦게 청할 수 있습니다.'} 가까운 가족일수록 돈과 돌봄, 연락, 책임의 범위를 구체적으로 말해 두는 편이 좋습니다.`,
      points: ['부모와 가족의 기대 중 내가 할 수 있는 몫만 구분하기', '형제나 친척과 비교하기보다 서로 다른 조건을 인정하기', '죄책감보다 오래 지킬 수 있는 책임을 선택하기'],
    },
    children: {
      title: '가르쳐 주는 것과 기다려 주는 것의 균형이 필요합니다',
      body: `표현과 가르침을 뜻하는 식상이 겉에 ${outputCount}개 보입니다. 이것으로 자녀의 유무나 수를 판단할 수는 없습니다. 다만 자녀나 학생, 후배를 대하는 방식을 살피는 단서는 됩니다. ${outputCount ? '설명하고 함께 결과를 만드는 데 강점이 있지만, 상대가 직접 해 보고 실수할 시간도 남겨 두는 편이 좋습니다.' : '말로 앞서 가르치기보다 안정된 환경과 한결같은 태도로 보여 주는 방식이 더 편할 수 있습니다.'} 실제 양육과 교육에서는 나이와 발달 단계, 개인차가 먼저입니다.`,
      points: [`겉으로 드러난 식상: ${outputCount}개`, '지시만 하기보다 선택지와 그 이유를 함께 알려 주기', '자녀의 성취나 건강을 부모 사주로 단정하지 않기'],
    },
    study: {
      title: resourceCount ? '이해한 것을 자기 말로 바꿀 때 공부가 오래 남습니다' : '짧게 해 보고 고치는 공부법이 잘 맞습니다',
      body: `배움과 이해를 뜻하는 인성이 겉에 ${resourceCount}개 보입니다. ${resourceCount ? '자료를 충분히 읽고 전체 맥락을 파악하는 힘이 있습니다. 다만 완전히 이해할 때까지 시작을 미루지 않도록, 정리한 내용을 내놓을 날짜를 먼저 정하는 편이 좋습니다.' : '정보를 오래 읽는 것보다 문제를 풀거나 다른 사람에게 설명하면서 이해를 만드는 방식이 더 잘 맞을 수 있습니다.'} 시험이나 자격 공부에서는 목표 점수와 복습 간격, 틀린 문제를 다시 보는 날짜를 정해 두세요.`,
      points: [`겉으로 드러난 인성: ${resourceCount}개`, '읽기 → 짧게 요약하기 → 문제에 써 보기 → 말로 설명하기', '일주일마다 결과를 확인하고 다음 계획을 고치기'],
    },
    relationship: {
      title: '가까운 사이일수록 원하는 것을 말로 알려 주세요',
      body: `나와 동료를 뜻하는 비겁은 ${selfCount}개, 책임과 규칙을 뜻하는 관성은 ${authorityCount}개입니다. ${selfCount >= authorityCount ? '내 방식과 속도를 존중받을 때 편하지만, 상대도 자기 방식대로 선택할 수 있다는 점을 잊지 않는 편이 좋습니다.' : '약속과 역할을 중요하게 여기지만, 기준을 맞추느라 내 마음을 계속 뒤로 미루지 않도록 주의해야 합니다.'} 상대가 알아주기를 기다리기보다 원하는 도움과 어려운 점, 지금 가능한 범위를 구체적으로 말하세요.`,
      points: ['감정을 평가하기 전에 실제로 있었던 일부터 말하기', '누가 옳은지보다 다시 맞출 조건을 찾기', '친밀함과 각자의 경계를 함께 지키는 관계인지 살피기'],
    },
    wellbeing: {
      title: '몰입하는 시간과 쉬는 시간을 따로 두세요',
      body: `인성 ${resourceCount}개와 식상 ${outputCount}개를 비교하면, 받아들이는 시간과 밖으로 표현하는 시간을 어떻게 나눌지 살펴볼 수 있습니다. ${resourceCount > outputCount ? '충분히 알아본 뒤 움직이려는 편이라 준비가 길어질 수 있습니다. 그럴 때는 생각을 더하기보다 잠깐 걷거나 작은 일부터 시작하는 편이 낫습니다.' : '표현과 실행이 빠른 편이라 일정 사이에 아무 결과도 만들지 않는 쉬는 시간을 넣어야 오래 갑니다.'} 이 내용은 질병이나 체질을 진단하는 말이 아닙니다. 불편한 증상은 의료 전문가에게 확인하세요.`,
      points: ['집중한 뒤에는 일부러 다른 활동으로 전환하기', `겉으로 드러나지 않은 오행: ${missingLabel}`, '증상과 치료는 사주가 아니라 의료 정보와 전문가 판단을 따르기'],
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
  if (!relations.length) return `${branch}와 원국 사이에는 바로 맞물리는 합·충·형·해·파가 없습니다`
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
    title: `앞으로 10년은 ${signal.mainGroup.label}을 배우는 때입니다`,
    body: `${periodLabel}을 일간과 견주면, 천간 ${signal.stem}은 ${signal.stemGod}, 지지 ${signal.branch}의 중심 기운은 ${signal.branchGod}이 됩니다. 십이운성은 ${signal.twelveStage}입니다. 이는 ${signal.twelveStageMeaning}라는 뜻입니다. 이 10년에는 ${signal.mainGroup.strength}과 ${signal.branchGroup.strength}이 자주 요구될 수 있습니다. 원국과의 관계를 보면 ${signal.relation}. 특정 사건이 반드시 생긴다는 뜻은 아닙니다. 비슷한 선택 앞에 섰을 때 무엇을 먼저 살펴야 하는지를 알려 주는 참고로 보세요.`,
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
    title: `${year}년, ${signal.mainGroup.label}이 눈앞의 과제로 들어옵니다`,
    summary: `${periodLabel}의 천간은 ${signal.stemGod}, 지지의 중심 기운은 ${signal.branchGod}입니다. 십이운성은 ${signal.twelveStage}으로, ${signal.twelveStageMeaning}라는 뜻입니다. ${cycleLink} 원국과의 관계를 보면 ${signal.relation}. 이 말은 사건을 예언하는 것이 아니라, 그해 중요한 결정을 내릴 때 무엇을 한 번 더 확인해야 하는지 알려 주는 참고입니다.`,
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
  const seasonalHarmony = getSeasonalHarmony(pillars.day.stem, pillars.month.branch, pillars)
  const pillarLabels = { year: '년주', month: '월주', day: '일주', time: '시주' }
  const evidence = {
    stemRelations: analyzeStemSet(Object.entries(pillars).map(([key, pillar]) => ({ label: `${pillarLabels[key]} 천간`, value: pillar.stem }))),
    branchRelations: analyzeBranchSet(Object.entries(pillars).map(([key, pillar]) => ({ label: `${pillarLabels[key]} 지지`, value: pillar.branch }))),
  }
  const balance = getElementBalance(Object.values(pillars).map(p => p.ganZhi))
  const balanceStrategy = getBalanceStrategy(pillars, seasonalHarmony)
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
    lunarText: lunar.toString(), pillars, evidence, balance, seasonalHarmony, balanceStrategy, luckCycles,
    interpretation: buildInterpretation(pillars, balance, gender),
  }
}
