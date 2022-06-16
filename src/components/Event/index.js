import React from 'react'
import styles from './event.module.css'

export default function Event({ dateTime, title, auther }) {
  return (
    <div className={styles.event}>
      <h4 className={styles.date}>{dateTime}</h4>
      <p className={styles.title}>{title}</p>
      <small className={styles.auther}>{auther}</small>
    </div>
  )
}
