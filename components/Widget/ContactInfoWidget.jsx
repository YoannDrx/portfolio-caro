import React from 'react'
import { Icon } from '@iconify/react';

export default function ContactInfoWidget({withIcon, title}) {
  return (
    <>
      {title && <h2 className="cs-widget_title">{title}</h2>}
      <ul className="cs-menu_widget cs-style1 cs-mp0">
        <li>
          {withIcon?<span className='cs-accent_color'><Icon icon="material-symbols:add-call-rounded" /></span>:''}
          +33684181884
        </li>
        <li>
          {withIcon?<span className='cs-accent_color'><Icon icon="mdi:envelope" /></span>:''}
          contact@carolinesenyk.fr
        </li>
        <li>
          {withIcon?<span className='cs-accent_color'><Icon icon="mdi:map-marker" /></span>:''}
          Paris, 75020<br/>France
        </li>
      </ul>
    </>
  )
}
