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

function elementTermWithParticle(element, consonantForm, vowelForm) {
  const elementName = ELEMENTS[element].ko
  const particle = withParticle(elementName, consonantForm, vowelForm).slice(elementName.length)
  return `${elementName}(${ELEMENTS[element].hanja})${particle}`
}

function strategyReason(element, context) {
  const { dayElement, resourceElement, outputElement, wealthElement, authorityElement, weak, dominantElement, climatePriorityElement, climate } = context
  const subject = elementTermWithParticle(element, '은', '는')
  if (element === climatePriorityElement) return `${subject} ${climate}에서 계절 균형을 먼저 잡는 조후 1순위 작용입니다.`
  if (weak && element === resourceElement) return `${subject} 강한 기운을 받아 ${ELEMENTS[dayElement].ko} 일간으로 이어 주는 생조 통로가 됩니다.`
  if (weak && element === dayElement) return `${subject} 뿌리가 약한 일간의 힘을 직접 보태고 계절의 치우침을 완화합니다.`
  if (weak && element === outputElement) return `${subject} ${ELEMENTS[authorityElement].ko}의 압박을 조절할 수 있지만, 약한 일간의 힘을 먼저 소모하므로 선행 보완이 필요합니다.`
  if (element === dominantElement) return `${subject} 원국에서 이미 두드러져 더 보태기보다 쓰는 방식과 강도를 조절해야 합니다.`
  if (element === wealthElement) return `${subject} 현실의 성과로 연결하지만 일간의 힘을 쓰게 하므로 양을 조절해야 합니다.`
  if (element === authorityElement) return `${subject} 책임과 기준을 세우지만 지나치면 일간을 압박할 수 있습니다.`
  return `${subject} 계절 후보와 원국의 세력을 함께 볼 때 보조적으로 활용할 수 있습니다.`
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
  const seasonalOrder = new Map()
  for (const [index, candidate] of harmony.candidates.entries()) {
    const weight = Math.max(1, 3 - index)
    seasonalOrder.set(candidate.element, Math.max(seasonalOrder.get(candidate.element) || 0, weight))
  }
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

  const climatePriority = harmony.candidates[0]
  const context = {
    dayElement, resourceElement, outputElement, wealthElement, authorityElement, weak, dominantElement,
    climatePriorityElement: climatePriority.element,
    climate: harmony.climate,
  }
  const ranked = ELEMENT_KEYS.map(element => ({
    element,
    label: `${ELEMENTS[element].ko}(${ELEMENTS[element].hanja})`,
    score: Number(scores[element].toFixed(2)),
    force: Number(forces[element].toFixed(2)),
    reason: strategyReason(element, context),
  })).sort((a, b) => b.score - a.score || a.element.localeCompare(b.element))
  const priority = ranked.find(item => item.element === climatePriority.element) || ranked[0]
  const support = ranked.find(item => item.element !== priority.element)
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
    priority,
    priorityBasis: {
      type: 'seasonal-harmony',
      stem: climatePriority.stem,
      order: climatePriority.order,
      evidenceId: climatePriority.evidenceId,
    },
    support, conditional, caution,
    summary: `${strengthText} 그래서 ${elementTermWithParticle(priority.element, '을', '를')} 먼저 살리고 ${elementTermWithParticle(support.element, '을', '를')} 함께 보완합니다.`,
    note: '월령 후보, 표면 천간·지지, 지장간, 뿌리와 생극 흐름을 함께 비교한 설명용 휴리스틱입니다. 충·형·해·파는 뿌리의 안정성에만 소폭 반영하고, 합은 합화로 확정하지 않습니다. 격국까지 확정한 전통 명리의 최종 용신 판정은 아닙니다.',
  }
}

const BRANCH_VISUALS = {
  子: { key: 'rat', animal: '쥐' }, 丑: { key: 'ox', animal: '소' },
  寅: { key: 'tiger', animal: '호랑이' }, 卯: { key: 'rabbit', animal: '토끼' },
  辰: { key: 'dragon', animal: '용' }, 巳: { key: 'snake', animal: '뱀' },
  午: { key: 'horse', animal: '말' }, 未: { key: 'goat', animal: '양' },
  申: { key: 'monkey', animal: '원숭이' }, 酉: { key: 'rooster', animal: '수탉' },
  戌: { key: 'dog', animal: '개' }, 亥: { key: 'pig', animal: '돼지' },
}

const MONTH_VISUALS = {
  寅: { key: 'spring', label: '찬 기운이 남은 초봄' }, 卯: { key: 'spring', label: '새싹이 자라는 봄' }, 辰: { key: 'spring', label: '비를 머금은 늦봄' },
  巳: { key: 'summer', label: '빛이 짙어지는 초여름' }, 午: { key: 'summer', label: '햇살이 강한 한여름' }, 未: { key: 'summer', label: '습기를 머금은 늦여름' },
  申: { key: 'autumn', label: '바람이 마르는 초가을' }, 酉: { key: 'autumn', label: '맑고 서늘한 가을' }, 戌: { key: 'autumn', label: '빛이 깊어지는 늦가을' },
  亥: { key: 'winter', label: '안개가 감도는 초겨울' }, 子: { key: 'winter', label: '눈빛이 깊은 한겨울' }, 丑: { key: 'winter', label: '차고 습한 늦겨울' },
}

const ELEMENT_VISUAL_NAMES = {
  wood: '푸른', fire: '붉은', earth: '황금빛', metal: '은빛', water: '물빛',
}

export const ELEMENT_PLAIN_NAMES = {
  wood: '힘차게 자라는 나무',
  fire: '따뜻하게 데우는 불',
  earth: '단단하게 받쳐 주는 땅',
  metal: '분명하게 정리하는 금속',
  water: '차분하게 흐르는 물',
}

const STEM_KO = { 甲: '갑', 乙: '을', 丙: '병', 丁: '정', 戊: '무', 己: '기', 庚: '경', 辛: '신', 壬: '임', 癸: '계' }
const BRANCH_KO = { 子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사', 午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해' }

function ganZhiKo(pillar) {
  return `${STEM_KO[pillar.stem] || pillar.stem}${BRANCH_KO[pillar.branch] || pillar.branch}`
}

function stemTerm(stem) {
  const element = ELEMENTS[STEM_ELEMENT[stem]]
  return `${STEM_KO[stem]}${element.ko}(${element.hanja})`
}

export function withParticle(word, consonantForm, vowelForm) {
  const last = word.charCodeAt(word.length - 1)
  const hasBatchim = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0
  return `${word}${hasBatchim ? consonantForm : vowelForm}`
}

const CHARACTER_POSES = {
  side: { suffix: '', facing: 'right', phrase: '차분히 서 있는' },
  upright: { suffix: '-upright-three-quarter', facing: 'right', phrase: '두 발로 비스듬히 선' },
  front: { suffix: '-upright', facing: 'front', phrase: '정면으로 당당히 선' },
  jump: { suffix: '-jump', facing: 'left', phrase: '힘차게 도약하는' },
}

export function selectCharacterPose(signature) {
  let hash = 2166136261
  for (const character of String(signature)) {
    hash ^= character.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  const poses = Object.keys(CHARACTER_POSES)
  return poses[(hash >>> 0) % poses.length]
}

export function getSajuVisualProfile(data) {
  const signature = ['year', 'month', 'day', 'time'].map(position => data.pillars?.[position]?.ganZhi).join('/')
  if (signature === '丙寅/辛丑/甲戌/癸酉') return {
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

    natalLabel: '그림으로 만나는 나의 사주',
    luckLabel: '나만의 개운 이미지',
    luckTitle: '따뜻한 온기와 맑은 물을 받아 힘을 얻는 푸른 개',
    title: '차가운 늦겨울, 따뜻한 빛과 맑은 물을 받는 푸른 개',
    tags: ['#큰나무처럼곧게', '#차가운늦겨울', '#겨울태양', '#맑은물', '#가까운온기'],
    readingLabel: '그림으로 읽는 나의 사주',
    overall: '당신은 차가운 겨울 땅에 서 있는 푸른 개입니다. 이 푸른 개는 큰 나무처럼 곧게 자라고, 한번 정한 방향을 쉽게 놓지 않는 당신을 보여 줍니다. 눈 덮인 땅은 시작하기 전에 몸과 마음을 충분히 데워야 하는 환경입니다. 뒤의 큰 태양은 이미 가진 밝은 추진력이고, 얼지 않은 맑은 물은 생각과 감각을 다시 살리는 힘입니다. 따뜻한 빛이 가까이 오래 머물 때, 당신은 물을 마신 푸른 개처럼 다시 힘을 내서 움직일 수 있습니다.',
    scene: '차가운 환경에서도 이미 가진 밝은 힘을 잘 쓰고, 가까운 온기와 맑은 물을 충분히 받아야 편안하게 성장하는 사람입니다.',
    protagonist: {
      label: '그림 속의 나',
      term: '갑술일주(푸른 개)',
      visual: '갑목(곧게 자라는 큰 나무)의 푸른빛과 곧은 기상은 색과 꼿꼿한 자세에, 술토의 개는 주인공의 모습에 담았습니다.',
      title: '큰 나무처럼 곧게 선 푸른 개',
      body: '이 푸른 개가 바로 당신입니다. 주변이 차갑고 움직이기 어려워도 자기 자리를 지키고, 방향을 정하면 꾸준히 나아가는 힘이 있습니다.',
      visualCue: '푸른빛은 큰 나무의 생명력을, 꼿꼿한 자세는 쉽게 꺾이지 않는 태도를 보여 줍니다.',
      technicalTerm: '갑술일주',
      previewLayers: ['layer-01-environment-base.jpg', 'layer-04-blue-dog-base.png'],
      focus: 'protagonist',
      alt: '눈 덮인 겨울 땅에 꼿꼿하게 서 있는 푸른 개',
    },
    environment: {
      label: '내가 놓인 계절',
      term: '신축월(차갑고 습한 늦겨울)',
      visual: '눈밭과 굳은 겨울 땅은 실제 출생일의 날씨가 아니라 축월의 계절성을 나타냅니다.',
      title: '차갑고 습한 늦겨울 땅',
      body: '당신은 따뜻한 봄이 아니라 아직 땅이 굳어 있는 늦겨울의 환경에서 출발합니다. 무조건 서두르기보다 준비할 시간을 충분히 가질 때 제 힘이 나옵니다.',
      visualCue: '눈밭과 단단한 땅은 약하다는 뜻이 아닙니다. 몸과 마음이 풀린 뒤에 움직여야 오래 간다는 뜻입니다.',
      technicalTerm: '신축월',
      previewLayers: ['layer-01-environment-base.jpg'],
      focus: 'environment',
      alt: '눈이 쌓이고 땅이 단단하게 굳은 늦겨울 들판',
    },
    existingStrength: {
      label: '이미 가진 힘',
      term: '병화(태양)',
      visual: '병인년주의 태양은 인목에 뿌리를 두어 겨울에도 힘 있게 빛나는 원국의 자원입니다.',
      title: '겨울에도 크게 빛나는 태양',
      body: '차가운 환경 속에서도 당신에게는 분위기를 밝히고 다시 시작하게 만드는 힘이 이미 있습니다. 힘든 때에도 해야 할 일을 찾아 움직이는 편입니다.',
      visualCue: '작은 불꽃이 아니라 큰 태양으로 그린 이유는, 이 밝은 힘이 밖에서 빌려 오는 것이 아니라 원래부터 당신 안에 있기 때문입니다.',
      technicalTerm: '병화',
      previewLayers: ['layer-01-environment-base.jpg', 'layer-02-rooted-sun.png'],
      focus: 'sun',
      alt: '차가운 겨울 들판 뒤에서 크고 붉게 빛나는 태양',
    },
    neededFunction: {
      label: '지금 더 필요한 힘',
      term: '정화(가까이 머무는 온기)',
      visual: '불꽃을 하나 더 그리지 않고, 따뜻한 빛이 강아지와 땅과 물 가까이에 지속되는 모습으로 표현했습니다.',
      title: '멀리 비추는 빛보다 가까이 머무는 온기',
      body: '지금 더 필요한 것은 강한 자극이 아니라 몸과 마음을 천천히 녹여 주는 꾸준한 온기입니다. 한 번에 몰아붙이기보다 편안한 리듬을 오래 유지하는 쪽이 잘 맞습니다.',
      visualCue: '별도의 불꽃을 더하지 않고, 땅과 물 가까이에 오래 남는 주황빛으로 표현했습니다.',
      technicalTerm: '정화',
      previewLayers: ['layer-01-environment-base.jpg', 'layer-02-rooted-sun.png', 'layer-06-nearby-warmth.png'],
      focus: 'warmth',
      alt: '겨울 땅과 물 가까이에 부드럽게 머무는 따뜻한 주황빛',
    },
    support: {
      label: '나를 살리는 물',
      term: '계수(이슬과 맑은 물)',
      visual: '차갑게 얼어붙는 물이 아니라 태양의 온기 아래 갑목을 길러 주는 물로 표현했습니다.',
      title: '얼지 않고 흐르는 맑은 물',
      body: '당신은 생각과 감정을 충분히 받아들일 때 다시 자랄 힘을 얻습니다. 혼자 버티기보다 필요한 정보와 도움을 제때 받아들이는 것이 중요합니다.',
      visualCue: '물이 얼어붙지 않고 푸른 개 가까이 이어지는 모습은, 필요한 것이 실제 행동까지 연결되는 장면입니다.',
      technicalTerm: '계수',
      previewLayers: ['layer-01-environment-base.jpg', 'layer-02-rooted-sun.png', 'layer-03-clear-water.png'],
      focus: 'water',
      alt: '태양빛 아래 얼지 않고 푸른 개 가까이 흐르는 맑은 물',
    },
    flow: '큰 태양이 추위를 덜어 주고, 맑은 물이 푸른 개에게 닿습니다. 당신도 충분히 따뜻해지고 필요한 도움을 받아들일 때 가장 힘 있게 움직입니다.',
  }

  const day = data.pillars?.day
  const month = data.pillars?.month
  const year = data.pillars?.year
  const hour = data.pillars?.time
  const animal = BRANCH_VISUALS[day?.branch]
  const environment = MONTH_VISUALS[month?.branch]
  const dayElement = STEM_ELEMENT[day?.stem]
  const priority = data.balanceStrategy?.priority
  const support = data.balanceStrategy?.support
  const yearElement = STEM_ELEMENT[year?.stem]
  const hourElement = STEM_ELEMENT[hour?.stem]
  if (!animal || !environment || !dayElement || !yearElement || !hourElement || !priority || !support) {
    throw new Error('범용 물상 이미지를 만들 명식 정보가 부족합니다.')
  }
  const coloredAnimal = `${ELEMENT_VISUAL_NAMES[dayElement]} ${animal.animal}`
  const environmentLayer = `environments/${environment.key}.jpg`
  const innateEffects = [...new Set([yearElement, hourElement])].map(element => `effects/${element}.png`)
  const luckEffects = [...new Set([yearElement, hourElement, priority.element, support.element])]
    .map(element => `effects/${element}.png`)
  const dayImage = DAY_MASTER[day.stem]
  const yearImage = DAY_MASTER[year.stem]
  const hourImage = DAY_MASTER[hour.stem]
  const dayName = ganZhiKo(day)
  const monthName = ganZhiKo(month)
  const yearName = ganZhiKo(year)
  const hourName = ganZhiKo(hour)
  const poseKey = selectCharacterPose(signature)
  const pose = CHARACTER_POSES[poseKey]
  const protagonistLayer = `protagonists/${animal.key}${pose.suffix}.png`

  return {
    kind: 'generic-layered',
    asset: `${priority.element}.jpg`,
    natalAsset: `${dayElement}.jpg`,
    luckAsset: `${priority.element}.jpg`,
    characterTint: ELEMENTS[dayElement].color,
    characterPose: poseKey,
    characterFacing: pose.facing,
    layers: {
      basePath: 'generic-layers',
      natal: [environmentLayer, ...innateEffects, protagonistLayer],
      luck: [environmentLayer, ...luckEffects, protagonistLayer],
    },

    natalLabel: '그림으로 만나는 나의 사주',
    luckLabel: '나만의 개운 이미지',
    luckTitle: `${withParticle(ELEMENT_PLAIN_NAMES[priority.element], '과', '와')} ${ELEMENT_PLAIN_NAMES[support.element]}의 도움을 받는 ${coloredAnimal}`,
    title: `${environment.label}에서 ${pose.phrase} ${coloredAnimal}`,
    tags: [`#${dayImage[0].replaceAll(' ', '')}처럼`, `#${coloredAnimal.replaceAll(' ', '')}`, `#${environment.label.replaceAll(' ', '')}`, `#${yearImage[0].replaceAll(' ', '')}의힘`, `#${ELEMENT_PLAIN_NAMES[priority.element].replaceAll(' ', '')}`],
    readingLabel: '그림으로 읽는 나의 사주',
    overall: `당신은 ${environment.label}에 서 있는 ${coloredAnimal}입니다. ${dayImage[0]}처럼 자기 방식으로 자라려는 힘이 있고, ${pose.phrase} 모습으로 그 성향을 보여 줍니다. 지금은 ${withParticle(ELEMENT_PLAIN_NAMES[priority.element], '을', '를')} 먼저 챙기고, ${withParticle(ELEMENT_PLAIN_NAMES[support.element], '을', '를')} 함께 더할 때 훨씬 편안하게 힘을 쓸 수 있습니다.`,
    scene: `${environment.label} 속에서 ${coloredAnimal}이 자기 자리를 지키고 있습니다. 주변의 빛과 자연이 주인공에게 닿는 모습으로 지금 필요한 힘을 보여 줍니다.`,
    protagonist: {
      label: '그림 속의 나',
      term: `${dayName}일주(${coloredAnimal})`,
      visual: `${stemTerm(day.stem)}의 ${dayImage[0]} 물상은 색과 자세에, ${BRANCH_KO[day.branch]}의 ${withParticle(animal.animal, '은', '는')} 주인공의 형태에 담았습니다.`,
      title: `${dayImage[0]}처럼 자기 길을 가는 ${coloredAnimal}`,
      body: `이 ${withParticle(coloredAnimal, '이', '가')} 바로 당신입니다. ${dayImage[0]}의 성향을 바탕으로, 익숙한 방식과 자기 속도를 지키며 움직이는 편입니다.`,
      visualCue: `주인공의 ${ELEMENT_VISUAL_NAMES[dayElement]}빛과 ${pose.phrase} 자세를 보면 당신이 힘을 쓰는 방식을 알 수 있습니다.`,
      technicalTerm: `${dayName}일주`,
      previewLayers: [environmentLayer, protagonistLayer],
      focus: 'protagonist',
      alt: `${environment.label}에 ${pose.phrase} ${coloredAnimal}`,
    },
    environment: {
      label: '내가 놓인 계절',
      term: `${monthName}월(${environment.label})`,
      visual: `배경의 계절은 실제 출생일 날씨가 아니라 월령의 온도와 습도를 상징합니다.`,
      title: `내가 출발한 계절, ${environment.label}`,
      body: `당신은 ${environment.label}의 영향을 크게 받습니다. 같은 능력이 있어도 몸과 마음이 편안해지는 조건을 먼저 갖출 때 훨씬 자연스럽게 움직입니다.`,
      visualCue: '하늘의 색, 땅의 상태, 빛의 세기를 보면 당신이 놓인 기본 환경을 알 수 있습니다.',
      technicalTerm: `${monthName}월`,
      previewLayers: [environmentLayer],
      focus: 'environment',
      alt: `${monthName}월을 나타내는 ${environment.label} 풍경`,
    },
    existingStrength: {
      label: '이미 가진 힘',
      term: `${stemTerm(year.stem)}(${yearImage[0]})`,
      visual: `${yearName}년주의 물상을 멀리서 장면 전체에 영향을 주는 빛과 지형의 힘으로 읽었습니다.`,
      title: `이미 가지고 있는 ${yearImage[0]}의 힘`,
      body: `당신에게는 ${yearImage[1]}이 이미 있습니다. 필요할 때 이 힘을 꺼내 쓰면 주변 상황에 끌려가기보다 자기 방향을 다시 잡을 수 있습니다.`,
      visualCue: '배경 전체에 퍼지는 빛과 자연의 효과가 원래부터 가지고 있는 힘을 보여 줍니다.',
      technicalTerm: `${yearName}년주`,
      previewLayers: [environmentLayer, `effects/${yearElement}.png`],
      focus: 'existing',
      alt: `${environment.label} 풍경에 더해진 ${yearImage[0]}의 힘`,
    },
    neededFunction: {
      label: '지금 먼저 필요한 힘',
      term: priority.label,
      visual: `${priority.reason} 개운 이미지에서는 이 작용을 가장 먼저 보이는 자연 효과로 더했습니다.`,
      title: `지금 먼저 챙길 힘, ${ELEMENT_PLAIN_NAMES[priority.element]}`,
      body: `지금은 ${withParticle(ELEMENT_PLAIN_NAMES[priority.element], '이', '가')} 가장 필요합니다. 거창하게 바꾸기보다 생활 속에서 이 힘을 자주 쓰면 답답했던 흐름이 한결 부드러워집니다.`,
      visualCue: `${ELEMENTS[priority.element].ko}의 색과 자연 효과가 주인공 가까이에 닿는 부분을 보세요.`,
      technicalTerm: priority.label,
      previewLayers: [environmentLayer, `effects/${priority.element}.png`],
      focus: 'priority',
      alt: `${environment.label} 풍경에 나타난 ${ELEMENT_PLAIN_NAMES[priority.element]}`,
    },
    support: {
      label: '함께 챙길 힘',
      term: support.label,
      visual: `${support.reason} 주된 보완을 빼앗지 않는 보조 흐름으로 표현했습니다.`,
      title: `함께 받쳐 줄 힘, ${ELEMENT_PLAIN_NAMES[support.element]}`,
      body: `${ELEMENT_PLAIN_NAMES[support.element]}도 함께 필요합니다. 먼저 필요한 힘이 오래 유지되도록 옆에서 받쳐 주는 역할을 합니다.`,
      visualCue: `주인공을 덮지 않고 주변에 이어지는 ${ELEMENTS[support.element].ko}의 색과 움직임을 보세요.`,
      technicalTerm: support.label,
      previewLayers: [environmentLayer, `effects/${support.element}.png`],
      focus: 'support',
      alt: `${environment.label} 풍경에 더해진 ${ELEMENT_PLAIN_NAMES[support.element]}`,
    },
    flow: `${withParticle(ELEMENT_PLAIN_NAMES[priority.element], '이', '가')} 먼저 길을 열고, ${withParticle(ELEMENT_PLAIN_NAMES[support.element], '이', '가')} 그 힘을 받쳐 줍니다. 그 도움을 받은 ${withParticle(animal.animal, '이', '가')} 자기답게 움직이는 그림입니다.`,
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
      title: `${day[0]}처럼 자기 방향을 만들어 가는 사람입니다`,
      body: `당신은 ${day[0]}처럼 자기 방식으로 자라고 싶어 하는 사람입니다. ${day[1]}이 기본 성향이고, 특히 ${primaryGroup.strength}을 잘합니다. 다만 잘하는 일을 혼자 오래 끌고 가면 지치기 쉽습니다. 내가 꼭 해야 할 일과 다른 사람에게 맡겨도 되는 일을 나누면 장점이 훨씬 편안하게 살아납니다.`,
      points: [`내 기본 성향: ${day[1]}`, `내가 잘하는 것: ${primaryGroup.strength}`, `의식해서 챙길 힘: ${missingLabel}`],
    },
    personality: {
      title: '평소에는 단단하지만, 급해지면 혼자 버티기 쉽습니다',
      body: `평소의 당신은 ${day[1]}이 자연스럽게 드러납니다. ${dominantCopy.strength}도 강점입니다. 문제는 일이 한꺼번에 몰릴 때입니다. 잘해 내고 싶은 마음 때문에 도움을 늦게 청하거나, 이미 지쳤는데도 계속 버틸 수 있습니다. 그럴수록 더 열심히 하기보다 먼저 순서를 정하고 한 가지씩 끝내는 편이 좋습니다.`,
      points: [`편안할 때의 강점: ${day[1]}`, `지쳤을 때 살필 점: ${dominantCopy.caution}`, '지금 내게 필요한 것은 더 버티기일까, 잠깐 멈추기일까?'],
    },
    career: {
      title: '직업 이름보다 어떤 일을 맡느냐가 중요합니다',
      body: `당신은 ${primaryGroup.strength}을 활용하는 일에서 실력이 잘 드러납니다. ${careerRoles.slice(0, 4).join('·')} 분야를 살펴볼 수 있지만, 직업 이름만 보고 고르지는 마세요. 같은 직업도 사람을 많이 상대하는지, 혼자 깊게 파고드는지, 결과 기준이 분명한지에 따라 만족도가 크게 달라집니다. 업무 내용과 조직 분위기를 함께 봐야 오래 다닐 수 있습니다.`,
      points: [`잘 맞는 역할: ${careerRoles.slice(0, 3).join(' · ')}`, `함께 살펴볼 분야: ${careerRoles.slice(3, 6).join(' · ')}`, '직장을 고를 때는 실제 업무와 평가 기준을 꼭 확인하세요.'],
    },
    wealth: {
      title: wealthCount ? '돈을 버는 힘과 지키는 기준을 따로 세우세요' : '돈 관리는 눈에 보이는 기준을 만드는 것부터 시작합니다',
      body: wealthCount ? `당신은 돈과 시간을 실제 결과로 연결하려는 감각이 있는 편입니다. 다만 기회가 보이면 한꺼번에 여러 선택을 잡을 수 있으니, 버는 계획과 지키는 계획을 따로 세우세요. 월 고정비, 생활비, 저축, 배움에 쓰는 돈을 나누어 두면 마음도 훨씬 가벼워집니다. 큰 투자나 대출은 사주가 아니라 실제 소득과 감당 가능한 손실을 기준으로 결정하세요.` : `당신은 돈 자체보다 일의 의미, 사람과의 관계, 내 실력을 먼저 생각하는 편일 수 있습니다. 그래서 돈 관리는 의지보다 자동화가 잘 맞습니다. 수입이 들어오면 저축과 고정비가 먼저 빠져나가게 하고, 큰 결제는 하루 뒤에 다시 확인하세요. 투자나 대출은 실제 소득과 부채를 기준으로 결정해야 합니다.`,
      points: ['고정비·생활비·저축을 따로 나누어 관리하기', '큰 결제는 바로 결정하지 말고 하루 뒤 다시 보기', '투자와 대출은 실제 숫자로 판단하기'],
    },
    spouse: {
      title: '좋은 인연은 운보다 생활의 합이 더 중요합니다',
      body: `당신은 좋아하는 마음만큼 생활이 잘 맞는지도 중요하게 보는 편입니다. 오래 만날 사람이라면 애정 표현 방식, 돈 쓰는 습관, 집안일 분담, 양가 가족과의 거리를 솔직하게 이야기해 보세요. 갈등이 생겼을 때 피하지 않고 대화할 수 있는 사람인지가 특히 중요합니다. 설렘은 관계를 시작하게 하지만, 서로의 생활을 존중하는 태도가 관계를 오래 지켜 줍니다.`,
      points: ['사랑을 표현하는 방식이 서로 맞는지 보기', '돈과 집안일을 어떻게 나눌지 미리 이야기하기', '갈등이 생겼을 때 대화가 되는 사람인지 살피기'],
    },
    family: {
      title: '가족을 챙기는 일에도 내 몫의 선이 필요합니다',
      body: `${resourceCount >= selfCount ? '당신은 가족의 기대와 조언을 가볍게 넘기지 못하고, 내 선택을 설명하느라 힘을 많이 쓸 수 있습니다.' : '당신은 가족에게 걱정을 끼치기 싫어서 힘든 일도 혼자 해결하려는 편일 수 있습니다.'} 하지만 가까운 사이라도 모든 책임을 혼자 질 필요는 없습니다. 돈, 돌봄, 연락, 명절과 가족 행사처럼 반복되는 문제는 미리 범위를 정해 두는 것이 좋습니다.`,
      points: ['부모와 가족의 기대 중 내가 할 수 있는 몫만 구분하기', '형제나 친척과 비교하기보다 서로 다른 조건을 인정하기', '죄책감보다 오래 지킬 수 있는 책임을 선택하기'],
    },
    children: {
      title: '가르쳐 주는 것과 기다려 주는 것의 균형이 필요합니다',
      body: `${outputCount ? '당신은 설명해 주고 함께 결과를 만드는 데 강점이 있습니다.' : '당신은 말로 재촉하기보다 안정된 환경과 한결같은 태도로 보여 주는 방식이 편합니다.'} 자녀나 학생, 후배를 도울 때는 정답을 바로 알려 주기보다 직접 해 보고 실수할 시간을 남겨 주세요. 잘되길 바라는 마음이 앞서면 상대의 속도까지 대신 정해 버릴 수 있습니다.`,
      points: ['지시보다 선택지와 이유를 함께 알려 주기', '상대가 직접 해 보고 실수할 시간 남겨 두기', '내 기대보다 상대의 나이와 속도를 먼저 보기'],
    },
    study: {
      title: resourceCount ? '이해한 것을 자기 말로 바꿀 때 공부가 오래 남습니다' : '짧게 해 보고 고치는 공부법이 잘 맞습니다',
      body: `${resourceCount ? '당신은 자료를 충분히 읽고 전체 흐름을 이해하는 힘이 있습니다. 다만 완벽히 이해한 뒤 시작하려다 출발이 늦어질 수 있습니다.' : '당신은 오래 읽는 것보다 직접 문제를 풀고, 다른 사람에게 설명하면서 배우는 방식이 잘 맞습니다.'} 공부할 때는 읽기만 하지 말고 짧게 요약한 뒤 바로 문제에 써 보세요. 시험이나 자격 공부는 목표 점수와 복습 날짜를 미리 정하면 훨씬 안정적입니다.`,
      points: ['읽은 내용을 짧게 자기 말로 바꾸기', '바로 문제에 써 보고 틀린 이유 확인하기', '일주일마다 계획을 현실에 맞게 고치기'],
    },
    relationship: {
      title: '가까운 사이일수록 원하는 것을 말로 알려 주세요',
      body: `${selfCount >= authorityCount ? '당신은 내 방식과 속도를 존중받을 때 가장 편합니다. 다만 상대에게도 자기 방식이 있다는 점을 잊지 않는 것이 좋습니다.' : '당신은 약속과 역할을 중요하게 여기지만, 분위기를 맞추느라 내 마음을 뒤로 미룰 수 있습니다.'} 상대가 알아서 눈치채기를 기다리지 말고, 원하는 도움과 어려운 점을 구체적으로 말하세요. 친한 관계일수록 솔직한 기준이 필요합니다.`,
      points: ['감정을 평가하기 전에 실제로 있었던 일부터 말하기', '누가 옳은지보다 다시 맞출 조건을 찾기', '친밀함과 각자의 경계를 함께 지키는 관계인지 살피기'],
    },
    wellbeing: {
      title: '몰입하는 시간과 쉬는 시간을 따로 두세요',
      body: `${resourceCount > outputCount ? '당신은 충분히 알아본 뒤 움직이고 싶어 해서 준비가 길어질 수 있습니다. 생각이 많아질 때는 정보를 더 찾기보다 잠깐 걷거나 아주 작은 일부터 시작해 보세요.' : '당신은 생각을 바로 말과 행동으로 옮기는 편이라 쉬는 시간을 놓치기 쉽습니다. 일정 사이에 아무 결과도 만들지 않는 시간을 일부러 넣어야 오래 갑니다.'} 몸이 계속 불편하다면 사주 해석보다 의료 전문가의 진료를 먼저 받으세요.`,
      points: ['집중한 뒤에는 다른 활동으로 몸과 머리 전환하기', '쉬는 시간을 할 일처럼 일정에 넣기', '계속되는 증상은 의료 전문가에게 확인하기'],
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
  if (!relations.length) return `${branch}와 내 사주의 글자 사이에는 바로 맞물리는 관계가 없습니다`
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
  const pillarLabels = { year: '내 사주 첫째 기둥', month: '내 사주 둘째 기둥', day: '내 사주 셋째 기둥', time: '내 사주 넷째 기둥' }
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
    ? `${periodLabel}에는 연애나 배우자 관계를 현실적으로 생각할 일이 많아질 수 있습니다. 마음만 확인하지 말고 연락 방식, 돈, 집안일, 앞으로의 생활 계획을 함께 이야기해 보세요.`
    : `${periodLabel}에는 연애보다 일이나 공부, 내 생활을 정리하는 일이 앞에 놓이기 쉽습니다. 가까운 관계가 저절로 유지되기를 기다리지 말고, 함께 보낼 시간을 일정에 먼저 넣어 두세요.`
  return {
    career: `${periodLabel}에는 ${signal.mainGroup.strength}이 일에서 중요해집니다. 새 역할을 제안받으면 이름이나 직함보다 실제로 맡을 일, 책임 범위, 평가 기준을 먼저 확인하세요.`,
    wealth: `${periodLabel}에는 ${signal.mainGroupKey === 'wealth' || signal.branchGroupKey === 'wealth' ? '돈과 시간을 성과로 연결하는 일이 많아질 수 있습니다' : '열심히 한 일을 실제 수입으로 연결하는 계획이 필요합니다'}. 수입과 지출, 비상금을 따로 관리하고 큰 계약과 투자는 실제 숫자를 확인한 뒤 결정하세요.`,
    spouse: spouseText,
    relationship: `사람들과 함께할 일이 늘수록 서로 기대하는 역할이 달라질 수 있습니다. 연락 횟수, 돈, 책임 범위를 말로 확인해야 오해를 줄일 수 있습니다.`,
    wellbeing: `${signal.mainGroup.caution} 일정이 몰릴 때는 수면과 식사 시간을 먼저 지키세요. 몸의 불편이 계속되면 사주 해석보다 의료 전문가의 진료를 우선해야 합니다.`,
  }
}

function buildCycleReading(pillars, ganZhi, startYear, endYear, gender) {
  const signal = fortuneSignals(pillars, ganZhi, gender, '대운')
  const periodLabel = `${startYear}~${endYear}년 ${ganZhi} 대운`
  return {
    title: `앞으로 10년, ${signal.mainGroup.strength}이 중요해집니다`,
    body: `${startYear}년부터 ${endYear}년까지는 ${signal.mainGroup.strength}과 ${signal.branchGroup.strength}을 자주 요구받는 시기입니다. 전체 흐름은 ${signal.twelveStageMeaning}입니다. 일을 무작정 늘리기보다 지금 끝낼 것과 새로 시작할 것을 나누세요. 중요한 선택 앞에서는 다른 사람의 기대에 끌려가기보다 내가 감당할 시간과 돈, 책임의 범위를 먼저 확인하는 편이 좋습니다.`,
    signals: [`천간 ${signal.stem} · ${signal.stemGod}`, `지지 ${signal.branch} · ${signal.branchGod}`, `십이운성 · ${signal.twelveStage}`, signal.relation],
    evidence: { twelveStage: signal.twelveStage, twelveStageMeaning: signal.twelveStageMeaning, stemRelations: signal.stemRelations, branchRelations: signal.branchRelations },
    areas: luckAreas(signal, periodLabel),
  }
}

function buildAnnualReading(pillars, cycleGanZhi, year, age, ganZhi, gender) {
  const signal = fortuneSignals(pillars, ganZhi, gender, '세운', [{ label: '대운', ganZhi: cycleGanZhi }])
  const cycleSignal = fortuneSignals(pillars, cycleGanZhi, gender, '대운')
  const cycleLink = signal.mainGroupKey === cycleSignal.mainGroupKey
    ? `10년의 큰 흐름과 올해의 흐름이 같아서, ${signal.mainGroup.strength}이 더 중요하게 느껴질 수 있습니다.`
    : `10년 동안 이어지는 ${cycleSignal.mainGroup.strength} 위에 올해의 ${signal.mainGroup.strength}이 더해집니다.`
  const periodLabel = `${year}년 ${ganZhi} 세운`
  return {
    title: `${year}년, ${signal.mainGroup.strength}에 집중할 때입니다`,
    summary: `${year}년의 전체 흐름은 ${signal.twelveStageMeaning}입니다. ${cycleLink} 여러 일을 한꺼번에 잡기보다 올해 꼭 남기고 싶은 결과를 먼저 정하세요. 중요한 결정을 내릴 때는 마음이 급한지, 실제 시간과 돈이 충분한지 한 번 더 확인하는 편이 좋습니다.`,
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
