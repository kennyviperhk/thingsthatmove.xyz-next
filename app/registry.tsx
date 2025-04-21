'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleTags()
    styledComponentsStyleSheet.instance.clearTag()
    return (
      <style 
        data-styled="active"
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  if (typeof window !== 'undefined') {
    return (
      <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith('$')}>
        {children}
      </StyleSheetManager>
    )
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} shouldForwardProp={(prop) => !prop.startsWith('$')}>
      {children}
    </StyleSheetManager>
  )
} 