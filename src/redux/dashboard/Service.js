import axios from 'axios'
import axiosInstance from '../../utils/AxiosInstance'
import { getPeriodsSuccess } from './Actions'

export const getPeriods = async () => {
  const response = await axiosInstance.get('/periods')
  return response
}
export const getInstructorPeriods = async (id) => {
  const response = await axiosInstance.get(`/periods/${id}`)
  return response
}

export const getEvents = async () => {
  const response = await axiosInstance.get('/events')
  return response
}

export const postEvent = async (event) => {
  const response = await axiosInstance.post('/events', event)
  return response
}

export const editEvent = async (event, eventId) => {
  const response = await axiosInstance.put(`/events/${eventId}`, event)
  return response
}

export const deleteEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/events/${eventId}`)
  return response
}

export const changeEventDate = async (eventDate, eventId) => {
  const response = await axiosInstance.patch(`/events/${eventId}`, eventDate)
  return response
}
