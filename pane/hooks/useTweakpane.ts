import { MutableRefObject, useEffect, useLayoutEffect, useRef } from 'react'
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

// This one is copied from tweakpane to avoid dist dependency
interface PaneConfig {
  /**
   * The custom container element of the pane.
   */
  container?: HTMLElement
  /**
   * The default expansion of the pane.
   */
  expanded?: boolean
  /**
   * The pane title that can expand/collapse the entire pane.
   */
  title?: string
  /**
   * @hidden
   */
  document?: Document
}

export interface PaneInstance<T extends object> {
  instance: Pane | null
  params: T
}

export function useTweakpane<T extends object>(
  params: T = {} as T,
  paneConfig: PaneConfig = {}
  // plugin: T
): MutableRefObject<PaneInstance<T>> {
  const paneRef = useRef<PaneInstance<T>>({
    instance: null,
    params: params,
  })

  useEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    pane.title = paneConfig.title
    pane.expanded = paneConfig.expanded ?? true
    pane.refresh()
  }, [paneConfig.expanded, paneConfig.title])

  useLayoutEffect(() => {
    const pane = new Pane(paneConfig)
    pane.registerPlugin(EssentialsPlugin)
    paneRef.current.instance = pane

    return () => {
      paneRef.current.instance = null
      pane.dispose()
    }
  }, [])

  return paneRef!
}
