import React from 'react'
import styles from './event.module.css'

export default function Event({ date, time, title, author }) {
  return (
    <div className={styles.event}>
      <h4 className={styles.date}>
        {date}
        <span className='ps-2' />
        {time}
      </h4>
      <p className={styles.title}>{title}</p>
      <small className={styles.auther}>{author}</small>
    </div>
  )
}
