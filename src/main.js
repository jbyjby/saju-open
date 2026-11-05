import { calculateSaju, ELEMENTS } from './saju.js'

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
    <dl><div><dt>십신</dt><dd>${pillar.tenGod}</dd></div><div><dt>오행</dt><dd>${pillar.wuXing}</dd></div><div><dt>납음</dt><dd>${pillar.naYin}</dd></div></dl>
  </article>`
}

const fortuneAreaLabels = {
  career: '직업·일', wealth: '재물·계약', spouse: '배우자·연애', relationship: '관계·변화', wellbeing: '생활 리듬',
}

function fortuneAreaCards(areas) {
  return Object.entries(areas).map(([key, body]) => `<article><h5>${fortuneAreaLabels[key]}</h5><p>${body}</p></article>`).join('')
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
    const cycleButton = event.target.closest('[data-cycle]')
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
  const deepReadings = Object.entries(data.interpretation.readings).map(([key, reading], index) => `
    <article class="deep-reading ${key === 'overall' ? 'featured' : ''}">
      <div class="deep-reading-label"><span>${String(index + 1).padStart(2, '0')}</span><p>${readingLabels[key][0]}<small>${readingLabels[key][1]}</small></p></div>
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
    <div class="pillars" data-testid="pillars">${pillars}</div>
    <section class="interpretation" data-testid="interpretation" aria-labelledby="interpretation-title">
      <header class="interpretation-head">
        <p>명식을 삶의 언어로 풀어보기</p>
        <h2 id="interpretation-title">사주 해석</h2>
        <p>${data.interpretation.note}</p>
      </header>
      <div class="deep-readings">${deepReadings}</div>
    </section>
    <div class="reading-basis"><p>풀이의 근거</p><h2>오행과 일간</h2></div>
    <div class="reading-grid">
      <article class="reading-card day-master">
        <p>나를 나타내는 일간</p>
        <h3>${data.interpretation.dayMaster.stem} · ${data.interpretation.dayMaster.image}</h3>
        <p>${data.interpretation.dayMaster.summary}이 중심에 놓여 있습니다. 이는 타고난 성향을 살펴보는 하나의 관점이지 성격을 고정하는 진단은 아닙니다.</p>
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
    <p class="interpretation-note">${data.interpretation.note}</p>
    <section class="luck-explorer" data-luck-explorer data-testid="luck-explorer" aria-labelledby="luck-title">
      <header class="luck-explorer-head"><p>10년과 1년의 흐름</p><h2 id="luck-title">대운·세운 상세 풀이</h2><span>대운을 고른 뒤 세운을 누르면 해당 연도의 직업·재물·배우자·관계·생활 흐름을 볼 수 있습니다.</span></header>
      <div class="cycle-tabs" role="tablist" aria-label="대운 선택">${cycleTabs}</div>
      <div data-cycle-panel></div>
    </section>
    <div class="calculation-receipt">
      <h3>이번 계산의 영수증</h3>
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
