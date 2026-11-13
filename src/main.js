import { calculateSaju, ELEMENTS, getLuckImageGuidance, getSajuVisualProfile } from './saju.js'

const form = document.querySelector('#birth-form')
const result = document.querySelector('#result')
const errorBox = document.querySelector('#form-error')
const monthSelect = document.querySelector('#month')
const daySelect = document.querySelector('#day')
const hourSelect = document.querySelector('#hour')
const minuteSelect = document.querySelector('#minute')
const unknownTime = document.querySelector('#unknown-time')
const leapOption = document.querySelector('#leap-option')

function options(select, from, to, selected, pad = false) {
  select.innerHTML = Array.from({ length: to - from + 1 }, (_, index) => {
    const value = index + from
    return `<option value="${value}" ${value === selected ? 'selected' : ''}>${pad ? String(value).padStart(2, '0') : value}</option>`
  }).join('')
}

options(monthSelect, 1, 12, 1)
options(daySelect, 1, 31, 1)
options(hourSelect, 0, 23, 12, true)
options(minuteSelect, 0, 59, 0, true)

function syncDays() {
  const year = Number(form.year.value)
  const month = Number(monthSelect.value)
  const previous = Number(daySelect.value) || 1
  const calendar = new FormData(form).get('calendar')
  const max = calendar === 'lunar' ? 30 : new Date(Date.UTC(year, month, 0)).getUTCDate()
  options(daySelect, 1, max, Math.min(previous, max))
}

form.year.addEventListener('input', syncDays)
monthSelect.addEventListener('change', syncDays)
form.addEventListener('change', event => {
  if (event.target.name === 'calendar') {
    leapOption.hidden = event.target.value !== 'lunar'
    syncDays()
  }
})
unknownTime.addEventListener('change', () => {
  hourSelect.disabled = unknownTime.checked
  minuteSelect.disabled = unknownTime.checked
})

function elementLabel(key) {
  const item = ELEMENTS[key]
  return `${item.ko}<small>${item.hanja}</small>`
}

function pillarCard(pillar, key) {
  const stemElement = Object.keys(ELEMENTS).find(name => ELEMENTS[name].hanja === pillar.wuXing[0])
  const branchElement = Object.keys(ELEMENTS).find(name => ELEMENTS[name].hanja === pillar.wuXing[1])
  return `<article class="pillar">
    <p>${pillar.label}</p>
    <div class="characters"><b class="element-${stemElement}">${pillar.stem}</b><b class="element-${branchElement}">${pillar.branch}</b></div>
    <dl><div><dt>십신</dt><dd>${pillar.tenGod}</dd></div><div><dt>오행</dt><dd>${pillar.wuXing}</dd></div><div><dt>십이운성</dt><dd>${pillar.twelveStage}</dd></div><div><dt>납음</dt><dd>${pillar.naYin}</dd></div></dl>
  </article>`
}

const fortuneAreaLabels = {
  career: '직업·일', wealth: '재물·계약', spouse: '배우자·연애', relationship: '관계·변화', wellbeing: '생활 리듬',
}

function fortuneAreaCards(areas) {
  return Object.entries(areas).map(([key, body]) => `<article><h5>${fortuneAreaLabels[key]}</h5><p>${body}</p></article>`).join('')
}

function fortuneEvidence(evidence) {
  const relations = [...evidence.stemRelations, ...evidence.branchRelations]
  const items = relations.length
    ? relations.map(item => `<li><b>${item.type}</b><span>${item.members.join('·')} · ${item.labels.join(' ↔ ')}${item.result ? ` · ${item.result} 기운 가능성` : ''}</span></li>`).join('')
    : '<li><b>직접 관계</b><span>이번 운과 비교 대상 사이에 판정된 합·충·형·해·파가 없습니다.</span></li>'
  return `<section class="fortune-evidence">
    <div><p>판정 근거</p><h5>십이운성 ${evidence.twelveStage}</h5><span class="stage-meaning">${evidence.twelveStageMeaning}</span></div>
    <ul>${items}</ul>
    <p class="evidence-note">합·삼합·방합은 관계 신호만 표시합니다. 계절·세력·투간 등 합화 조건을 별도로 충족하지 않으면 특정 오행으로 변했다고 단정하지 않습니다.</p>
  </section>`
}

function natalEvidence(evidence) {
  const relations = [...evidence.stemRelations, ...evidence.branchRelations]
  const items = relations.length
    ? relations.map(item => `<li><b>${item.type}</b><span>${item.members.join('·')} · ${item.labels.join(' ↔ ')}${item.result ? ` · ${item.result} 기운 가능성` : ''}</span></li>`).join('')
    : '<li><b>직접 관계</b><span>원국 네 기둥 사이에 판정된 합·충·형·해·파가 없습니다.</span></li>'
  return `<details class="natal-evidence" data-testid="natal-evidence">
    <summary><span>원국 관계 근거</span><small>합·충·형·해·파 판정 보기</small></summary>
    <div class="natal-evidence-body"><ul>${items}</ul><p>여러 관계가 함께 성립할 수 있으며, 합은 합화 확정으로 보지 않습니다. 위치와 계절, 세력 조건을 함께 살펴야 합니다.</p></div>
  </details>`
}

function renderAnnualDetail(explorer, annual) {
  explorer.querySelectorAll('[data-annual]').forEach(button => {
    const selected = Number(button.dataset.annual) === annual.year
    button.classList.toggle('active', selected)
    button.setAttribute('aria-selected', String(selected))
  })
  explorer.querySelector('[data-testid="annual-detail"]').innerHTML = `
    <div class="annual-head"><p>${annual.age}세 · ${annual.ganZhi} 세운</p><h4>${annual.reading.title}</h4></div>
    <p class="annual-summary">${annual.reading.summary}</p>
    <div class="fortune-signals">${annual.reading.signals.map(signal => `<span>${signal}</span>`).join('')}</div>
    ${fortuneEvidence(annual.reading.evidence)}
    <div class="fortune-areas annual-areas">${fortuneAreaCards(annual.reading.areas)}</div>`
}

function renderCycleDetail(explorer, data, cycleIndex) {
  const cycle = data.luckCycles[cycleIndex]
  explorer.dataset.cycle = String(cycleIndex)
  explorer.querySelectorAll('[data-cycle]').forEach(button => {
    const selected = Number(button.dataset.cycle) === cycleIndex
    button.classList.toggle('active', selected)
    button.setAttribute('aria-selected', String(selected))
  })
  explorer.querySelector('[data-cycle-panel]').innerHTML = `
    <article class="cycle-detail" data-testid="cycle-detail">
      <header><p>${cycle.startAge}–${cycle.endAge}세 · ${cycle.startYear}–${cycle.endYear}</p><h3>${cycle.ganZhi} 대운 · ${cycle.reading.title}</h3></header>
      <p class="cycle-body">${cycle.reading.body}</p>
      <div class="fortune-signals">${cycle.reading.signals.map(signal => `<span>${signal}</span>`).join('')}</div>
      ${fortuneEvidence(cycle.reading.evidence)}
      <div class="fortune-areas">${fortuneAreaCards(cycle.reading.areas)}</div>
      <div class="annual-section">
        <div class="annual-title"><p>해마다 달라지는 흐름</p><h4>세운을 선택하세요</h4></div>
        <div class="annual-tabs" role="tablist" aria-label="세운 선택">${cycle.annualYears.map(annual => `<button type="button" role="tab" data-annual="${annual.year}" aria-label="${annual.year}년 ${annual.ganZhi} 세운"><b>${annual.year}</b><span>${annual.ganZhi}</span><small>${annual.age}세</small></button>`).join('')}</div>
        <div class="annual-detail" data-testid="annual-detail"></div>
      </div>
    </article>`
  const currentYear = new Date().getFullYear()
  const initialAnnual = cycle.annualYears.find(annual => annual.year === currentYear) || cycle.annualYears[0]
  renderAnnualDetail(explorer, initialAnnual)
}

function setupLuckExplorer(data) {
  const explorer = result.querySelector('[data-luck-explorer]')
  const currentYear = new Date().getFullYear()
  const initialCycle = Math.max(0, data.luckCycles.findIndex(cycle => currentYear >= cycle.startYear && currentYear <= cycle.endYear))
  explorer.addEventListener('click', event => {
    const cycleButton = event.target.closest('button[data-cycle]')
    if (cycleButton) {
      renderCycleDetail(explorer, data, Number(cycleButton.dataset.cycle))
      return
    }
    const annualButton = event.target.closest('[data-annual]')
    if (annualButton) {
      const cycle = data.luckCycles[Number(explorer.dataset.cycle)]
      const annual = cycle.annualYears.find(item => item.year === Number(annualButton.dataset.annual))
      renderAnnualDetail(explorer, annual)
    }
  })
  renderCycleDetail(explorer, data, initialCycle)
}

function strategyItem(item, role, description) {
  if (!item) return ''
  return `<article class="strategy-item strategy-${role}">
    <span>${description}</span>
    <h3 class="element-${item.element}">${item.label}</h3>
    <p>${item.reason}</p>
  </article>`
}

function imagePresentation(data) {
  const profile = getSajuVisualProfile(data)
  const guidance = getLuckImageGuidance(data.seasonalHarmony, data.balanceStrategy)
  return {
    profile,
    guidance,
    imageUrl: profile
      ? `${import.meta.env.BASE_URL}luck-images/${profile.natalAsset}`
      : `${import.meta.env.BASE_URL}luck-images/${guidance.neededElement}.jpg`,
    luckImageUrl: profile
      ? `${import.meta.env.BASE_URL}luck-images/${profile.luckAsset}`
      : null,
  }
}

function layeredCanvas(profile, variant, fallbackUrl, alt) {
  const count = profile.layers[variant].length
  return `<canvas class="layered-wallpaper" width="1536" height="2752" role="img" aria-label="${alt}" data-layered-canvas="${variant}" data-layer-count="${count}" data-layer-ready="false"></canvas>
    <img class="layered-fallback" src="${fallbackUrl}" alt="${alt}" hidden />`
}

function luckHeroView(data, overall) {
  const strategy = data.balanceStrategy
  const { profile, guidance, imageUrl } = imagePresentation(data)
  const imageAlt = profile
    ? `원국 물상 이미지 — ${profile.title}`
    : `계절 균형 이미지 — ${strategy.priority.label}을 중심으로 ${strategy.support.label}을 함께 담은 휴대폰 배경`
  const visual = profile?.layers
    ? layeredCanvas(profile, 'natal', imageUrl, imageAlt)
    : `<img src="${imageUrl}" alt="${imageAlt}" />`
  const saveButton = profile ? '' : '<button class="save-wallpaper" type="button" data-download-wallpaper><span>휴대폰에 이미지 저장</span><b aria-hidden="true">↓</b></button>'
  return `<section class="luck-hero" data-testid="luck-hero" aria-labelledby="luck-hero-title">
    <figure class="luck-visual">
      ${visual}
      <div class="image-badge"><span>${profile ? '검수된 레이어 합성 원국' : '검수된 기본형 배경화면'}</span><b>${profile ? '환경 + 태양 + 물 + 갑술 주인공' : `${strategy.priority.label} × ${strategy.support.label}`}</b></div>
    </figure>
    <div class="luck-hero-copy" data-testid="overall-reading">
      <p class="product-kicker">${profile ? `01 · ${profile.natalLabel}` : '총운에서 고른 개운 이미지'}</p>
      <h2 id="luck-hero-title">${profile?.title || overall.title}</h2>
      ${profile ? `<div class="visual-tags" aria-label="핵심 해시태그">${profile.tags.map(tag => `<span>${tag}</span>`).join('')}</div>` : ''}
      <p class="hero-overall is-collapsed"><b>${profile?.readingLabel || '먼저 읽는 총운'}</b><span>${profile?.overall || overall.body}</span></p>
      <button class="overall-toggle" type="button" aria-expanded="false">총운 전체 읽기</button>
      <div class="strategy-chips" aria-label="보완 전략">
        <span><small>우선 보완</small>${strategy.priority.label}</span>
        <span><small>함께 보완</small>${strategy.support.label}</span>
      </div>
      <div class="hero-reason"><h3>왜 이 장면인가요?</h3><p>${profile?.scene || guidance.whyNeeded}</p></div>
      ${saveButton}
      <p class="image-disclaimer">이미지는 필요한 태도를 떠올리는 배경화면입니다. 저장만으로 운의 변화나 특정 결과를 보장하지 않습니다.</p>
    </div>
  </section>`
}

function visualStoryView(data) {
  const profile = getSajuVisualProfile(data)
  if (!profile) return ''
  const symbols = [profile.protagonist, profile.environment, profile.existingStrength, profile.neededFunction, profile.support]
  return `<section class="visual-story" data-testid="visual-story" aria-labelledby="visual-story-title">
    <header>
      <p>이미지 속 물상을 하나씩 풀어봅니다</p>
      <h2 id="visual-story-title">그림으로 읽는 내 사주</h2>
      <span>전문 용어는 처음 나올 때 쉬운 물상을 괄호 안에 함께 적었습니다.</span>
    </header>
    <div class="visual-story-grid">
      ${symbols.map((symbol, index) => `<article><span>0${index + 1} · ${symbol.label}</span><h3>${symbol.term}</h3><p>${symbol.visual}</p></article>`).join('')}
    </div>
    <div class="visual-flow"><span>그림 속 생조 흐름</span><b>${profile.flow}</b><p>${profile.disclaimer}</p></div>
  </section>`
}

function seasonalHarmonyView(harmony, strategy) {
  const guidance = getLuckImageGuidance(harmony, strategy)
  const conditional = strategy.conditional.map(item => `<li><b class="element-${item.element}">${item.label}</b><span>${item.reason}</span></li>`).join('')
  const caution = strategy.caution.map(item => `<li><b class="element-${item.element}">${item.label}</b><span>${item.reason}</span></li>`).join('')
  return `<section class="seasonal-harmony" data-testid="seasonal-harmony" aria-labelledby="seasonal-harmony-title">
    <header class="strategy-head">
      <p>월령표를 명식 전체로 다시 검토했습니다</p>
      <h2 id="seasonal-harmony-title">이 사주에 이 이미지가 필요한 이유</h2>
      <span>${strategy.summary}</span>
    </header>
    <div class="strategy-grid">
      ${strategyItem(strategy.priority, 'priority', '우선 보완')}
      ${strategyItem(strategy.support, 'support', '함께 보완')}
    </div>
    <div class="strategy-secondary">
      <section><p>조건부 활용</p><ul>${conditional || '<li><span>별도로 앞세울 조건부 기운이 없습니다.</span></li>'}</ul></section>
      <section><p>과용 주의</p><ul>${caution || '<li><span>현재 규칙에서 특별히 과용을 경계할 기운이 없습니다.</span></li>'}</ul></section>
    </div>
    <div class="practice-panel">
      <div><p>이미지를 생활에서 쓰는 법</p><h3>화면을 볼 때마다 이 세 가지를 떠올리세요</h3><span>${guidance.definition}</span></div>
      <div><ol>${guidance.practice.map((item, index) => `<li><span>0${index + 1}</span>${item}</li>`).join('')}</ol><p class="save-reason">${guidance.saveReason}</p></div>
    </div>
  </section>`
}

function finalLuckImageView(data) {
  const { profile, luckImageUrl } = imagePresentation(data)
  if (!profile?.layers) return ''
  const imageAlt = `개운 이미지 — ${profile.luckTitle}`
  return `<section class="final-luck-image" data-testid="final-luck-image" aria-labelledby="final-luck-title">
    <div class="final-luck-copy">
      <p class="product-kicker">12 · ${profile.luckLabel}</p>
      <h2 id="final-luck-title">${profile.luckTitle}</h2>
      <p>${profile.disclaimer}</p>
      <div class="layer-formula" aria-label="개운 이미지 레이어 구성">
        <span>신축월 겨울 환경</span><i>+</i><span>병인 태양</span><i>+</i><span>계유 물</span><i>+</i><span>정화 온기</span><i>+</i><span>물을 받는 갑술 주인공</span>
      </div>
      <button class="save-wallpaper" type="button" data-download-wallpaper disabled><span>휴대폰에 이미지 저장</span><b aria-hidden="true">↓</b></button>
      <p class="image-disclaimer">이 이미지는 행운을 보장하는 부적이 아니라, 필요한 방향을 떠올리게 하는 상징적 배경화면입니다.</p>
    </div>
    <figure class="luck-visual final-luck-visual">
      ${layeredCanvas(profile, 'luck', luckImageUrl, imageAlt)}
      <div class="image-badge"><span>검수된 레이어 합성 개운본</span><b>같은 주인공의 변화 이후 장면</b></div>
    </figure>
  </section>`
}

function layerUrl(profile, file) {
  return `${import.meta.env.BASE_URL}luck-images/${profile.layers.basePath}/${file}`
}

function loadLayer(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`레이어를 불러오지 못했습니다: ${url}`))
    image.src = url
  })
}

async function drawLayerStack(canvas, profile, variant) {
  const images = await Promise.all(profile.layers[variant].map(file => loadLayer(layerUrl(profile, file))))
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  images.forEach(image => context.drawImage(image, 0, 0, canvas.width, canvas.height))
  canvas.dataset.layerReady = 'true'
}

async function setupLayeredCanvases(data) {
  const profile = getSajuVisualProfile(data)
  if (!profile?.layers) return
  const canvases = [...result.querySelectorAll('[data-layered-canvas]')]
  await Promise.all(canvases.map(async canvas => {
    try {
      await drawLayerStack(canvas, profile, canvas.dataset.layeredCanvas)
    } catch (error) {
      canvas.dataset.layerReady = 'error'
      canvas.hidden = true
      const fallback = canvas.nextElementSibling
      if (fallback?.classList.contains('layered-fallback')) fallback.hidden = false
      console.error(error)
    }
  }))
  const button = result.querySelector('[data-download-wallpaper]')
  if (button) button.disabled = false
}

async function downloadWallpaper(imageUrl, harmony) {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error('이미지를 불러오지 못했습니다.')
  const targetUrl = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = targetUrl
  link.download = `sai-seasonal-balance-${harmony.dayStem}-${harmony.monthBranch}.jpg`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(targetUrl), 1000)
}

async function downloadCanvas(canvas, harmony) {
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(value => value ? resolve(value) : reject(new Error('이미지를 저장할 수 없습니다.')), 'image/jpeg', 0.94)
  })
  const targetUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = targetUrl
  link.download = `sai-personal-luck-${harmony.dayStem}-${harmony.monthBranch}.jpg`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(targetUrl), 1000)
}

function setupWallpaper(data) {
  const button = result.querySelector('[data-download-wallpaper]')
  if (!button) return
  const { profile, imageUrl, luckImageUrl } = imagePresentation(data)
  button.addEventListener('click', async () => {
    button.disabled = true
    button.textContent = '저장하는 중…'
    try {
      const canvas = result.querySelector('canvas[data-layered-canvas="luck"]')
      if (profile?.layers && canvas?.dataset.layerReady === 'true') {
        await downloadCanvas(canvas, data.seasonalHarmony)
      } else {
        await downloadWallpaper(profile ? luckImageUrl : imageUrl, data.seasonalHarmony)
      }
      button.textContent = '저장 완료'
    } catch (error) {
      button.textContent = error.message
    } finally {
      window.setTimeout(() => {
        button.disabled = false
        button.innerHTML = '<span>휴대폰에 이미지 저장</span><b aria-hidden="true">↓</b>'
      }, 1500)
    }
  })
}

function setupOverallToggle() {
  const button = result.querySelector('.overall-toggle')
  const copy = result.querySelector('.hero-overall')
  if (!button || !copy) return
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!expanded))
    button.textContent = expanded ? '총운 전체 읽기' : '총운 접기'
    copy.classList.toggle('is-collapsed', expanded)
  })
}

function renderResult(data, timeUnknown) {
  const pillars = Object.entries(data.pillars).map(([key, value]) => pillarCard(value, key)).join('')
  const balance = Object.entries(data.balance).map(([key, count]) => `<div class="balance-item"><div class="balance-label"><span>${elementLabel(key)}</span><b>${count}</b></div><div class="bar"><i class="element-bg-${key}" style="width:${count * 12.5}%"></i></div></div>`).join('')
  const missing = data.interpretation.missing.length
    ? data.interpretation.missing.map(item => `${ELEMENTS[item.key].ko}(${ELEMENTS[item.key].hanja})`).join(', ')
    : '없음'
  const cycleTabs = data.luckCycles.map((cycle, index) => `<button type="button" role="tab" data-cycle="${index}" aria-label="${cycle.ganZhi} 대운 ${cycle.startYear}년부터 ${cycle.endYear}년"><b>${cycle.ganZhi}</b><span>${cycle.startYear}–${cycle.endYear}</span><small>${cycle.startAge}–${cycle.endAge}세</small></button>`).join('')
  const readingLabels = {
    overall: ['전체 흐름', '總運'], personality: ['성향과 강점', '性向'], career: ['직업과 일', '職業'],
    wealth: ['재물과 관리', '財物'], spouse: ['배우자와 결혼', '配偶'], family: ['가족과 원가족', '家族'],
    children: ['자녀와 후배', '子女'], study: ['학업과 자격', '學業'],
    relationship: ['관계와 소통', '關係'], wellbeing: ['생활 리듬', '健康'],
  }
  const overall = data.interpretation.readings.overall
  const deepReadings = Object.entries(data.interpretation.readings).filter(([key]) => key !== 'overall').map(([key, reading], index) => `
    <article class="deep-reading">
      <div class="deep-reading-label"><span>${String(index + 2).padStart(2, '0')}</span><p>${readingLabels[key][0]}<small>${readingLabels[key][1]}</small></p></div>
      <div class="deep-reading-copy"><h3>${reading.title}</h3><p>${reading.body}</p><ul>${reading.points.map(point => `<li>${point}</li>`).join('')}</ul></div>
    </article>`).join('')
  const corrected = data.corrected
  const solar = data.solarDate
  result.innerHTML = `
    <div class="result-head">
      <p>당신의 네 기둥</p>
      <h2><span>${data.pillars.day.stem}</span> 일간의 명식입니다</h2>
      <div class="result-meta"><span>양력 ${solar.year}.${solar.month}.${solar.day}</span><span>평균태양시 ${String(corrected.hour).padStart(2, '0')}:${String(corrected.minute).padStart(2, '0')}</span><span>${data.timeZone.zone}</span></div>
      ${timeUnknown ? '<p class="time-warning">태어난 시간을 몰라 낮 12시로 임시 계산했습니다. 시주와 대운 시작 시점은 달라질 수 있습니다.</p>' : ''}
    </div>
    ${luckHeroView(data, overall)}
    ${visualStoryView(data)}
    <div class="compact-section-head"><p>이미지를 고른 명식</p><h2>네 기둥 한눈에 보기</h2></div>
    <div class="pillars" data-testid="pillars">${pillars}</div>
    ${seasonalHarmonyView(data.seasonalHarmony, data.balanceStrategy)}
    <section class="interpretation" data-testid="interpretation" aria-labelledby="interpretation-title">
      <header class="interpretation-head">
        <p>총운 다음에 분야별로 살펴봅니다</p>
        <h2 id="interpretation-title">삶의 여러 장면</h2>
        <p>${data.interpretation.note}</p>
      </header>
      <div class="deep-readings">${deepReadings}</div>
    </section>
    <div class="reading-basis"><p>왜 이렇게 풀이했는지 살펴봅니다</p><h2>오행과 일간</h2></div>
    <div class="reading-grid">
      <article class="reading-card day-master">
        <p>나를 나타내는 일간</p>
        <h3>${data.interpretation.dayMaster.stem} · ${data.interpretation.dayMaster.image}</h3>
        <p>이 사주의 바탕에는 ${data.interpretation.dayMaster.summary}이 있습니다. 다만 일간 하나만으로 성격 전체를 정할 수는 없습니다.</p>
      </article>
      <article class="reading-card">
        <p>오행의 표면 분포</p>
        <div class="balance">${balance}</div>
        <p class="balance-note">없는 오행: <b>${missing}</b></p>
      </article>
      <article class="reading-card dominant">
        <p>두드러진 흐름</p>
        <h3>${ELEMENTS[data.interpretation.dominant.key].ko}(${ELEMENTS[data.interpretation.dominant.key].hanja}) · ${data.interpretation.dominant.strength}</h3>
        <p>연결해 볼 분야: ${data.interpretation.dominant.work.join(' · ')}</p>
        <p>${data.interpretation.dominant.caution}</p>
      </article>
    </div>
    ${natalEvidence(data.evidence)}
    <p class="interpretation-note">${data.interpretation.note}</p>
    <section class="luck-explorer" data-luck-explorer data-testid="luck-explorer" aria-labelledby="luck-title">
      <header class="luck-explorer-head"><p>10년과 1년의 흐름</p><h2 id="luck-title">대운·세운 상세 풀이</h2><span>대운을 고른 뒤 세운을 누르면 해당 연도의 직업·재물·배우자·관계·생활 흐름을 볼 수 있습니다.</span></header>
      <div class="cycle-tabs" role="tablist" aria-label="대운 선택">${cycleTabs}</div>
      <div data-cycle-panel></div>
    </section>
    ${finalLuckImageView(data)}
    <div class="calculation-receipt">
      <h3>계산에 사용한 기준</h3>
      <dl>
        <div><dt>입력 달력</dt><dd>${data.entered.calendar === 'solar' ? '양력' : `음력${data.entered.isLeapMonth ? ' 윤달' : ''}`}</dd></div>
        <div><dt>양력 변환</dt><dd>${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}</dd></div>
        <div><dt>서울 평균태양시</dt><dd>입력 시각 −32분 → ${corrected.year}-${String(corrected.month).padStart(2, '0')}-${String(corrected.day).padStart(2, '0')} ${String(corrected.hour).padStart(2, '0')}:${String(corrected.minute).padStart(2, '0')}</dd></div>
        <div><dt>IANA 시간대 확인</dt><dd>${data.timeZone.zone} · Asia/Seoul</dd></div>
        <div><dt>계산 라이브러리</dt><dd>lunar-javascript 1.7.7</dd></div>
      </dl>
    </div>`
  result.hidden = false
  setupLuckExplorer(data)
  setupWallpaper(data)
  setupLayeredCanvases(data)
  setupOverallToggle()
  result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}

form.addEventListener('submit', event => {
  event.preventDefault()
  errorBox.textContent = ''
  if (!document.querySelector('#consent').checked) {
    errorBox.textContent = '브라우저 안에서 계산하는 것에 동의해 주세요.'
    return
  }
  const values = new FormData(form)
  try {
    const data = calculateSaju({
      calendar: values.get('calendar'), gender: values.get('gender'),
      year: Number(values.get('year')), month: Number(values.get('month')), day: Number(values.get('day')),
      hour: unknownTime.checked ? 12 : Number(values.get('hour')),
      minute: unknownTime.checked ? 0 : Number(values.get('minute')),
      isLeapMonth: values.get('isLeapMonth') === 'on',
    })
    renderResult(data, unknownTime.checked)
  } catch (error) {
    errorBox.textContent = `계산할 수 없습니다. ${error.message}`
  }
})
