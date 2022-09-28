import React from "react"
import ContentLoader from "react-content-loader"

const ContentPlaceholder = (props) => (
  <ContentLoader
    width={385}
    height={130}
    viewBox="0 0 510 160"
    backgroundColor="#9877A7"
    foregroundColor="#A8A8A8"
    {...props}
  >
    <circle cx="80" cy="90" r="65" />
    <circle cx="255" cy="90" r="65" />
    <circle cx="430" cy="90" r="65" />
  </ContentLoader>
)

export default ContentPlaceholder