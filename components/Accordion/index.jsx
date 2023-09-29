import React from 'react'
import { useState } from 'react'
import Div from '../Div'

export default function Accordion() {
  const [selected, setSelected] = useState(0)
  const handelToggle = (index) => {
    if(selected === index) {
      return setSelected(null)
    }
    setSelected(index)
  }
  const accordionData = [
    {
      question: 'Quels types de droits d\'auteur pouvez-vous gérer ?',
      answer: 'Nous gérons une large gamme de droits d\'auteur, y compris les droits littéraires, musicaux, artistiques et plus encore. Notre expertise couvre également les droits numériques et les licences.'
    },
    {
      question: 'Comment assurez-vous la protection des œuvres ?',
      answer: 'Nous utilisons des méthodes éprouvées pour enregistrer et protéger les œuvres, y compris des dépôts légaux et des systèmes de gestion des droits numériques.'
    },
    {
      question: 'Quels sont vos tarifs pour la gestion des droits d\'auteur ?',
      answer: 'Nos tarifs varient en fonction de la complexité et de la portée du projet. Nous offrons des consultations gratuites pour évaluer vos besoins spécifiques.'
    },
    {
      question: 'Comment puis-je vous contacter pour discuter de mon projet ?',
      answer: 'Vous pouvez nous contacter via notre formulaire en ligne, par e-mail ou par téléphone. Nous sommes également disponibles pour des réunions en personne ou des appels vidéo.'
    },
    {
      question: 'Fournissez-vous des services de production ?',
      answer: 'Oui, en plus de la gestion des droits d\'auteur, nous offrons une gamme complète de services de production, y compris la planification, le développement et la post-production.'
    },
  ]
  return (
    <Div className="cs-accordians cs-style1">
      {accordionData.map((item, index)=>(
        <Div className={`cs-accordian ${selected===index?'active':''}`} key={index}>
          <Div className="cs-accordian_head" onClick={()=>handelToggle(index)}>
            <h2 className="cs-accordian_title">{item.question}</h2>
            <span className="cs-accordian_toggle cs-accent_color">
              <svg width={15} height={8} viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L7.5 7.5L15 0H0Z" fill="currentColor" />
              </svg>                    
            </span>
          </Div>
          <Div className='cs-accordian_body'>
            <Div className="cs-accordian_body_in">{item.answer}</Div>
            </Div>
        </Div>
      ))}
    </Div>
  )
}
