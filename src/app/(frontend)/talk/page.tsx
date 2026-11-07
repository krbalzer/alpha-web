import type { Metadata } from 'next'
import TalkView from './TalkView'

export const metadata: Metadata = { title: "Let's talk" }

export default function Page() {
  return <TalkView />
}
