import { guide as shadedTrails } from './best-shaded-trails-san-antonio-summer'
import { guide as dogFriendly } from './dog-friendly-parks-san-antonio'
import { guide as stateparks } from './best-state-parks-near-san-antonio'
import { guide as beginner } from './beginner-guide-san-antonio-trails'
import { guide as kayaking } from './kayaking-san-antonio-hill-country'

export const guides = [shadedTrails, dogFriendly, stateparks, beginner, kayaking]

export function getGuide(slug) {
  return guides.find(g => g.slug === slug) || null
}
