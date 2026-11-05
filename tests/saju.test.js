import { describe, expect, it } from 'vitest'
import {
  calculateSaju,
  directDayGanZhi,
  directTimeGanZhi,
  convertLunarToSolar,
  getElementBalance,
  getTenGod,
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
})
