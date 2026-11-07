import { Closer } from '@/components/site/Closer'
import { getHome } from '@/lib/pages'
import MainView from './_home/MainView'

export const revalidate = 300

export default async function Home() {
  return (
    <>
      <MainView data={await getHome()} />
      <Closer />
    </>
  )
}
