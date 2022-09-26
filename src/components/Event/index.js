import React from 'react'
import styles from './event.module.css'
import moment from 'moment/moment'

export default function Event({ date, time, title, author }) {
  return (
    <div className={styles.event}>
      <h4 className={styles.date}>
        {moment(date).format('MMMM Do, YYYY')}
        <span className='ps-2' />
        {time}
      </h4>
      <p className={styles.title}>{title}</p>
      <small className={styles.auther}>{author}</small>
    </div>
  )
}
