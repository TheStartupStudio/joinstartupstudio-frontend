import {AppointmentModel, ViewState, DayView } from '@devexpress/dx-react-scheduler';
import {
    Appointments,
    AppointmentTooltip,
    DateNavigator,
    MonthView,
    WeekView,
    Scheduler,
    TodayButton,
    Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui';
import {useState} from "react";
import {Paper} from "@mui/material";
import './index.css'



const TestCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getSchedulerData = () => {
        return [
            {
                title: 'Meeting with John',
                startDate: new Date(2023, 5, 3, 10, 0),
                endDate: new Date(2023, 5, 3, 11, 0),
            },
            {
                title: 'Lunch with Jane',
                startDate: new Date(2023, 5, 5, 15, 0),
                endDate: new Date(2023, 5, 5, 15, 30),
            },
            {
                title: 'Phone call with Bob',
                startDate: new Date(2023, 5, 5, 15, 0),
                endDate: new Date(2023, 5, 5, 15, 30),
            },
        ];
    };


    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    const CustomDateCell = ({ formatDate, ...restProps }) => {
        console.log(formatDate)
        console.log(restProps)
      return  <MonthView.Day
            {...restProps}
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <div>{formatDate(restProps.startDate, { weekday: 'short' })}</div>
            <div>{formatDate(restProps.startDate, { day: 'numeric' })}</div>
        </MonthView.Day>
    };


    return<Paper>
        <Scheduler data={getSchedulerData()}   >
        <ViewState
            defaultCurrentDate={currentDate}
            onCurrentDateChange={(e) => setCurrentDate(e)}
        />
            <MonthView dayCellComponent={(props) => {debugger}}/>
        <Toolbar/>
        <DateNavigator/>
        <TodayButton/>
            <WeekView/>
            <DayView
                intervalCount={7} // show 7 days at a time
                cellDuration={60} // each cell represents 1 hour
                startDayHour={0} // start at midnight
                endDayHour={24} // end at midnight
                // customize the day header cell to display the day of the week
                dayHeaderCellComponent={({ date }) => <div>{days[date.getDay()]}</div>}
                // customize the time cell to display just the hour (e.g. "9am")
                timeCellComponent={({ date }) => <div>{date.toLocaleTimeString([], {hour: 'numeric', hour12: true})}</div>}
                // customize the appointment tooltip to display the appointment title and start/end times
                appointmentTooltipComponent={({ appointmentData }) => (
                    <div>
                        <div>{appointmentData.title}</div>
                        <div>{`${appointmentData.startDate.toLocaleTimeString()} - ${appointmentData.endDate.toLocaleTimeString()}`}</div>
                    </div>
                )}
            />

            <Appointments
                appointmentComponent={({ children, ...restProps }) => (
                    <Appointments.Appointment {...restProps} style={{ height: '5px' }}>
                        {children}
                    </Appointments.Appointment>
                )}
            />
            <AppointmentTooltip/>

    </Scheduler>
    </Paper>

}


export default TestCalendar
