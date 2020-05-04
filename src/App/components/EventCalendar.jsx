import React, { useEffect, useReducer, useCallback, Fragment } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import styled from 'styled-components';

import useAsync from 'hooks/useAsync';
import endpoints from 'utils/endpoints';
import Spinner from './Spinner';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const formatDate = (date) => date.format('YYYY-MM-DD');

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

const CalendarContainer = styled.div`
  width: 1200px;
`;

export default function EventCalendar() {
  const [state, dispatch] = useReducer(
    calendarStateReducer,
    initialCalendarState
  );
  const { state: asyncReq, send } = useAsync({
    method: 'POST',
    url: endpoints.graphql,
    headers: { 'content-type': 'application/json' },
  });
  const makeRequest = useCallback(send, []);

  const handleOnNavigate = (date) => {
    dispatch({ type: 'CHANGE_DATE', payload: date });
  };
  const handleOnView = (view) => {
    dispatch({ type: 'CHANGE_VIEW', payload: view });
  };

  useEffect(() => {
    if (state.view === 'agenda') {
      return;
    }

    const startDate = formatDate(
      moment(state.currentViewStartDate).startOf(state.view)
    );
    const endDate = formatDate(
      moment(state.currentViewStartDate).endOf(state.view)
    );

    makeRequest({
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
  }, [state.currentViewStartDate, state.view, makeRequest]);

  useEffect(() => {
    if (asyncReq.response) {
      const {
        data: { calendar },
      } = JSON.parse(asyncReq.response);

      const calendarEvents = calendar
        .map((event) => ({
          canceled: event.canceled,
          title: `${event.track.name} (${event.country})`,
          start: new Date(event.firstRaceTimeUtc),
          end: new Date(event.firstRaceTimeUtc),
        }))
        .filter((event) => !event.canceled);

      dispatch({ type: 'EVENTS_LOADED', payload: calendarEvents });
    }
  }, [asyncReq.response]);

  if (asyncReq.isLoading) {
    return <Spinner size="100px" />;
  }

  return (
    <Fragment>
      {asyncReq.error
        ? 'There was an error when getting the data. Please refresh the page.'
        : null}
      <CalendarContainer>
        <Calendar
          date={state.currentViewStartDate}
          view={state.view}
          localizer={localizer}
          events={state.events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onNavigate={handleOnNavigate}
          onView={handleOnView}
        />
      </CalendarContainer>
    </Fragment>
  );
}
