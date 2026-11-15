import { describe, expect, it } from 'vitest'
import { pickHomeGallery } from '../src/home-gallery.js'

describe('홈 랜덤 배경화면', () => {
  it('서로 다른 동물 세 마리와 유효한 포즈를 고른다', () => {
    const choices = pickHomeGallery(() => 0.25)
    expect(choices).toHaveLength(3)
    expect(new Set(choices.map(choice => choice.animal)).size).toBe(3)
    expect(choices.every(choice => ['side', 'upright', 'jump'].includes(choice.pose))).toBe(true)
    for (const choice of choices) {
      const suffix = choice.pose === 'side' ? '' : `-${choice.pose}`
      expect(choice.layers.at(-1)).toBe(`protagonists/${choice.animal}${suffix}.png`)
    }
  })

  it('난수 흐름이 달라지면 홈 조합도 달라진다', () => {
    const low = pickHomeGallery(() => 0.05).map(choice => `${choice.animal}-${choice.pose}`)
    const high = pickHomeGallery(() => 0.95).map(choice => `${choice.animal}-${choice.pose}`)
    expect(high).not.toEqual(low)
  })
})
