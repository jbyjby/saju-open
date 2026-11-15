import { describe, expect, it } from 'vitest'
import { pickHomeGallery } from '../src/home-gallery.js'

describe('홈 랜덤 배경화면', () => {
  it('서로 다른 동물 세 마리와 유효한 포즈를 고른다', () => {
    const choices = pickHomeGallery(() => 0.25)
    expect(choices).toHaveLength(3)
    expect(new Set(choices.map(choice => choice.animal)).size).toBe(3)
    const poses = choices.map(choice => choice.pose)
    expect(poses).toContain('front')
    expect(poses).toContain('jump')
    expect(poses.filter(pose => ['side', 'upright'].includes(pose))).toHaveLength(1)
    expect(new Set(choices.map(choice => choice.facing))).toEqual(new Set(['right', 'front', 'left']))
    const suffixes = { side: '', upright: '-upright-three-quarter', front: '-upright', jump: '-jump' }
    for (const choice of choices) {
      expect(choice.layers.at(-1)).toBe(`protagonists/${choice.animal}${suffixes[choice.pose]}.png`)
      expect(choice.facing).toBe({ side: 'right', upright: 'right', front: 'front', jump: 'left' }[choice.pose])
    }
  })

  it('난수 흐름이 달라지면 홈 조합도 달라진다', () => {
    const low = pickHomeGallery(() => 0.05).map(choice => `${choice.animal}-${choice.pose}`)
    const high = pickHomeGallery(() => 0.95).map(choice => `${choice.animal}-${choice.pose}`)
    expect(high).not.toEqual(low)
    const rightPoses = [low, high].map(items => items.find(item => item.endsWith('-side') || item.endsWith('-upright'))?.split('-').at(-1))
    expect(new Set(rightPoses)).toEqual(new Set(['side', 'upright']))
  })
})
