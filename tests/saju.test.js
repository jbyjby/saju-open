import { describe, expect, it } from 'vitest'
import {
  calculateSaju,
  ELEMENTS,
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
  withParticle,
} from '../src/saju.js'

describe('쉬운 오행 이름의 조사 결합', () => {
  it('받침이 없는 나무에도 이/가와 과/와를 자연스럽게 붙인다', () => {
    expect(withParticle('힘차게 자라는 나무', '이', '가')).toBe('힘차게 자라는 나무가')
    expect(withParticle('힘차게 자라는 나무', '과', '와')).toBe('힘차게 자라는 나무와')
    expect(withParticle('따뜻하게 데우는 불', '이', '가')).toBe('따뜻하게 데우는 불이')
    expect(withParticle('차분하게 흐르는 물', '과', '와')).toBe('차분하게 흐르는 물과')
  })
})

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

  it('120개 일간·월령 조합에서 첫 조후 후보를 우선 보완으로 보존한다', () => {
    const stems = [...'甲乙丙丁戊己庚辛壬癸']
    const months = [...'寅卯辰巳午未申酉戌亥子丑']
    let duplicateElementPairs = 0
    for (const dayStem of stems) {
      for (const monthBranch of months) {
        const pillars = {
          year: { stem: '丙', branch: '寅' },
          month: { stem: '辛', branch: monthBranch },
          day: { stem: dayStem, branch: '戌' },
          time: { stem: '癸', branch: '酉' },
        }
        const harmony = getSeasonalHarmony(dayStem, monthBranch, pillars)
        const strategy = getBalanceStrategy(pillars, harmony)
        if (new Set(harmony.candidates.map(candidate => candidate.element)).size < harmony.candidates.length) {
          duplicateElementPairs += 1
        }
        expect(strategy.priority.element, `${dayStem}/${monthBranch}`).toBe(harmony.candidates[0].element)
        expect(strategy.priorityBasis.evidenceId, `${dayStem}/${monthBranch}`).toBe(harmony.candidates[0].evidenceId)
        expect(strategy.support.element, `${dayStem}/${monthBranch}`).not.toBe(strategy.priority.element)
        const remaining = [strategy.support, ...strategy.conditional, ...strategy.caution]
          .filter(item => item.element !== strategy.priority.element)
          .sort((a, b) => b.score - a.score || a.element.localeCompare(b.element))
        expect(strategy.support.element, `${dayStem}/${monthBranch} support`).toBe(remaining[0].element)
      }
    }
    expect(duplicateElementPairs).toBe(26)
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

  it('종합 보완 전략에서도 조후표 첫 기운을 우선 보완으로 보존한다', () => {
    const pillars = {
      year: { stem: '丙', branch: '午' }, month: { stem: '戊', branch: '戌' },
      day: { stem: '癸', branch: '未' }, time: { stem: '辛', branch: '酉' },
    }
    const harmony = getSeasonalHarmony('癸', '戌', pillars)
    const strategy = getBalanceStrategy(pillars, harmony)
    const guidance = getLuckImageGuidance(harmony, strategy)
    expect(strategy.priority.element).toBe(harmony.candidates[0].element)
    expect(guidance.neededElement).toBe('metal')
    expect(guidance.supportElement).toBe('water')
    expect(guidance.whyNeeded).toContain('금')
    expect(guidance.whyNeeded).toContain('수')
  })

  it('갑목 축월은 신약 가산점보다 정화의 계절 온기를 먼저 보완한다', () => {
    const result = calculateSaju({
      calendar: 'solar', year: 1987, month: 1, day: 25,
      hour: 18, minute: 30, gender: 'male',
    })
    expect(result.seasonalHarmony.candidates[0]).toMatchObject({ stem: '丁', element: 'fire', order: 1 })
    expect(result.balanceStrategy.priority.element).toBe('fire')
    expect(result.balanceStrategy.priority.score).toBe(2.5)
    expect(result.balanceStrategy.priority.reason).toContain('차고 습한')
    expect(result.balanceStrategy.priority.reason).toContain('조후 1순위')
    expect(result.balanceStrategy.priority.reason).toContain('화(火)는')
    expect(result.balanceStrategy.support.element).toBe('water')
    expect(result.balanceStrategy.support.reason).toContain('수(水)는')
    expect(result.balanceStrategy.summary).toContain('화(火)를 먼저')
    expect(result.balanceStrategy.summary).toContain('수(水)를 함께')
    expect(result.balanceStrategy.priorityBasis).toMatchObject({
      type: 'seasonal-harmony', stem: '丁', order: 1,
      evidenceId: 'seasonal-harmony:甲:丑:1:丁',
    })
  })

  it('같은 명식에는 같은 포즈와 시선 방향을 고정한다', () => {
    const input = {
      calendar: 'solar', year: 2001, month: 1, day: 1,
      hour: 12, minute: 32, gender: 'female',
    }
    const first = getSajuVisualProfile(calculateSaju(input))
    const repeated = getSajuVisualProfile(calculateSaju(input))
    expect(repeated.characterPose).toBe(first.characterPose)
    expect(repeated.characterFacing).toBe(first.characterFacing)
    expect(repeated.layers.natal.at(-1)).toBe(first.layers.natal.at(-1))
  })

  it('기존 세 포즈를 버리지 않고 정면형을 더해 네 가지 자산을 모두 사용한다', () => {
    const profiles = Array.from({ length: 60 }, (_, index) => getSajuVisualProfile(calculateSaju({
      calendar: 'solar', year: 2001, month: 1, day: (index % 28) + 1,
      hour: index % 24, minute: 32, gender: 'female',
    })))
    expect(new Set(profiles.map(profile => profile.characterPose))).toEqual(new Set(['side', 'upright', 'front', 'jump']))
    const patterns = {
      side: /^protagonists\/[a-z]+\.png$/,
      upright: /^protagonists\/[a-z]+-upright-three-quarter\.png$/,
      front: /^protagonists\/[a-z]+-upright\.png$/,
      jump: /^protagonists\/[a-z]+-jump\.png$/,
    }
    profiles.forEach(profile => expect(profile.layers.natal.at(-1)).toMatch(patterns[profile.characterPose]))
  })

  it('모든 명식에 월령 환경·일지 동물·보완 오행 레이어를 만든다', () => {
    const summerRooster = calculateSaju({
      calendar: 'solar', year: 1986, month: 5, day: 29,
      hour: 0, minute: 32, gender: 'male',
    })
    const summerProfile = getSajuVisualProfile(summerRooster)

    expect(summerProfile.kind).toBe('generic-layered')
    expect(summerProfile.layers).toMatchObject({
      basePath: 'generic-layers',
      natal: [
        'environments/summer.jpg',
        'effects/fire.png',
        'effects/water.png',
        'protagonists/rooster-upright.png',
      ],
      luck: [
        'environments/summer.jpg',
        'effects/fire.png',
        'effects/water.png',
        'effects/metal.png',
        'effects/wood.png',
        'protagonists/rooster-upright.png',
      ],
    })
    expect(summerProfile.characterTint).toBe(ELEMENTS.water.color)
    expect(summerProfile.protagonist.term).toContain('계유일주')
    expect(summerProfile.protagonist.term).toContain('수탉')
    expect(summerProfile.protagonist.visual).toContain('계수(水)')
    expect(summerProfile.overall).toMatch(/^당신은 빛이 짙어지는 초여름에 서 있는 물빛 수탉입니다\./)
    expect(summerProfile.overall).toContain('힘차게 자라는 나무를 함께')
    expect(summerProfile.characterPose).toBe('front')
    expect(summerProfile.characterFacing).toBe('front')
    expect(summerProfile.scene).toContain('물빛 수탉이 자기 자리를 지키고 있습니다')
    expect(summerProfile.environment.term).toContain('계사월')
    expect(summerProfile.neededFunction.term).toContain('금(金)')
    expect(summerProfile.support.term).toContain('목(木)')
    expect(summerProfile.tags).toHaveLength(5)
    expect(summerProfile.tags.join(' ')).not.toMatch(/일주|보완|[甲乙丙丁戊己庚辛壬癸]/)

    const winterHorse = calculateSaju({
      calendar: 'solar', year: 2000, month: 1, day: 1,
      hour: 12, minute: 32, gender: 'female',
    })
    const winterProfile = getSajuVisualProfile(winterHorse)
    expect(winterProfile.layers.natal).toEqual([
      'environments/winter.jpg',
      'effects/earth.png',
      'protagonists/horse-upright-three-quarter.png',
    ])
    expect(winterProfile.characterPose).toBe('upright')
    expect(winterProfile.characterFacing).toBe('right')
    expect(winterProfile.protagonist.term).toContain('말')
    expect(winterProfile.overall).toContain('따뜻하게 데우는 불을 먼저')
    expect(winterProfile.overall).toContain('힘차게 자라는 나무를 함께')
  })

  it('예시 명식을 원국 물상과 필요한 작용으로 분리한다', () => {
    const result = calculateSaju({
      calendar: 'solar', year: 1987, month: 1, day: 25,
      hour: 18, minute: 30, gender: 'male',
    })
    const profile = getSajuVisualProfile(result)

    expect(Object.values(result.pillars).map(pillar => pillar.ganZhi)).toEqual(['丙寅', '辛丑', '甲戌', '癸酉'])
    expect(profile.asset).toBe('personalized/1987-01-25-1830.jpg')
    expect(profile.natalAsset).toBe('personalized/1987-01-25-1830-natal.jpg')
    expect(profile.luckAsset).toBe('personalized/1987-01-25-1830-luck.jpg')
    expect(profile.layers).toEqual({
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
    })
    expect(profile.natalLabel).toBe('그림으로 만나는 나의 사주')
    expect(profile.luckLabel).toBe('나만의 개운 이미지')
    expect(profile.luckTitle).toBe('따뜻한 온기와 맑은 물을 받아 힘을 얻는 푸른 개')
    expect(profile.title).toBe('차가운 늦겨울, 따뜻한 빛과 맑은 물을 받는 푸른 개')
    expect(profile.tags).toEqual(['#큰나무처럼곧게', '#차가운늦겨울', '#겨울태양', '#맑은물', '#가까운온기'])
    expect(profile.readingLabel).toBe('그림으로 읽는 나의 사주')
    expect(profile.overall).toMatch(/^당신은 차가운 겨울 땅에 서 있는 푸른 개입니다\./)
    expect(profile.overall).not.toMatch(/물상|원국|월령|조후|생조|검수/)
    expect(profile.tags).toEqual(['#큰나무처럼곧게', '#차가운늦겨울', '#겨울태양', '#맑은물', '#가까운온기'])
    expect(profile.protagonist.title).toBe('큰 나무처럼 곧게 선 푸른 개')
    expect(profile.protagonist.body).toContain('이 푸른 개가 바로 당신입니다')
    expect(profile.protagonist.technicalTerm).toBe('갑술일주')
    expect(profile.protagonist.previewLayers).toEqual([
      'layer-01-environment-base.jpg',
      'layer-04-blue-dog-base.png',
    ])
    expect(profile.environment.title).toBe('차갑고 습한 늦겨울 땅')
    expect(profile.existingStrength.title).toBe('겨울에도 크게 빛나는 태양')
    expect(profile.neededFunction.title).toBe('멀리 비추는 빛보다 가까이 머무는 온기')
    expect(profile.support.title).toBe('얼지 않고 흐르는 맑은 물')
    for (const symbol of [profile.protagonist, profile.environment, profile.existingStrength, profile.support, profile.neededFunction]) {
      expect(symbol.body.length).toBeGreaterThan(30)
      expect(symbol.visualCue.length).toBeGreaterThan(20)
      expect(symbol.previewLayers.length).toBeGreaterThan(0)
      expect(symbol.alt.length).toBeGreaterThan(10)
    }
    expect(profile.flow).toContain('태양')
    expect(profile.flow).toContain('맑은 물')
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
    expect(result.luckCycles[0].reading.body).not.toMatch(/원국|일간|천간|지지|십이운성/)
    expect(result.luckCycles[0].annualYears[0].reading.summary).not.toMatch(/원국|일간|천간|지지|십이운성/)
    expect(result.luckCycles[0].annualYears[0].reading.areas.relationship).toContain('말로 확인')
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
