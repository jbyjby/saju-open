const ANIMALS = [
  ['rat', '쥐'], ['ox', '소'], ['tiger', '호랑이'], ['rabbit', '토끼'],
  ['dragon', '용'], ['snake', '뱀'], ['horse', '말'], ['goat', '양'],
  ['monkey', '원숭이'], ['rooster', '수탉'], ['dog', '개'], ['pig', '돼지'],
]

const POSE_LABELS = { side: '차분히 선', upright: '두 발로 비스듬히 선', front: '정면으로 당당히 선', jump: '힘차게 도약하는' }
const POSE_FACINGS = { side: 'right', upright: 'right', front: 'front', jump: 'left' }
const POSE_SUFFIXES = { side: '', upright: '-upright-three-quarter', front: '-upright', jump: '-jump' }
const FACING_LABELS = { right: '오른쪽을 보는', front: '정면을 보는', left: '왼쪽을 보는' }
const SEASONS = ['spring', 'summer', 'autumn', 'winter']
const SEASON_LABELS = { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' }
const ELEMENTS = [
  { key: 'wood', tint: '#4f9b78' },
  { key: 'fire', tint: '#ee765c' },
  { key: 'earth', tint: '#bd9256' },
  { key: 'metal', tint: '#aeb8c4' },
  { key: 'water', tint: '#5d89b4' },
]

function takeIndex(random, length) {
  const value = Number(random())
  return Math.min(length - 1, Math.max(0, Math.floor((Number.isFinite(value) ? value : 0) * length)))
}

export function pickHomeGallery(random = Math.random) {
  const pool = ANIMALS.map(([animal, label]) => ({ animal, label }))
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const target = takeIndex(random, index + 1)
    ;[pool[index], pool[target]] = [pool[target], pool[index]]
  }
  const rightPose = ['side', 'upright'][takeIndex(random, 2)]
  const poses = [rightPose, 'front', 'jump']
  for (let index = poses.length - 1; index > 0; index -= 1) {
    const target = takeIndex(random, index + 1)
    ;[poses[index], poses[target]] = [poses[target], poses[index]]
  }
  return pool.slice(0, 3).map((entry, index) => {
    const pose = poses[index]
    const facing = POSE_FACINGS[pose]
    const season = SEASONS[(takeIndex(random, SEASONS.length) + index) % SEASONS.length]
    const element = ELEMENTS[(takeIndex(random, ELEMENTS.length) + index) % ELEMENTS.length]
    const suffix = POSE_SUFFIXES[pose]
    return {
      ...entry,
      pose,
      facing,
      season,
      element: element.key,
      tint: element.tint,
      alt: `${SEASON_LABELS[season]} 풍경에서 ${FACING_LABELS[facing]} ${POSE_LABELS[pose]} ${entry.label} 배경화면`,
      layers: [
        `environments/${season}.jpg`,
        `effects/${element.key}.png`,
        `protagonists/${entry.animal}${suffix}.png`,
      ],
    }
  })
}
