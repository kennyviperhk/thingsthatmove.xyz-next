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
        data-styled-version="6.1.17"
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  if (typeof window !== 'undefined') {
    return (
      <StyleSheetManager enableVendorPrefixes>
        {children}
      </StyleSheetManager>
    )
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} enableVendorPrefixes>
      {children}
    </StyleSheetManager>
  )
} 