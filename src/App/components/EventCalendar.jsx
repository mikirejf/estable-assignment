import React, { useEffect, useState, Fragment } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import useAsync from 'hooks/useAsync';
import endpoints from 'utils/endpoints';
import Spinner from './Spinner';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const { state, send } = useAsync({
    method: 'POST',
    url: endpoints.graphql,
    headers: { 'content-type': 'application/json' },
    body: {
      query: `{
        calendar {
          country
          canceled
          firstRaceTimeUtc
          track {
            name
          }
        }
      }`,
    },
  });

  useEffect(() => {
    send();
  }, []);

  useEffect(() => {
    if (state.response) {
      const {
        data: { calendar },
      } = JSON.parse(state.response);
      const calendarEvents = calendar.map((event) => ({
        title: `${event.track.name} (${event.country})`,
        start: new Date(event.firstRaceTimeUtc),
        end: new Date(event.firstRaceTimeUtc),
      }));
      setEvents(calendarEvents);
    }
  }, [state.response]);

  if (state.isLoading) {
    return <Spinner size="100px" />;
  }

  return (
    <Fragment>
      {state.error
        ? 'There was an error when getting the data. Please refresh the page.'
        : null}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </Fragment>
  );
}
