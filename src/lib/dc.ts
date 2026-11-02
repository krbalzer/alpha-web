'use client'
import { useEffect, useReducer, useRef } from 'react'

/**
 * Runs a design-board logic class (componentDidMount / setState / renderVals) inside React.
 * Lets the canvas prototypes port with their logic untouched; refactor into hooks when a template settles.
 */
export class DCLogic<P = any, S = any> {
  props!: P
  state: S = {} as S
  _force?: () => void
  setState(o: Partial<S> | ((s: S) => Partial<S>)) {
    this.state = { ...this.state, ...(typeof o === 'function' ? o(this.state) : o) }
    this._force?.()
  }
  componentDidMount?(): void
  componentWillUnmount?(): void
  renderVals(): any { return {} }
}

export function useDC<P>(Cls: new () => DCLogic<P>, props: P) {
  const [, force] = useReducer((x: number) => x + 1, 0)
  const ref = useRef<DCLogic<P> | null>(null)
  if (!ref.current) { ref.current = new Cls(); ref.current.props = props }
  const c = ref.current as any
  c.props = props
  c._force = force
  useEffect(() => {
    c.componentDidMount?.()
    return () => {
      c.componentWillUnmount?.()
      // reset so a remount (Strict Mode, fast refresh) can restart loops and observers
      c.raf = null; c.cv = null; c.io = null; c.started = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return c.renderVals()
}
