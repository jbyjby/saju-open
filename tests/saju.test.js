import { describe, expect, it } from 'vitest'
import {
  calculateSaju,
  directDayGanZhi,
  directTimeGanZhi,
  convertLunarToSolar,
  getElementBalance,
  getTenGod,
  getTwelveStage,
  analyzeBranchSet,
  analyzeStemSet,
  getSeasonalHarmony,
  getBalanceStrategy,
  getLuckImageGuidance,
  getSajuVisualProfile,
  trueSolarTime,
} from '../src/saju.js'

describe('trueSolarTime', () => {
  it('서울 경도 보정으로 입력 시각에서 32분을 뺀다', () => {
    expect(trueSolarTime(2024, 3, 1, 0, 20)).toEqual({
      year: 2024, month: 2, day: 29, hour: 23, minute: 48,
    })
  })
})

describe('만세력 계산', () => {
  it('2000-01-01의 일주는 기준점인 戊午다', () => {
    expect(directDayGanZhi(2000, 1, 1)).toBe('戊午')
    const result = calculateSaju({
      calendar: 'solar', year: 2000, month: 1, day: 1,
      hour: 12, minute: 32, gender: 'female',
    })
    expect(result.pillars.day.ganZhi).toBe('戊午')
  })

  it('1986-05-29의 년·월·일주가 공개 예시와 일치한다', () => {
    const result = calculateSaju({
      calendar: 'solar', year: 1986, month: 5, day: 29,
      hour: 0, minute: 32, gender: 'male',
    })
    expect([
      result.pillars.year.ganZhi,
      result.pillars.month.ganZhi,
      result.pillars.day.ganZhi,
    ]).toEqual(['丙寅', '癸巳', '癸酉'])
    expect(result.seasonalHarmony.candidates.map(item => item.stem)).toEqual(['辛', '庚'])
    expect(result.seasonalHarmony.monthBranch).toBe('巳')
    expect(result.evidence.branchRelations)
      .toEqual(expect.arrayContaining([expect.objectContaining({ type: '육해', members: ['寅', '巳'] })]))
  })

  it('시주는 일간과 평균태양시의 시지로 직접 계산한다', () => {
    expect(directTimeGanZhi('癸', 0)).toBe('壬子')
    expect(directTimeGanZhi('甲', 23)).toBe('甲子')
  })

  it('음력 날짜를 양력으로 변환한다', () => {
    expect(convertLunarToSolar(1986, 4, 21, false)).toMatchObject({
      year: 1986, month: 5, day: 29,
    })
  })
})

describe('해석 규칙', () => {
  it('팔자의 천간과 지지 8글자를 오행으로 집계한다', () => {
    expect(getElementBalance(['丙寅', '癸巳', '癸酉', '壬子'])).toEqual({
      wood: 1, fire: 2, earth: 0, metal: 1, water: 4,
    })
  })

  it('갑목 일간에서 편재인 무토를 판정한다', () => {
    expect(getTenGod('甲', '戊')).toBe('편재')
  })

  it('십이운성은 양간 순행·음간 역행으로 계산한다', () => {
    expect(getTwelveStage('甲', '亥')).toBe('장생')
    expect(getTwelveStage('甲', '卯')).toBe('제왕')
    expect(getTwelveStage('乙', '午')).toBe('장생')
    expect(getTwelveStage('癸', '卯')).toBe('장생')
  })

  it('같은 지지를 육합이나 육충으로 오판하지 않는다', () => {
    expect(analyzeBranchSet([
      { label: '원국 월지', value: '巳' },
      { label: '세운 지지', value: '巳' },
    ])).toEqual([])
  })

  it('지지의 충·해·파와 합·형을 구분한다', () => {
    const relations = analyzeBranchSet([
      { label: 'A', value: '子' }, { label: 'B', value: '午' },
      { label: 'C', value: '未' }, { label: 'D', value: '酉' },
    ])
    expect(relations.some(item => item.type === '육충' && item.members.join('') === '子午')).toBe(true)
    expect(relations.some(item => item.type === '육해' && item.members.join('') === '子未')).toBe(true)
    expect(relations.some(item => item.type === '육파' && item.members.join('') === '子酉')).toBe(true)
  })

  it('삼합·방합·삼형·자형을 판정한다', () => {
    expect(analyzeBranchSet(['申', '子', '辰'].map((value, i) => ({ label: String(i), value }))))
      .toEqual(expect.arrayContaining([expect.objectContaining({ type: '삼합', members: ['申', '子', '辰'], result: '수' })]))
    expect(analyzeBranchSet(['寅', '卯', '辰'].map((value, i) => ({ label: String(i), value }))))
      .toEqual(expect.arrayContaining([expect.objectContaining({ type: '방합', members: ['寅', '卯', '辰'], result: '목' })]))
    expect(analyzeBranchSet(['寅', '巳', '申'].map((value, i) => ({ label: String(i), value }))))
      .toEqual(expect.arrayContaining([expect.objectContaining({ type: '삼형', members: ['寅', '巳', '申'] })]))
    expect(analyzeBranchSet([{ label: '원국', value: '辰' }, { label: '세운', value: '辰' }]))
      .toEqual(expect.arrayContaining([expect.objectContaining({ type: '자형', members: ['辰', '辰'] })]))
  })

  it('천간합은 합화 확정이 아닌 결합 신호로 판정한다', () => {
    expect(analyzeStemSet([{ label: '일간', value: '甲' }, { label: '대운', value: '己' }]))
      .toEqual([expect.objectContaining({ type: '천간합', members: ['甲', '己'], result: '토', transformed: false })])
  })

  it('일간과 월령의 120개 조합에 선용·후용·보좌 글자를 제공한다', () => {
    const stems = [...'甲乙丙丁戊己庚辛壬癸']
    const months = [...'寅卯辰巳午未申酉戌亥子丑']
    const all = stems.flatMap(dayStem => months.map(monthBranch => getSeasonalHarmony(dayStem, monthBranch)))
    expect(all).toHaveLength(120)
    for (const item of all) {
      expect(item.candidates.length).toBeGreaterThanOrEqual(1)
      expect(item.candidates.length).toBeLessThanOrEqual(3)
      expect(item.candidates.every(candidate => stems.includes(candidate.stem))).toBe(true)
    }
    const springWood = getSeasonalHarmony('甲', '寅').candidates
    expect(springWood.map(item => item.stem)).toEqual(['丙', '癸'])
    expect(springWood.map(item => [item.element, item.elementKo, item.elementHanja])).toEqual([
      ['fire', '화', '火'],
      ['water', '수', '水'],
    ])
    expect(getSeasonalHarmony('甲', '午').candidates.map(item => item.stem)).toEqual(['癸', '丁', '庚'])
    expect(getSeasonalHarmony('癸', '丑').candidates.map(item => item.stem)).toEqual(['丙', '丁'])
  })

  it('계절 균형 후보가 원국 천간과 지장간에 있는지 구분한다', () => {
    const harmony = getSeasonalHarmony('甲', '寅', {
      year: { stem: '丙', branch: '子' }, month: { stem: '戊', branch: '寅' },
      day: { stem: '甲', branch: '辰' }, time: { stem: '辛', branch: '丑' },
    })
    expect(harmony.candidates[0]).toMatchObject({ stem: '丙', visible: true, hidden: true })
    expect(harmony.candidates[1]).toMatchObject({ stem: '癸', visible: false, hidden: true })
    expect(harmony.label).toBe('계절 균형 참고')
    expect(harmony.evidenceId).toBe('seasonal-harmony:甲:寅')
    expect(harmony.candidates[0].evidenceId).toBe('seasonal-harmony:甲:寅:1:丙')
    expect(harmony.rulesetVersion).toBe('seasonal-harmony-2025-table1-v1')
  })

  it('약한 계수가 강한 화토에 눌릴 때 금 우선·수 보조·목 조건부로 재검증한다', () => {
    const result = calculateSaju({
      calendar: 'solar', year: 2026, month: 11, day: 5,
      hour: 18, minute: 55, gender: 'female',
    })
    expect(Object.values(result.pillars).map(pillar => pillar.ganZhi)).toEqual(['丙午', '戊戌', '癸未', '辛酉'])
    expect(result.balanceStrategy.strength.level).toBe('weak')
    expect(result.balanceStrategy.relationships.branch.map(item => item.type)).toEqual(expect.arrayContaining(['육합', '육해']))
    expect(result.balanceStrategy.rawForces.earth).toBeGreaterThan(result.balanceStrategy.forces.earth)
    expect(result.balanceStrategy.priority.element).toBe('metal')
    expect(result.balanceStrategy.support.element).toBe('water')
    expect(result.balanceStrategy.conditional.map(item => item.element)).toContain('wood')
    expect(result.balanceStrategy.caution.map(item => item.element)).toEqual(expect.arrayContaining(['fire', 'earth']))
    expect(result.balanceStrategy.isFinalYongShen).toBe(false)
  })

  it('개운 이미지는 월령표 첫 줄이 아니라 종합 보완 전략의 우선 기운을 따른다', () => {
    const pillars = {
      year: { stem: '丙', branch: '午' }, month: { stem: '戊', branch: '戌' },
      day: { stem: '癸', branch: '未' }, time: { stem: '辛', branch: '酉' },
    }
    const harmony = getSeasonalHarmony('癸', '戌', pillars)
    const strategy = getBalanceStrategy(pillars, harmony)
    const guidance = getLuckImageGuidance(harmony, strategy)
    expect(guidance.neededElement).toBe('metal')
    expect(guidance.supportElement).toBe('water')
    expect(guidance.whyNeeded).toContain('금')
    expect(guidance.whyNeeded).toContain('수')
  })

  it('예시 명식을 원국 물상과 필요한 작용으로 분리한다', () => {
    const result = calculateSaju({
      calendar: 'solar', year: 1987, month: 1, day: 25,
      hour: 18, minute: 30, gender: 'male',
    })
    const profile = getSajuVisualProfile(result)

    expect(Object.values(result.pillars).map(pillar => pillar.ganZhi)).toEqual(['丙寅', '辛丑', '甲戌', '癸酉'])
    expect(profile.asset).toBe('personalized/1987-01-25-1830.jpg')
    expect(profile.protagonist.term).toBe('갑목(곧게 자라는 큰 나무)')
    expect(profile.existingStrength.term).toBe('병화(태양)')
    expect(profile.neededFunction.term).toBe('정화(가까이 머무는 온기)')
    expect(profile.support.term).toBe('계수(이슬과 맑은 물)')
    expect(profile.flow).toContain('유금 → 계수 → 갑목')
  })

  it('개운 이미지가 필요한 이유를 강점과 보완 행동으로 설명한다', () => {
    const harmony = getSeasonalHarmony('癸', '巳', {
      year: { stem: '丙', branch: '寅' }, month: { stem: '癸', branch: '巳' },
      day: { stem: '癸', branch: '酉' }, time: { stem: '壬', branch: '子' },
    })
    const guidance = getLuckImageGuidance(harmony)
    expect(guidance.strength).toContain('세심')
    expect(guidance.blindSpot).toContain('생각')
    expect(guidance.neededElement).toBe('metal')
    expect(guidance.whyNeeded).toContain('정리')
    expect(guidance.practice).toHaveLength(3)
    expect(guidance.definition).toContain('운명을 바꾸는 주문')
    expect(guidance.saveReason).toContain('휴대폰')
    expect(guidance.claimsGuaranteedEffect).toBe(false)
  })

  it('명식에 따라 6개 영역의 심층 해석을 만든다', () => {
    const result = calculateSaju({
      calendar: 'solar', year: 1986, month: 5, day: 29,
      hour: 0, minute: 32, gender: 'male',
    })
    expect(Object.keys(result.interpretation.readings)).toEqual([
      'overall', 'personality', 'career', 'wealth', 'spouse',
      'family', 'children', 'study', 'relationship', 'wellbeing',
    ])
    for (const reading of Object.values(result.interpretation.readings)) {
      expect(reading.title.length).toBeGreaterThan(2)
      expect(reading.body.length).toBeGreaterThan(80)
      expect(reading.points.length).toBeGreaterThanOrEqual(2)
    }
    expect(result.interpretation.careerRoles.length).toBeGreaterThanOrEqual(4)
    expect(Object.values(result.interpretation.tenGodBalance).reduce((a, b) => a + b, 0)).toBe(7)
  })

  it('대운마다 10개 세운과 영역별 상세 풀이를 만든다', () => {
    const result = calculateSaju({
      calendar: 'solar', year: 1986, month: 5, day: 29,
      hour: 0, minute: 32, gender: 'male',
    })
    expect(result.luckCycles).toHaveLength(8)
    expect(result.luckCycles[0]).toMatchObject({
      ganZhi: '甲午', startYear: 1989, endYear: 1998, startAge: 4, endAge: 13,
    })
    expect(result.luckCycles[0].annualYears).toHaveLength(10)
    expect(result.luckCycles[0].annualYears[0]).toMatchObject({ year: 1989, age: 4, ganZhi: '己巳' })
    expect(result.pillars.year.twelveStage).toBe(getTwelveStage('癸', '寅'))
    expect(result.luckCycles[0].reading.evidence.twelveStage).toBe('절')
    expect(result.luckCycles[0].reading.evidence.twelveStageMeaning).toContain('전환')
    expect(result.luckCycles[0].reading.body).toContain('전환')
    expect(result.luckCycles[0].reading.evidence.branchRelations)
      .toEqual(expect.arrayContaining([expect.objectContaining({ type: '육충', members: ['子', '午'] })]))
    expect(result.luckCycles[0].annualYears[0].reading.evidence.branchRelations
      .some(item => item.members.join('') === '巳巳')).toBe(false)
    expect(result.luckCycles[0].annualYears[0].reading.areas.relationship).toContain('압박')
    expect(result.luckCycles[0].annualYears[0].reading.areas.relationship).toContain('어긋남')
    for (const cycle of result.luckCycles) {
      expect(cycle.reading.body.length).toBeGreaterThan(120)
      expect(Object.keys(cycle.reading.areas)).toEqual(['career', 'wealth', 'spouse', 'relationship', 'wellbeing'])
      for (const annual of cycle.annualYears) {
        expect(annual.reading.summary.length).toBeGreaterThan(60)
        expect(Object.keys(annual.reading.areas)).toEqual(['career', 'wealth', 'spouse', 'relationship', 'wellbeing'])
      }
    }
  })
})
