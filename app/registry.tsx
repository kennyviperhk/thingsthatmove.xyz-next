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
    // Clear the sheet for reuse
    styledComponentsStyleSheet.instance.clearTag()
    // Parse the styles to remove the surrounding <style> tags
    const cleanStyles = styles.replace(/<style[^>]*>|<\/style>/g, '')
    return (
      <style
        data-styled="true"
        dangerouslySetInnerHTML={{ __html: cleanStyles }}
      />
    )
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
} 