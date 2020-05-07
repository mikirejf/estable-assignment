import React, { useEffect, useReducer } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import toast from 'utils/toast';
import useApi from 'hooks/useApi';
import Spinner from '../Spinner';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Dimmer } from './Styles';

const localizer = momentLocalizer(moment);

const formatDate = (date) => date.format('YYYY-MM-DD');

const generateCalendarQuery = (startDate, endDate) => ({
  query: `{
    calendar (startDate: "${startDate}" endDate: "${endDate}") {
      country
      canceled
      firstRaceTimeUtc
      track {
        name
      }
    }
  }`,
});

const initialCalendarState = {
  currentViewStartDate: new Date(),
  events: [],
  view: 'month',
};

function calendarStateReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return {
        ...state,
        view: action.payload,
      };
    case 'CHANGE_DATE':
      return {
        ...state,
        currentViewStartDate: action.payload,
      };
    case 'EVENTS_LOADED':
      return {
        ...state,
        events: action.payload,
      };
    default: {
      throw Error(`Unknown dispatch action '${action.type}'!`);
    }
  }
}

export default function EventCalendar() {
  const [state, dispatch] = useReducer(
    calendarStateReducer,
    initialCalendarState
  );

  const [{ isLoading, error, response }, fetchEvents] = useApi.post(
    '/graphql',
    { lazy: true }
  );

  const handleOnNavigate = (date) => {
    dispatch({ type: 'CHANGE_DATE', payload: date });
  };

  const handleOnView = (view) => {
    dispatch({ type: 'CHANGE_VIEW', payload: view });
  };

  useEffect(() => {
    // We also populate 'week' and 'day' views if we load data for a whole month
    const startDate = formatDate(
      moment(state.currentViewStartDate).startOf('month')
    );
    const endDate = formatDate(
      moment(state.currentViewStartDate).endOf('month')
    );
    fetchEvents(generateCalendarQuery(startDate, endDate));
  }, [state.currentViewStartDate, fetchEvents]);

  useEffect(() => {
    if (response) {
      const {
        data: { calendar },
      } = JSON.parse(response);

      const calendarEvents = calendar
        .map((event) => ({
          canceled: event.canceled,
          title: `${event.track.name} (${event.country})`,
          start: new Date(event.firstRaceTimeUtc),
          end: new Date(event.firstRaceTimeUtc),
        }))
        .filter((event) => !event.canceled);

      dispatch({
        type: 'EVENTS_LOADED',
        payload: calendarEvents,
      });
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      toast.add({
        type: 'error',
        message: 'Something went wrong. Please try refreshing the page.',
        duration: 5,
      });
    }
  }, [error]);

  return (
    <Container>
      <Calendar
        date={state.currentViewStartDate}
        view={state.view}
        localizer={localizer}
        events={state.events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        onNavigate={handleOnNavigate}
        onView={handleOnView}
      />
      {isLoading && (
        <Dimmer>
          <Spinner size="100px" />
        </Dimmer>
      )}
    </Container>
  );
}
